import { CpuScheduler } from "./CpuScheduler";

/** TEMP TEST */
const scheduler = new CpuScheduler();
scheduler.generateDataSet(100000000, 7).setWorkerCount(4);
const t1 = performance.now();
scheduler.run().then((d) => {
  console.log(d, performance.now() - t1);
});
/** TEMP TEST */

export { CpuScheduler } from "./CpuScheduler";
