import { GpuScheduler } from "./GpuScheduler";

/** TEMP TEST */
(async () => {
  const scheduler = new GpuScheduler().generateDataSet(1_000_000, 7);
  await scheduler.ready();

  for (const i of Array.from(Array(100).keys())) {
    const t1 = performance.now();
    await scheduler.run().then((d) => {
      console.log(d, performance.now() - t1);
    });
  }
})();
/** TEMP TEST */
