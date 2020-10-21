export interface BenchmarkConfig {
  repeats?: number;
}

export interface BenchmarkResult {
  name: string;
  config: BenchmarkConfig;
  times: number[];
  mean: number;
  variance: number;
  sd: number;
  sem: number;
  min: number;
  max: number;
}

export default class Benchmark {
  constructor(
    public readonly name: string,
    private readonly fn: () => Promise<void>,
    public readonly options: BenchmarkConfig
  ) {}

  public async runSingle(): Promise<number> {
    const start = performance.now();
    await this.fn();
    const stop = performance.now();
    return stop - start;
  }

  public async runMultiple(times: number): Promise<number[]> {
    const results: number[] = [];
    for (let index = 0; index < times; index++) {
      results.push(await this.runSingle());
    }
    return results;
  }
}
