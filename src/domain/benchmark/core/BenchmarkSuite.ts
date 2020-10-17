import Benchmark, { BenchmarkConfig, BenchmarkResult } from "./Benchmark";
import * as stats from "stats-lite";
export default class BenchmarkSuite {
  private readonly benchmarks: Benchmark[] = [];
  constructor(private readonly name: string) {}

  add(
    name: string,
    fn: () => Promise<void>,
    options?: BenchmarkConfig
  ): BenchmarkSuite {
    options = options || { repeats: 1 };
    this.benchmarks.push(new Benchmark(name, fn, options));
    return this;
  }

  async run(): Promise<BenchmarkResult[]> {
    const results: BenchmarkResult[] = [];

    for (const benchmark of this.benchmarks) {
      const times = await benchmark.runMultiple(benchmark.options.repeats);
      results.push({
        config: benchmark.options,
        min: Math.min(...times),
        max: Math.max(...times),
        mean: stats.mean(times),
        name: benchmark.name,
        sd: stats.stdev(times),
        times,
        variance: stats.variance(times),
        sem: stats.stdev(times) / Math.sqrt(times.length),
      });
    }

    return results;
  }
}
