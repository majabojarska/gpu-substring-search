import { Grid } from "@material-ui/core";
import React from "react";
import BenchmarkChart, {
  BenchmarkChartDataSeries,
} from "../Chart/BenchmarkChart";
export interface Props {
  SingleDataSeries: BenchmarkChartDataSeries[];
  GPUDataSeries: BenchmarkChartDataSeries[];
  MultiDataSeries: BenchmarkChartDataSeries[];
}

const GPUTab: React.FC<Props> = (props: Props) => {
  const { SingleDataSeries, MultiDataSeries, GPUDataSeries } = props;

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <BenchmarkChart
          dataSeries={SingleDataSeries.concat(MultiDataSeries, GPUDataSeries)}
          plottedStat="mean"
          title="Średni czas wykonania"
        />
        <BenchmarkChart
          dataSeries={SingleDataSeries.concat(MultiDataSeries, GPUDataSeries)}
          plottedStat="max"
          title="Maksymalny czas wykonania"
        />
        <BenchmarkChart
          dataSeries={SingleDataSeries.concat(MultiDataSeries, GPUDataSeries)}
          plottedStat="min"
          title="Minimalny czas wykonania"
        />
      </Grid>
    </Grid>
  );
};

export default GPUTab;
