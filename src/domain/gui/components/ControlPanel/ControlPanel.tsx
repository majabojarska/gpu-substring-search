import React, { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import { GeneralConfigProps } from "../../App";
import { Box, Button, TextField } from "@material-ui/core";
import { textFieldProps } from "../Common/Props";

interface ConfigProps {
  config: GeneralConfigProps;
  setConfig: React.Dispatch<React.SetStateAction<GeneralConfigProps>>;
  resetFunc: () => void;
}

const ControlPanel: React.FC<ConfigProps> = (props: ConfigProps) => {
  const { config, setConfig, resetFunc } = props;
  const [textLength, setTextLength] = useState(config.textLength);
  const [patternLength, setPatternLength] = useState(config.patternLength);
  const [textLengthDelta, setTextLengthDelta] = useState(
    config.textLengthDelta
  );
  const [datasetLength, setDatasetLength] = useState(config.datasetLength);

  const onTextLengthChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setTextLength(+event.target.value);
  };

  const onPatternLengthChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setPatternLength(+event.target.value);
  };

  const onTextLengthDeltaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setTextLengthDelta(+event.target.value);
  };

  const onDatasetLengthChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setDatasetLength(+event.target.value);
  };

  useEffect(() => {
    setConfig({
      textLength,
      patternLength,
      textLengthDelta,
      datasetLength,
    });
  }, [textLength, patternLength, textLengthDelta, datasetLength]);

  const onConfigResetHandler = () => {
    setConfig({
      textLength: 0,
      patternLength: 0,
      textLengthDelta: 0,
      datasetLength: 0,
    });
    resetFunc();
  };

  return (
    <Box my={3}>
      <Grid container spacing={1}>
        <Grid container item xs={12} spacing={1}>
          <Grid item xs={6}>
            <TextField
              onChange={onTextLengthChange}
              value={textLength}
              label="Długość tekstu"
              {...textFieldProps}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              onChange={onPatternLengthChange}
              value={patternLength}
              label="Długość wzorca"
              {...textFieldProps}
            />
          </Grid>
        </Grid>
        <Grid container item xs={12} spacing={1}>
          <Grid item xs={6}>
            <TextField
              onChange={onTextLengthDeltaChange}
              value={textLengthDelta}
              label="Delta długości tekstu"
              {...textFieldProps}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              onChange={onDatasetLengthChange}
              value={datasetLength}
              label="Liczba iteracji"
              {...textFieldProps}
            />
          </Grid>
        </Grid>
        <Grid container item xs={12} spacing={1}>
          <Grid item xs={6} justify="center" alignItems="center">
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
    </Box>
  );
};

export default ControlPanel;
