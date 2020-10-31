import { DataInMessagePayload, DataOutMessagePayload } from "./Payloads";
import { DataProvider } from "../data/DataProvider";
import SolverGPU from "./Solver";

/** TEST **/
const provider = new DataProvider(1000, 10);
// const dataset = provider.getCustomDataSet("lorem ipsum dolor sit", "sum");
const dataset = provider.getRandomDataSet();
const dataIn: DataInMessagePayload = {
  text: dataset.text,
  pattern: dataset.pattern,
};
const solverGPU = new SolverGPU();
const dataOut: DataOutMessagePayload = solverGPU.solve(dataIn);

console.log("====================================");
console.log("Matches=", dataOut.matches);
console.error("Error=", dataOut.error);
console.log("====================================");
/** TEST **/
