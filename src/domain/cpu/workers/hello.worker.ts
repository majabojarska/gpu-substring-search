export interface DataInMessagePayload {
  offset: number;
  chunkLength: number;
  pattern: Uint8Array;
  text: Uint8Array;
}

export interface DataOutMessagePayload {
  matches: Array<number>;
}

class SolverCPU {
  private readonly ctx: Worker = (self as unknown) as Worker;

  constructor() {
    this.ctx.onmessage = this.handleMessage.bind(this);
  }

  handleMessage(message: MessageEvent<DataInMessagePayload>) {
    if (message.data.pattern.length < 1 || message.data.text.length < 1) {
      throw Error("Pattern and text must be at least 1 character long.");
    }
    if (message.data.pattern.length > message.data.text.length) {
      throw Error("Pattern can't be longer than text.");
    }
    const matches = this.solve(message.data);
    this.ctx.postMessage({
      matches: matches,
    });
  }

  solve(data: DataInMessagePayload): Array<number> {
    const foundMatches: Array<number> = [];

    // Maximum valid index to start pattern matching from.
    const maxTextIdx = Math.min(
      data.offset + data.chunkLength - 1,
      data.text.length - data.pattern.length
    );
    for (let textIdx = data.offset; textIdx <= maxTextIdx; ++textIdx) {
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
