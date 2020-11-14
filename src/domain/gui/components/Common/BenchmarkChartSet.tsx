import BenchmarkChart, {
  BenchmarkChartDataSeries,
} from "../Chart/BenchmarkChart";

import React from "react";

interface Props {
  dataSeries: BenchmarkChartDataSeries[];
  histogram?: boolean;
}

const BenchmarkChartSet: React.FC<Props> = (props: Props) => {
  return (
    <>
      <BenchmarkChart
        dataSeries={props.dataSeries}
        plottedStat="mean"
        title="Średni czas wykonania"
        histogram={props.histogram}
      />
      <BenchmarkChart
        dataSeries={props.dataSeries}
        plottedStat="max"
        title="Maksymalny czas wykonania"
      />
      <BenchmarkChart
        dataSeries={props.dataSeries}
        plottedStat="min"
        title="Minimalny czas wykonania"
      />
      <BenchmarkChart
        dataSeries={props.dataSeries}
        plottedStat="variance"
        title="Wariancja czasu wykonania"
      />
      <BenchmarkChart
        dataSeries={props.dataSeries}
        plottedStat="sd"
        title="Odchylenie standardowe czasu wykonania"
      />
    </>
  );
};

export default React.memo(
  BenchmarkChartSet,
  (o, n) => o.dataSeries === n.dataSeries && o.histogram === n.histogram
);
