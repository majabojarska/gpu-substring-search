import Worker from "worker-loader!./workers/solver.worker";
import {
  DataInMessagePayload,
  DataOutMessagePayload,
} from "./workers/solver.worker";
import { DataProvider, DataSet } from "../data";

export class CpuScheduler {
  private workers = 1;
  private workerPool: Worker[] = [];
  private dataSet = new DataSet(new Uint8Array(), new Uint8Array());

  setWorkerCount(count: number): CpuScheduler {
    this.workers = count;
    this.workerPool.forEach((w) => w.terminate());
    for (let i = 0; i < count; i++) {
      this.workerPool.push(new Worker());
    }
    return this;
  }

  generateDataSet(textLen: number, patternLen: number): CpuScheduler {
    const provider = new DataProvider(textLen, patternLen);
    this.dataSet = provider.getRandomDataSet();
    return this;
  }

  setDataSet(dataSet: DataSet): CpuScheduler {
    this.dataSet = dataSet;
    return this;
  }

  async run(): Promise<number[]> {
    const searchLength =
      this.dataSet.text.length - this.dataSet.pattern.length + 1;
    const perWorkerMin = searchLength / this.workers;
    const results = await Promise.all(
      this.workerPool.map((w, i) => {
        const start = Math.floor(i * perWorkerMin);
        const end = Math.floor((i + 1) * perWorkerMin);
        console.log(start, end);

        return this.runSingle(w, start, end);
      })
    );
    return results.flat();
  }

  private async runSingle(
    worker: Worker,
    start: number,
    end: number
  ): Promise<number[]> {
    return new Promise((resolve, reject) => {
      worker.onmessage = (message: MessageEvent<DataOutMessagePayload>) => {
        if (message.data.error) reject(message.data.error);
        else resolve(message.data.matches);
      };
      const dataIn: DataInMessagePayload = {
        start,
        end,
        ...this.dataSet,
      };
      worker.postMessage(dataIn);
    });
  }
}
