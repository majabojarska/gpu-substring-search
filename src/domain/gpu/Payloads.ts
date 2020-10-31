export interface DataInMessagePayload {
  pattern: Uint8Array;
  text: Uint8Array;
}

export interface DataOutMessagePayload {
  matches: Array<number>;
  error: Error;
}
