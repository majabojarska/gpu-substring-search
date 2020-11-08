import { CpuScheduler } from "./CpuScheduler";

/** TEMP TEST */
(async () => {
  const scheduler = new CpuScheduler()
    .setConcurrency(4)
    .generateDataSet(1_000_000, 7);
  await scheduler.ready();

  for (const i of Array.from(Array(100).keys())) {
    const t1 = performance.now();
    await scheduler.run().then((d) => {
      console.log(d, performance.now() - t1);
    });
  }
})();
/** TEMP TEST */
