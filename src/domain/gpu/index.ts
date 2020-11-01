import { DataInMessagePayload, DataOutMessagePayload } from "./Payloads";
import { DataProvider } from "../data/DataProvider";
import SolverGPU from "./Solver";

/** TEST **/
const provider = new DataProvider(1_000_000, 7);
const dataset = provider.getRandomDataSet();
const dataIn: DataInMessagePayload = {
  text: dataset.text,
  pattern: dataset.pattern,
};
const solverGPU = new SolverGPU();
const p1 = performance.now();
const dataOut: DataOutMessagePayload = solverGPU.solve(dataIn);
console.log(performance.now() - p1);

console.log("====================================");
console.log("Matches=", dataOut.matches);
console.error("Error=", dataOut.error);
console.log("====================================");
/** TEST **/
