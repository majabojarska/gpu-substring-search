import React, { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import { defaultGeneralConfig, GeneralConfig } from "../../App";
import {
  Box,
  Button,
  FormControlLabel,
  Switch,
  TextField,
} from "@material-ui/core";
import { textFieldProps } from "../Common/Props";

interface ConfigProps {
  config: GeneralConfig;
  setConfig: React.Dispatch<React.SetStateAction<GeneralConfig>>;
  resetFunc: () => void;
}

const ControlPanel: React.FC<ConfigProps> = (props: ConfigProps) => {
  const { config, setConfig, resetFunc } = props;
  const [textLength, setTextLength] = useState(config.textLength);
  const [patternLength, setPatternLength] = useState(config.patternLength);
  const [textLengthDelta, setTextLengthDelta] = useState(
    config.textLengthDelta
  );
  const [dataSetRepeats, setDataSetRepeats] = useState(config.dataSetRepeats);
  const [exponential, setExponential] = useState(config.exponential);

  useEffect(() => {
    setConfig({
      textLength,
      patternLength,
      textLengthDelta,
      dataSetRepeats,
      exponential,
    });
  }, [textLength, patternLength, textLengthDelta, dataSetRepeats, exponential]);

  const onConfigResetHandler = () => {
    const d = defaultGeneralConfig;
    setTextLength(d.textLength);
    setPatternLength(d.patternLength);
    setTextLengthDelta(d.textLengthDelta);
    setDataSetRepeats(d.dataSetRepeats);
    setExponential(d.exponential);
    resetFunc();
  };

  return (
    <Grid container spacing={1}>
      <Grid container item xs={12} spacing={1}>
        <Grid item xs={6}>
          <TextField
            onChange={(e) => setTextLength(+e.target.value)}
            value={textLength}
            label="Długość tekstu"
            {...textFieldProps}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            onChange={(e) => setPatternLength(+e.target.value)}
            value={patternLength}
            label="Długość wzorca"
            {...textFieldProps}
          />
        </Grid>
      </Grid>
      <Grid container item xs={12} spacing={1}>
        <Grid item xs={6}>
          <TextField
            onChange={(e) => setTextLengthDelta(+e.target.value)}
            value={textLengthDelta}
            label="Zmiana długości tekstu"
            {...textFieldProps}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            onChange={(e) => setDataSetRepeats(+e.target.value)}
            value={dataSetRepeats}
            label="Liczba iteracji"
            {...textFieldProps}
          />
        </Grid>
      </Grid>
      <Grid container item xs={12} spacing={1}>
        <Grid item xs={6}>
          <FormControlLabel
            control={
              <Switch
                color="primary"
                checked={exponential}
                onChange={(v) => setExponential(v.target.checked)}
              />
            }
            label="Wykładnicza"
          />
        </Grid>
        <Grid item xs={6}>
          <Button
            variant="outlined"
            color="primary"
            onClick={onConfigResetHandler}
          >
            Reset
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ControlPanel;
