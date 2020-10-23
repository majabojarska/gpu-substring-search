/**
 * (start, end) will return in pattern matching at positions
 * [start, start+1, ..., end-1]. End index is not included.
 *
 * @param start  Text index to start matching from (zero-based).
 * @param end  Text index to end matching at (non-inclusive).
 * @param pattern  Pattern to find (UTF-8).
 * @param text  Text to search through (UTF-8).
 */
export interface DataInMessagePayload {
  start: number;
  end: number;
  pattern: Uint8Array;
  text: Uint8Array;
}

export interface DataOutMessagePayload {
  matches: Array<number>;
  error: Error;
}

export interface WorkerReadyPayload {
  ready: true;
}
