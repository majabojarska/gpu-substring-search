import Worker from "worker-loader!./workers/hello.worker";

const worker = new Worker();

worker.postMessage("Hello from worker");
