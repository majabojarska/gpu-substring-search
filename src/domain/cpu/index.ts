import Worker from "worker-loader!./workers/hello.worker";
import { DataInMessagePayload } from "./workers/hello.worker";
const worker = new Worker();

import { DataSet, DataProvider } from "../data/index";
const decoder = new TextDecoder();
const textLen = 10,
  patternLen = 5;
const dataProvider = new DataProvider(textLen, patternLen);
const dataSet: DataSet = dataProvider.getData();

const dataIn: DataInMessagePayload = {
  start: 0,
  end: dataSet.text.length - dataSet.pattern.length + 1,
  pattern: dataSet.pattern,
  text: dataSet.text,
};
// ABCD
//   AB
// endIdx (non-inclusive): 4 - 2 + 1 = 3
console.log(`Text: ${decoder.decode(dataIn.text)}`);
console.log(`Pattern: ${decoder.decode(dataIn.pattern)}`);

worker.postMessage(dataIn);

worker.onmessage = (message) => {
  console.log(`Found matching indices: ${message.data.matches}`);
  console.log(`${message.data.error}`);
};
