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

    return new DataSet(
      this.encoder.encode(text),
      this.encoder.encode(pattern),
      text.length
    );
  }

  private getRandomString(length: number, randomString = ""): string {
    randomString += Math.random().toString(20).substr(2, length);
    if (randomString.length > length) {
      return randomString.slice(0, length);
    }
    return this.getRandomString(length, randomString);
  }
}

export class DataSet {
  constructor(
    public readonly text: Uint8Array,
    public readonly pattern: Uint8Array,
    public readonly length: number
  ) {
    if (this.text.length != this.length) {
      throw Error("DataSet text is not ASCII.");
    }
  }
}
