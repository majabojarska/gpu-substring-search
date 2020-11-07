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

class SolverCPU {
  private readonly ctx: Worker = (self as unknown) as Worker;

  constructor() {
    this.ctx.onmessage = this.handleMessage.bind(this);
  }

  handleMessage(message: MessageEvent<DataInMessagePayload>) {
    const dataOut: DataOutMessagePayload = {
      matches: null,
      error: null
    };
    
    try {
      this.checkInputPayload(message);
      dataOut.matches = this.solve(message.data);
    } catch (error) {
      dataOut.error = error;
    }
    
    this.ctx.postMessage(dataOut);
  }

  private checkInputPayload(message: MessageEvent<DataInMessagePayload>) {
    const data = message.data;

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
    if (data.end < 1) {
      throw Error(`Offset end must be a positive integer (is ${data.end}).`);
    }
    if (data.start < 0) {
      throw Error(`Offset must be a non-negative integer (is ${data.start}).`);
    }
    if (data.start > data.end) {
      throw Error(
        `Start index (${data.start}) is greater than end index (${data.end}).`
      );
    }
    if (data.end + data.pattern.length - 1 > data.text.length) {
      throw Error(
        `Pattern matching (pattern.length ${data.pattern.length})
        would reach beyond the available text (length ${data.text.length}).`
      );
    }
  }

  solve(data: DataInMessagePayload): Array<number> {
    const foundMatches: Array<number> = [];

    for (let textIdx = data.start; textIdx < data.end; ++textIdx) {
      let notMatching = false;

      // Compare pattern with text substring at textIdx.
      for (let patternIdx = 0; patternIdx < data.pattern.length; ++patternIdx) {
        const currentTextIdx = textIdx + patternIdx;
        if (data.text[currentTextIdx] != data.pattern[patternIdx]) {
          // At least one character not matching => No match at textIdx.
          notMatching = true;
          break;
        }
      }
      if (notMatching) {
        continue;
      }
      foundMatches.push(textIdx);
    }

    return foundMatches;
  }
}

new SolverCPU();
export default null as unknown;
