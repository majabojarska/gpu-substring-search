/**
 *
 *  @field pattern  Pattern to find (UTF-8).
 *  @field text  Text to search through (UTF-8).
 */
export interface DataInMessageBasePayload {
  pattern: Uint8Array;
  text: Uint8Array;
}

/**
 * @field matches Array of matching indexes
 * @field error Eventual thrown error
 */
export interface DataOutMessageBasePayload {
  matches: number[];
  error: Error;
}
