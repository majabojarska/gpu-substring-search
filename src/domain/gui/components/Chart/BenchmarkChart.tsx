import React from "react";
import Plot from "react-plotly.js";
import { BenchmarkResult } from "../../../benchmark/core/Benchmark";

interface Props {
  dataSeries: BenchmarkChartDataSeries[];
  title: string;
  plottedStat?: "mean" | "variance" | "sd" | "sem" | "min" | "max";
}

export interface BenchmarkChartDataSeries {
  dataSet: BenchmarkResult[];
  name: string;
}

const BenchmarkChart: React.FC<Props> = (props: Props) => {
  const { dataSeries, title, plottedStat } = props;
  return (
    <Plot
      data={dataSeries.map((series) => ({
        x: series.dataSet.map((d) => +d.name),
        y: series.dataSet.map((d) => d[plottedStat || "mean"]),
        type: "scatter",
        mode: "lines+markers",
        name: series.name,
      }))}
      layout={{
        title,
        xaxis: {
          title: "Problem [długośćTekstu]",
        },
        yaxis: { title: "Czas [ms]" },
      }}
      style={{
        width: "100%",
      }}
    />
  );
};
export default BenchmarkChart;
