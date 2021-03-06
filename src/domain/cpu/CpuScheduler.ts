import Worker from "worker-loader!./workers/Solver.worker";
import CoreScheduler from "../common/CoreScheduler";
import {
  DataInMessagePayload,
  DataOutMessagePayload,
  WorkerReadyPayload,
} from "./workers/Payloads";

interface PoolWorker {
  worker: Worker;
  ready: Promise<void>;
}

/**
 *
 */
export class CpuScheduler extends CoreScheduler {
  private workers: PoolWorker[] = [];

  setConcurrency(n: number): this {
    this.workers.forEach((w) => w.worker.terminate());
    for (let i = 0; i < n; i++) {
      const worker = new Worker();
      const ready = new Promise<void>((resolve, reject) => {
        worker.onmessage = (message: MessageEvent<WorkerReadyPayload>) => {
          message.data.ready ? resolve() : reject();
        };
      });
      this.workers.push({ worker, ready });
    }
    return this;
  }

  async ready(): Promise<this> {
    await Promise.all(this.workers.map((w) => w.ready));
    return this;
  }

  async run(): Promise<number[]> {
    const maxEndIndex =
      this.dataSet.text.length - this.dataSet.pattern.length + 1;
    const perWorkerRange = maxEndIndex / this.workers.length;
    const results = await Promise.all(
      this.workers.map((w, i) => {
        const start = Math.floor(i * perWorkerRange);
        const end = Math.floor((i + 1) * perWorkerRange);
        return this.runSingle(w.worker, start, end);
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
