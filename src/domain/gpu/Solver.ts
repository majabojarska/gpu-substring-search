import {
  GPU,
  KernelFunction,
  GPUMode,
  GPUInternalMode,
  KernelOutput,
} from "gpu.js";
import {
  DataInMessagePayload,
  DataOutMessagePayload,
  SolveResultPayload,
} from "./Payloads";

export default class SolverGPU {
  private gpu: GPU;

  constructor(mode: GPUMode | GPUInternalMode = "gpu") {
    this.gpu = new GPU({ mode });
  }

  solve(dataIn: DataInMessagePayload): DataOutMessagePayload {
    const dataOut: DataOutMessagePayload = {
      matches: null,
      error: null,
      kernelCount: null,
    };

    try {
      this.checkInputPayload(dataIn);
      const { matches, kernelCount } = this._solve(dataIn);
      dataOut.matches = matches;
      dataOut.kernelCount = kernelCount;
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
    if (data.words32BitPerKernel > 4 || data.words32BitPerKernel < 1) {
      throw Error(`words32BitPerKernel must be in range [1;4]`);
    }
  }

  private _solve(data: DataInMessagePayload): SolveResultPayload {
    // Text length rounded up to nearest chunksPerKernel*32 multiple + text end overlap
    const positionsPerKernel = data.words32BitPerKernel * 32;
    const paddedTextLen =
      Math.ceil(data.text.length / positionsPerKernel) * positionsPerKernel +
      data.pattern.length -
      1;
    const paddedText = new Uint8Array(paddedTextLen);
    paddedText.set(data.text, 0);

    const kernelCount = Math.ceil(data.text.length / positionsPerKernel);
    const kernel = this.gpu
      .createKernel(this.kernelFunction)
      .setOutput([kernelCount]);
    const output: KernelOutput = kernel(
      (paddedText as unknown) as number[],
      (data.pattern as unknown) as number[],
      data.pattern.length,
      data.words32BitPerKernel
    );

    const maxValidMatchPosition = data.text.length - data.pattern.length;

    const result = {
      matches: this.extractMatches(
        output,
        maxValidMatchPosition,
        data.words32BitPerKernel
      ),
      kernelCount: kernelCount,
    };

    return result;
  }

  private extractMatches(
    output: KernelOutput,
    maxValidMatchPosition: number,
    words32BitPerKernel: number
  ) {
    const matches: number[] = [];

    (output as Float32Array[]).forEach((chunkArray, chunkArrayIdx) => {
      let reachedMaxPos = false;

      for (let chunkIdx = 0; chunkIdx < words32BitPerKernel; chunkIdx++) {
        // Chunk is a 32-bit number
        for (let bitIdx = 0; bitIdx < 32; bitIdx++) {
          // Current position relative to text start
          const currentAbsPos =
            chunkArrayIdx * words32BitPerKernel * 32 + chunkIdx * 32 + bitIdx;
          if (currentAbsPos > maxValidMatchPosition) {
            reachedMaxPos = true;
            break;
          } else if (chunkArray[chunkIdx] & (1 << bitIdx)) {
            // Found match
            matches.push(currentAbsPos);
          }
        }
        if (reachedMaxPos) {
          break;
        }
      }
    });

    return matches;
  }

  /**
   * Each kernel handles 32*chunkCount positions.
   * Returns number[] of size 4.
   */
  private kernelFunction: KernelFunction = function (
    text: number[],
    pattern: number[],
    patternLen: number,
    chunkCount: number
  ): number[] {
    const startPosition: number = this.thread.x * 32 * chunkCount;

    // Allocate 32x4 bits, each bit is a match flag.
    const matches: number[] = [0, 0, 0, 0];

    // Iterate over 32-bit chunks
    for (let chunkIdx = 0; chunkIdx < chunkCount; chunkIdx++) {
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
