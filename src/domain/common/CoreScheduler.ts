import { DataProvider } from "../data/DataProvider";
import { DataSet } from "../data/DataSet";

export default abstract class CoreScheduler {
  protected dataSet = new DataSet(new Uint8Array(), new Uint8Array());

  generateDataSet(textLen: number, patternLen: number): this {
    const provider = new DataProvider(textLen, patternLen);
    this.dataSet = provider.getRandomDataSet();
    return this;
  }

  setDataSet(dataSet: DataSet): this {
    this.dataSet = dataSet;
    return this;
  }

  public abstract ready(): Promise<this>;
}
