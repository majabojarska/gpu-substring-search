import {
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  Grid,
  Switch,
  TextField,
} from "@material-ui/core";
import React, { useState } from "react";
import { textFieldProps } from "../Common/Props";
import { GeneralConfig } from "../../App";
import { BenchmarkChartDataSeries } from "../Chart/BenchmarkChart";
import BenchmarkSuite from "../../../benchmark/core/BenchmarkSuite";
import { DataProvider } from "../../../data";
import { HighlightOff } from "@material-ui/icons";
import BenchmarkChartSet from "../Common/BenchmarkChartSet";

export interface Props {
  config: GeneralConfig;
  dataSeries: BenchmarkChartDataSeries[];
  setDataSeries: React.Dispatch<
    React.SetStateAction<BenchmarkChartDataSeries[]>
  >;
}

const GPUTab: React.FC<Props> = (props: Props) => {
  const { config, dataSeries, setDataSeries } = props;
  const [repeats, setRepeats] = useState(10);
  const [kernels, setKernels] = useState(2);
  const [loading, setLoading] = useState(false);
  const [showHis, setShowHis] = useState(false);

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
      ); // todo: add kernels to benchmark config
    }
    const newDataSeries = {
      dataSet: await bs.run(),
      name: `GPU L ${kernels}, Wz. ${config.patternLength}, Pwt. ${repeats}`,
    };
    setDataSeries([...dataSeries, newDataSeries]);
    setLoading(false);
  };

  return (
    <Grid container spacing={2}>
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
      <Grid item container justify="flex-end" xs={6}>
        <TextField
          onChange={(e) => setKernels(+e.target.value)}
          value={kernels}
          {...textFieldProps}
          label="Długość wyniku kernela (x32b)"
          InputProps={{
            inputProps: { min: 1, max: 4, style: { width: "218px" } },
          }}
        />
      </Grid>
      <Grid item xs={6} container alignItems="center">
        <FormControlLabel
          control={
            <Switch
              color="primary"
              checked={showHis}
              onChange={(v) => setShowHis(v.target.checked)}
            />
          }
          label="Pokaż histogram"
        />
      </Grid>
      <Grid item xs={12}>
        <BenchmarkChartSet dataSeries={dataSeries} histogram={showHis} />
      </Grid>
    </Grid>
  );
};

export default GPUTab;