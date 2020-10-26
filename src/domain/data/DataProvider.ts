import { DataSet } from "./DataSet";

export class DataProvider {
  private readonly encoder = new TextEncoder();

  constructor(
    private readonly textLen: number,
    private readonly patternLen: number
  ) {}

  public getRandomDataSet(): DataSet {
    const text = this.getRandomString(this.textLen);
    const subStringIndex = Math.round(
      Math.random() * (text.length - this.patternLen)
    );
    const pattern = text.substring(
      subStringIndex,
      subStringIndex + this.patternLen
    );

    return this.createDataSet(text, pattern);
  }

  public getCustomDataSet(text: string, pattern: string): DataSet {
    return this.createDataSet(text, pattern);
  }

  private createDataSet(text: string, pattern: string): DataSet {
    const textEncoded = this.encoder.encode(text);
    const patternEncoded = this.encoder.encode(pattern);

    if (text.length != textEncoded.byteLength) {
      throw Error("DataSet text is not ASCII.");
    }

    const sharedText = new Uint8Array(
      new SharedArrayBuffer(textEncoded.byteLength)
    );
    const sharedPattern = new Uint8Array(
      new SharedArrayBuffer(patternEncoded.byteLength)
    );
    sharedText.set(textEncoded, 0);
    sharedPattern.set(patternEncoded, 0);
    return new DataSet(sharedText, sharedPattern);
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
