import { Grid } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import  {
  BenchmarkChartDataSeries,
} from "../Chart/BenchmarkChart";
import BenchmarkChartSet from "../Common/BenchmarkChartSet";
export interface Props {
  SingleDataSeries: BenchmarkChartDataSeries[];
  GPUDataSeries: BenchmarkChartDataSeries[];
  MultiDataSeries: BenchmarkChartDataSeries[];
}

const GPUTab: React.FC<Props> = (props: Props) => {
  const { SingleDataSeries, MultiDataSeries, GPUDataSeries } = props;
  const [dataSeries, setDataSeries] = useState([]);

  useEffect(() => {
    setDataSeries(SingleDataSeries.concat(MultiDataSeries, GPUDataSeries));
  }, [SingleDataSeries, MultiDataSeries, GPUDataSeries]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <BenchmarkChartSet dataSeries={dataSeries} />
      </Grid>
    </Grid>
  );
};

export default GPUTab;
