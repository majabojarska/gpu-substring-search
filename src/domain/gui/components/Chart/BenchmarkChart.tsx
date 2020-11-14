import React, { useEffect, useState } from "react";

import { BenchmarkResult } from "../../../benchmark/core/Benchmark";
import Plot from "react-plotly.js";
import { useTheme } from "@material-ui/core/styles";

interface Props {
  dataSeries: BenchmarkChartDataSeries[];
  title: string;
  plottedStat?: "mean" | "variance" | "sd" | "sem" | "min" | "max";
  histogram?: boolean;
}

export interface BenchmarkChartDataSeries {
  dataSet: BenchmarkResult[];
  name: string;
}

const BenchmarkChart: React.FC<Props> = (props: Props) => {
  const { dataSeries, title, plottedStat, histogram } = props;
  const [hisPoint, setHisPoint] = useState(0);
  const [hisData, setHisData] = useState([]);
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

  return (
    <>
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
