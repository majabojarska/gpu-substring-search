import { DataProvider } from "../data/DataProvider";
import { GpuScheduler } from "./GpuScheduler";

/** TEMP TEST */
(async () => {
  const scheduler = new GpuScheduler().generateDataSet(1_000_000, 7);
  
  const provider = new DataProvider(10,5);

  scheduler.setDataSet(provider.getCustomDataSet("ultricies Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolorultricies. Aenean massa. Cum sociis natoque penatibus ultricieset magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis,.", "ultricies"));
  await scheduler.ready();

  for (const i of Array.from(Array(100).keys())) {
    const t1 = performance.now();
    await scheduler.run().then((d) => {
      console.log(d, performance.now() - t1);
    });
  }
})();

// import { GPU } from "gpu.js";
// const gpu = new GPU();
// const multiplyMatrix = 

// const c = multiplyMatrix() as number[][];

// console.log('====================================');
// console.log(gpu);
// console.log(c);
// console.log('====================================');

/** TEMP TEST */
