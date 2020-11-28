import React, { useEffect, useState } from "react";

import { BenchmarkResult } from "../../../benchmark/core/Benchmark";
import Plot from "react-plotly.js";
import { useTheme } from "@material-ui/core/styles";
import { Data, d3 } from "plotly.js";

interface Props {
  dataSeries: BenchmarkChartDataSeries[];
  title: string;
  plottedStat?: "mean" | "variance" | "sd" | "sem" | "min" | "max";
  histogram?: boolean;
  plottedErrors?: "mean" | "variance" | "sd" | "sem" | "min" | "max";
}

export interface BenchmarkChartDataSeries {
  dataSet: BenchmarkResult[];
  name: string;
}

const colors = [
  "#1f77b4",
  "#ff7f0e",
  "#2ca02c",
  "#d62728",
  "#9467bd",
  "#8c564b",
  "#e377c2",
  "#7f7f7f",
  "#bcbd22",
  "#17becf",
];

const BenchmarkChart: React.FC<Props> = (props: Props) => {
  const { dataSeries, title, plottedStat, histogram, plottedErrors } = props;
  const [hisPoint, setHisPoint] = useState(0);
  const [hisData, setHisData] = useState([]);
  const [plotData, setPlotData] = useState<Data[]>([]);
  const theme = useTheme();
  useEffect(() => {
    const hisData = dataSeries.map((series) => ({
      x: series.dataSet
        .filter((d) => +d.name === hisPoint)
        .map((d) => d.times)
        .flat(),
      type: "histogram",
      name: series.name,
    }));
    setHisData(hisData);
  }, [hisPoint, dataSeries]);

  useEffect(() => {
    const plotData: any = dataSeries.map((series, i) => {
      return [
        {
          x: series.dataSet.map((d) => +d.name),
          y: series.dataSet.map((d) => d[plottedStat || "mean"]),
          type: "scatter",
          mode: "lines+markers",
          name: series.name,
          line: {
            color: colors[i % colors.length],
          },
          marker: {
            color: colors[i % colors.length],
          },
          error_y: {
            type: "data",
            array: series.dataSet.map((d) => d["max"] - d["mean"]),
            arrayminus: series.dataSet.map((d) => d["mean"] - d["min"]),
            symmetric: false,
            visible: !!plottedErrors,
          },
          legendgroup: series.name + i,
        },
        plottedErrors && {
          x: series.dataSet
            .map((d) => +d.name)
            .concat(series.dataSet.map((d) => +d.name).reverse()),
          y: series.dataSet
            .map((d) => d["mean"] + d["sd"])
            .concat(series.dataSet.map((d) => d["mean"] - d["sd"]).reverse()),
          type: "scatter",
          name: series.name,
          fill: "tozerox",
          fillcolor: colors[i % colors.length] + 44,
          line: { color: "transparent" },
          legendgroup: series.name + i,
          showlegend: false,
        },
      ];
    });

    setPlotData(plotData.flat().filter((x: boolean) => !!x));
  }, [dataSeries]);

  return (
    <>
      <Plot
        data={plotData}
        layout={{
          title,
          xaxis: {
            title: "Problem [długośćTekstu]",
          },
          yaxis: { title: "Czas [ms]", rangemode: "tozero" },
          plot_bgcolor: theme.palette.background.default,
        }}
        onClick={(data) => setHisPoint(+data.points[0].x || 0)}
        style={{
          width: "100%",
        }}
      />
      {histogram && !!hisData.length && (
        <Plot
          data={hisData}
          layout={{
            barmode: "stack",
            title: `Histogram - ${title}, ${hisPoint}`,
            xaxis: {
              title: "Czas [ms]",
            },
            yaxis: { title: "Wystąpienia" },
          }}
          style={{
            width: "100%",
          }}
        />
      )}
    </>
  );
};
export default BenchmarkChart;
