import { DataInMessageBasePayload } from "../../common/Payloads";

/**
 * (start, end) will return in pattern matching at positions
 * [start, start+1, ..., end-1]. End index is not included.
 *
 * @field start  Text index to start matching from (zero-based).
 * @field end  Text index to end matching at (non-inclusive).
 * @field pattern  Pattern to find (UTF-8).
 * @field text  Text to search through (UTF-8).
 */
export interface DataInMessagePayload extends DataInMessageBasePayload {
  start: number;
  end: number;
}

export { DataOutMessageBasePayload as DataOutMessagePayload } from "../../common/Payloads";

export interface WorkerReadyPayload {
  ready: true;
}
