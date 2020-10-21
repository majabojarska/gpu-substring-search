export class DataProvider {
  private readonly encoder = new TextEncoder();
  constructor(
    private readonly textLen: number,
    private readonly patternLen: number
  ) {}

  public getData(): DataSet {
    const text = this.getRandomString(this.textLen);
    const subStringIndex = Math.round(
      Math.random() * (text.length - this.patternLen)
    );
    const pattern = text.substring(
      subStringIndex,
      subStringIndex + this.patternLen
    );

    const textEncoded = this.encoder.encode(text);
    const patternEncoded = this.encoder.encode(pattern);

    if (text.length != this.textLen) {
      throw Error("DataSet text is not ASCII.");
    }

    return new DataSet(textEncoded, patternEncoded);
  }

  private getRandomString(length: number): string {
    const stringArray = [];

    let currentTextLength = 0;

    while (currentTextLength < length) {
      const newRandomString = Math.random().toString(20);
      stringArray.push(newRandomString);
      currentTextLength += newRandomString.length;
    }
    
    return stringArray.join("").slice(0, length);
  }
}

export class DataSet {
  constructor(
    public readonly text: Uint8Array,
    public readonly pattern: Uint8Array
  ) {}
}
