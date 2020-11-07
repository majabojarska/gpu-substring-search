import CoreScheduler from "../common/CoreScheduler";
import { DataInMessagePayload } from "./Payloads";
import SolverGPU from "./Solver";

export class GpuScheduler extends CoreScheduler {
  solver: SolverGPU;

  constructor() {
    super();
    this.solver = new SolverGPU();
  }

  async ready(): Promise<this> {
    /** Ready instantly */
    return this;
  }

  async run(): Promise<number[]> {
    const dataIn: DataInMessagePayload = {
      text: this.dataSet.text,
      pattern: this.dataSet.pattern,
      words32BitPerKernel: 2 // See DataInMessagePayload interface docstring
    };
    const dataOut = this.solver.solve(dataIn);
    if (dataOut.error) return Promise.reject(dataOut.error);
    return dataOut.matches;
  }
}
