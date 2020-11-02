import React, { useReducer, useState, SyntheticEvent } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { GeneralConfigProps } from "../../App";
import { Button, FormLabel, Input } from "@material-ui/core";

interface ConfigProps {
  config: GeneralConfigProps;
  setConfig: React.Dispatch<React.SetStateAction<GeneralConfigProps>>;
  resetFunc: any;
}

const useStyles = makeStyles(() => ({
  container: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    margin: 25,
  },
  centered: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
}));

const ControlPanel = (props: ConfigProps) => {
  const classes = useStyles();
  const { config, setConfig, resetFunc } = props;
  const [textLength, setTextLength] = useState(config.textLength);
  const [patternLength, setPatternLength] = useState(config.patternLength);
  const [textLengthDelta, settextLengthDelta] = useState(
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
    settextLengthDelta(+event.target.value);
  };

  const onDatasetLengthChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setDatasetLength(+event.target.value);
  };

  const onConfigSetHandler = () => {
    setConfig({
      textLength: textLength,
      patternLength: patternLength,
      textLengthDelta: textLengthDelta,
      datasetLength: datasetLength,
    });
  };

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
    <div className={classes.container}>
      <Grid container spacing={1}>
        <Grid container item xs={12} spacing={1}>
          <Grid item xs={6}>
            <FormLabel>Długość tekstu: </FormLabel>
            <Input
              type="number"
              onChange={onTextLengthChange}
              value={textLength}
            />
          </Grid>
          <Grid item xs={6}>
            <FormLabel>Długość wzorca: </FormLabel>
            <Input
              type="number"
              onChange={onPatternLengthChange}
              value={patternLength}
            />
          </Grid>
        </Grid>
        <Grid container item xs={12} spacing={1}>
          <Grid item xs={6}>
            <FormLabel>Delta długości tekstu: </FormLabel>
            <Input
              type="number"
              onChange={onTextLengthDeltaChange}
              value={textLengthDelta}
            />
          </Grid>
          <Grid item xs={6}>
            <FormLabel>Długość datasetu: </FormLabel>
            <Input
              type="number"
              onChange={onDatasetLengthChange}
              value={datasetLength}
            />
          </Grid>
        </Grid>
        <Grid container item xs={12} spacing={1}>
          <Grid item xs={6} justify="center" alignItems="center">
            <Button variant="contained" color="primary" onClick={onConfigSetHandler}>
              Zatwierdź
            </Button>
          </Grid>
          <Grid item xs={6} justify="center" alignItems="center">
            <Button variant="outlined" color="primary" onClick={onConfigResetHandler}>
              Reset
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default ControlPanel;
