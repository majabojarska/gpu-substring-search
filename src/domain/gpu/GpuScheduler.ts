import CoreScheduler from "../common/CoreScheduler";
import { DataInMessagePayload } from "./Payloads";
import SolverGPU from "./Solver";

export class GpuScheduler extends CoreScheduler {
  solver: SolverGPU;
  private words32BitPerKernel = 1

  constructor() {
    super();
    this.solver = new SolverGPU();
  }

  /**
   * @param n Defines how many 32-position multiples are handled by each kernel.
   */
  public setConcurrency(n:number):this{
    this.words32BitPerKernel = n
    return this
  }

  /** Ready instantly */
  async ready(): Promise<this> {
    return this;
  }

  async run(): Promise<number[]> {
    const dataIn: DataInMessagePayload = {
      text: this.dataSet.text,
      pattern: this.dataSet.pattern,
      words32BitPerKernel: this.words32BitPerKernel
    };
    const dataOut = this.solver.solve(dataIn);
    if (dataOut.error) return Promise.reject(dataOut.error);
    return dataOut.matches;
  }
}