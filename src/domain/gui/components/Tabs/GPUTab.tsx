import React, { useCallback, useState } from "react";

import { BenchmarkChartDataSeries } from "../Chart/BenchmarkChart";
import BenchmarkChartSet from "../Common/BenchmarkChartSet";
import BenchmarkSuite from "../../../benchmark/core/BenchmarkSuite";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { DataProvider } from "../../../data/DataProvider";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { GeneralConfig } from "../../App";
import { GpuScheduler } from "../../../gpu/GpuScheduler";
import Grid from "@material-ui/core/Grid";
import HighlightOff from "@material-ui/icons/HighlightOff";
import Switch from "@material-ui/core/Switch";
import TextField from "@material-ui/core/TextField";
import { textFieldProps } from "../Common/Props";

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
  const [loading, setLoading] = useState(false);
  const [showHis, setShowHis] = useState(false);

  const testHandler = useCallback(async () => {
    setLoading(true);
    const bs = new BenchmarkSuite(`GPU x${repeats}`);
    const scheduler = new GpuScheduler().setConcurrency(1);
    await scheduler.ready();

    for (let i = 0; i < config.dataSetRepeats; i++) {
      let textLength: number;
      if (config.exponential)
        textLength = config.textLength * config.textLengthDelta ** (i + 1);
      else textLength = config.textLength + i * config.textLengthDelta;

      const patternLength = config.patternLength;

      bs.add(
        textLength.toString(),
        async () => {
          const provider = new DataProvider(textLength, patternLength);
          scheduler.setDataSet(provider.getRandomDataSet());
        },
        async () => {
          await scheduler.run();
        },
        { repeats }
      );
    }
    const newDataSeries = {
      dataSet: await bs.run(),
      name: `GPU, Wz. ${config.patternLength}, Pwt. ${repeats}`,
    };
    setDataSeries([...dataSeries, newDataSeries]);
    setLoading(false);
  }, [config, dataSeries, repeats]);

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
