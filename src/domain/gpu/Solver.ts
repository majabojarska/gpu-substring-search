import {
  GPU,
  KernelFunction,
  GPUMode,
  GPUInternalMode,
  IKernelRunShortcut,
  KernelOutput,
} from "gpu.js";
import { DataInMessagePayload, DataOutMessagePayload } from "./Payloads";

export default class SolverGPU {
  private gpu: GPU;
  private kernel: IKernelRunShortcut;

  constructor(mode: GPUMode | GPUInternalMode = "gpu") {
    this.gpu = new GPU({ mode });
    this.kernel = this.gpu
      .createKernel(this.kernelFunction)
      .setPrecision("unsigned");
  }

  solve(dataIn: DataInMessagePayload): DataOutMessagePayload {
    const dataOut: DataOutMessagePayload = {
      matches: null,
      error: null,
    };

    try {
      this.checkInputPayload(dataIn);
      dataOut.matches = this._solve(dataIn);
    } catch (error) {
      dataOut.error = error;
    }

    return dataOut;
  }

  private checkInputPayload(data: DataInMessagePayload) {
    if (data.text.length < 1) {
      throw Error(
        `Text must be at least 1 character long (is ${data.text.length}).`
      );
    }
    if (data.pattern.length < 1) {
      throw Error(
        `Pattern must be at least 1 character long (is ${data.pattern.length}).`
      );
    }
    if (data.pattern.length > data.text.length) {
      throw Error(
        `Pattern can't be longer than text 
            (pattern length: ${data.pattern.length}, 
            text length: ${data.text.length})`
      );
    }
  }

  private _solve(data: DataInMessagePayload): number[] {
    // Text length rounded up to nearest 128 multiple + text end overlap
    const paddedTextLen =
      Math.ceil(data.text.length / 128) * 128 + data.pattern.length - 1;
    const paddedText = new Uint8Array(paddedTextLen);
    paddedText.set(data.text, 0);

    const kernelCount = Math.ceil(data.text.length / 128);

    const searchKernel = this.kernel.setOutput([kernelCount]);
    const output: KernelOutput = searchKernel(
      (paddedText as unknown) as number[],
      (data.pattern as unknown) as number[],
      data.pattern.length
    );

    const maxValidMatchPosition = data.text.length - data.pattern.length;
    return this.extractMatches(output, maxValidMatchPosition);
  }

  private extractMatches(output: KernelOutput, maxValidMatchPosition: number) {
    const matches: number[] = [];

    (output as Float32Array[]).forEach((chunkArray, chunkArrayIdx) => {
      // chunkArray contains 4, 32-bit numbers
      chunkArray.forEach((chunk, chunkIdx) => {
        // Chunk is a 32-bit number
        for (let bitIdx = 0; bitIdx < 32; bitIdx++) {
          if (chunk & (1 << bitIdx)) {
            // Found match
            matches.push(chunkArrayIdx * 128 + chunkIdx * 32 + bitIdx);
            // bitPerPos.push(1);
          } else {
            // bitPerPos.push(0);
          }
        }
      });
    });

    // Filter out matches at pos>maxMatchPosition
    const filteredMatches: number[] = [];
    matches.forEach((pos) =>
      pos <= maxValidMatchPosition ? filteredMatches.push(pos) : null
    );
    return matches;
  }

  /**
   * Each kernel handles 128 positions.
   * Returns number[] of size 4.
   */
  private kernelFunction: KernelFunction = function (
    text: number[],
    pattern: number[],
    patternLen: number
  ): number[] {
    const startPosition: number = this.thread.x * 128;

    // Allocate 32x4 bits, each bit is a match flag.
    const matches: number[] = [0, 0, 0, 0];

    // Iterate over 32-bit chunks
    for (let chunkIdx = 0; chunkIdx < 4; chunkIdx++) {
      // Iterate over bits in chunk
      for (let bitPosInChunk = 0; bitPosInChunk < 32; bitPosInChunk++) {
        // Match pattern on relativePos
        let isMatch = true;
        for (let patternIdx = 0; patternIdx < patternLen; patternIdx++) {
          if (
            text[startPosition + chunkIdx * 32 + bitPosInChunk + patternIdx] !=
            pattern[patternIdx]
          ) {
            // Mismatch, skip to next pattern matching position
            isMatch = false;
            break;
          }
        }
        if (isMatch) {
          // Match found, set flag to 1
          matches[chunkIdx] = matches[chunkIdx] | (1 << bitPosInChunk);
        }
      }
    }

    return matches;
  };
}
