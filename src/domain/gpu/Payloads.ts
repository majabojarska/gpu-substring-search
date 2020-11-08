import { DataInMessageBasePayload } from "../common/Payloads";

import { DataOutMessageBasePayload } from "../common/Payloads";

/**
 * @field words32BitPerKernel Defines how many 32-position multiples are handled by each kernel.
 */
export interface DataInMessagePayload extends DataInMessageBasePayload {
  words32BitPerKernel: number;
}

export interface SolveResultPayload {
  matches: number[];
  kernelCount: number;
}

/**
 * @field kernelCount Number of kernels the Solver used.
 */
export interface DataOutMessagePayload extends DataOutMessageBasePayload {
  kernelCount: number;
}
