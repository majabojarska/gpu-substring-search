import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import "./Chart.scss";

const Chart: React.FC = () => {
  const [dailyData, setDailyData] = useState([3, 41, 213, 1325, 324, 3452]);

  const lineChart = dailyData.length ? (
    <Line
      data={{
        labels: ['1', '2', '3', '4', '5', '6'],
        datasets: [
          {
            data: dailyData,
            label: "Data",
            borderColor: "#3333ff",
            fill: true,
          },
        ],
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
