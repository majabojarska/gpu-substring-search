import { GPU } from "gpu.js";

const gpu = new GPU();
const kernel = gpu.createKernel(
  function () {
    return this.thread.x;
  },
  { output: [100] }
);

console.log(kernel());
