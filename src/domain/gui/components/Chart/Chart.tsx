import React from "react";
import { Line } from "react-chartjs-2";
import { Dataset } from "../../App";
import "./Chart.scss";

interface ChartProps {
  datasets: Dataset[];
}

const Chart = (props: ChartProps) => {
  const { datasets } = props;

  const lineChart = datasets.length ? (
    <Line
      data={{
        labels: [1, 2, 3, 4, 5, 6],
        datasets: datasets,
      }}
      options={{
        scales: {
          xAxes: [{ gridLines: { display: true } }],
          yAxes: [{ gridLines: { display: true } }],
        },
      }}
    />
  ) : null;
  return <div className="container">{lineChart}</div>;
};
export default Chart;
