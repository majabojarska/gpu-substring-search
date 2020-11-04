import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Icon,
  TextField,
} from "@material-ui/core";
import React, { useState } from "react";
import { textFieldProps } from "../../components/Common/Props";
import { GeneralConfig } from "../../App";
import BenchmarkChart, {
  BenchmarkChartDataSeries,
} from "../Chart/BenchmarkChart";
import BenchmarkSuite from "../../../benchmark/core/BenchmarkSuite";
import { DataProvider } from "../../../data";
import { HighlightOff } from "@material-ui/icons";
export interface Props {
  config: GeneralConfig;
}

const SingleCoreTab: React.FC<Props> = (props: Props) => {
  const { config } = props;
  const [repeats, setRepeats] = useState(10);
  const [dataSeries, setDataSeries] = useState<BenchmarkChartDataSeries[]>([]);
  const [loading, setLoading] = useState(false);

  const testHandler = async () => {
    const bs = new BenchmarkSuite(`Single Core x${repeats}`);
    setLoading(true);
    for (let i = 0; i < config.dataSetRepeats; i++) {
      let textLength;
      if (config.exponential)
        textLength = config.textLength * config.textLengthDelta ** (i + 1);
      else textLength = config.textLength + i * config.textLengthDelta;

      const patternLength = config.patternLength;
      const provider = new DataProvider(textLength, patternLength);
      bs.add(
        textLength.toString(),
        () => new Promise((r) => setTimeout(r, 10)),
        { repeats }
      );
    }
    const newDataSeries = {
      dataSet: await bs.run(),
      name: `Wzorzec ${config.patternLength}, Powtórzenia ${repeats}`,
    };
    setDataSeries([...dataSeries, newDataSeries]);
    setLoading(false);
  };

  return (
    <Grid container spacing={1}>
      <Grid item container justify="flex-end" xs={6}>
        <TextField
          onChange={(e) => setRepeats(+e.target.value)}
          value={repeats}
          {...textFieldProps}
          label="Liczba powtórzeń problemu"
        />
      </Grid>
      <Grid item xs={6} container alignItems="center">
        <Button variant="outlined" color="primary" onClick={testHandler}>
          Uruchom
        </Button>
        <Box pl={1}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setDataSeries([])}
            title="Reset"
          >
            <HighlightOff />
          </Button>
        </Box>
        <Box pl={1}>{loading && <CircularProgress size={8 * 4} />}</Box>
      </Grid>
      <Grid item xs={12}>
        <BenchmarkChart
          dataSeries={dataSeries}
          plottedStat="mean"
          title="Średni czas wykonania"
        />
        <BenchmarkChart
          dataSeries={dataSeries}
          plottedStat="max"
          title="Maksymalny czas wykonania"
        />
      </Grid>
    </Grid>
  );
};

export default SingleCoreTab;
