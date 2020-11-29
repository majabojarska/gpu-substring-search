import {
  GPU,
  KernelFunction,
  GPUMode,
  GPUInternalMode,
  KernelOutput,
  IKernelRunShortcut,
} from "gpu.js";
import { DataInMessagePayload, DataOutMessagePayload } from "./Payloads";

export default class SolverGPU {
  private gpu: GPU;
  private kernel: IKernelRunShortcut | null = null;
  private lastOutput = 0;

  constructor(mode: GPUMode | GPUInternalMode = "gpu") {
    this.gpu = new GPU({ mode });
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
    // Text length rounded up to nearest chunksPerKernel*32 multiple + text end overlap
    const { text, pattern } = data;
    const nKernels = text.length - pattern.length;

    const kernel = this.getKernel(nKernels).setConstants({
      patternLength: pattern.length,
    });
    const output: KernelOutput = kernel(
      (text as unknown) as number[],
      (pattern as unknown) as number[]
    );

    return (output as number[]).filter((matchPosition) => matchPosition !== -1);
  }

  private getKernel(n: number) {
    if (n == this.lastOutput) {
      return this.kernel;
    } else {
      this.lastOutput = n;
      return (this.kernel = this.gpu.createKernel(this.kernelFunction, {
        optimizeFloatMemory: true,
        output: [n],
      }));
    }
  }

  /**
   * Each kernel handles exact matching on one position.
   * Returns -1 if not matching.
   * Returns matching position (this.thread.x) if match is found.
   */
  private kernelFunction: KernelFunction<
    [number[], number[]],
    { patternLength: number }
  > = function (text: number[], pattern: number[]): number {
    // Match pattern on relativePos
    for (
      let patternIdx = 0;
      patternIdx < this.constants.patternLength;
      patternIdx++
    ) {
      if (text[this.thread.x + patternIdx] != pattern[patternIdx]) {
        return -1;
      }
    }
    return this.thread.x;
  };
}
