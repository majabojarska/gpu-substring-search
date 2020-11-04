import React, { useState } from "react";
import "./styles/App.scss";
import { makeStyles, Theme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import TabPanel from "./components/TabPanel/TabPanel";
import ControlPanel from "./components/ControlPanel/ControlPanel";
import { Button, Container, FormLabel } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import SingleCoreTab from "./components/Tabs/SingleCoreTab";
export interface GeneralConfig {
  textLength: number;
  patternLength: number;
  textLengthDelta: number;
  dataSetRepeats: number;
  exponential: boolean;
}

export const defaultGeneralConfig: GeneralConfig = {
  textLength: 100,
  patternLength: 7,
  textLengthDelta: 100,
  dataSetRepeats: 10,
  exponential: false,
};

// {
//   data: [
//     { x: 1, y: 3 },
//     { x: 3, y: 6 },
//     { x: 4, y: 8 },
//     { x: 5, y: 15 },
//     { x: 6, y: 5 },
//   ],
//   label: "Data1",
//   borderColor: "#3333ff",
//   fill: true,
// },
// {
//   data: [
//     { x: 1, y: 5 },
//     { x: 3, y: 2 },
//     { x: 4, y: 4 },
//     { x: 5, y: 10 },
//     { x: 6, y: 16 },
//   ],
//   label: "Data2",
//   borderColor: "#33ffff",
//   fill: true,
// },

export interface Dataset {
  data: { x: number; y: number }[];
  label: string;
  borderColor: string;
  fill: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
  },
}));

const App: React.FC = () => {
  const classes = useStyles();
  const [value, setValue] = useState<number>(0);
  const [generalConfig, setGeneralConfig] = useState(defaultGeneralConfig);

  const handleChange = (event: React.ChangeEvent, newValue: number) => {
    setValue(newValue);
  };

  const runCpuMultiCoreCoreHandler = () => {
    console.log("run multi core cpu");

    const newDataset: Dataset = {
      data: [
        { x: 1, y: 5 },
        { x: 3, y: 2 },
        { x: 4, y: 4 },
        { x: 5, y: 10 },
        { x: 6, y: 16 },
      ],
      label: "Data2",
      borderColor: "#33ffff",
      fill: true,
    };

    /*  const updatedDatasets = cpuMulticoreDatasets.concat(newDataset);
    setCpuMulticoreDatasets(updatedDatasets); */
  };

  const runGpuMultiCoreCoreHandler = () => {
    console.log("run multi core gpu");

    const newDataset: Dataset = {
      data: [
        { x: 1, y: 5 },
        { x: 3, y: 2 },
        { x: 4, y: 4 },
        { x: 5, y: 10 },
        { x: 6, y: 16 },
      ],
      label: "Data2",
      borderColor: "#33ffff",
      fill: true,
    };

    /*  const updatedDatasets = gpuDatasets.concat(newDataset);
    setGpuDatasets(updatedDatasets); */
  };

  const resetDatasets = () => {
    //setSingleCoreDatasets([]);
    /*     setCpuMulticoreDatasets([]);
    setGpuDatasets([]); */
    console.log("Reset!");
  };

  return (
    <div className={classes.root}>
      <Container fixed maxWidth="sm">
        <ControlPanel
          config={generalConfig}
          setConfig={setGeneralConfig}
          resetFunc={resetDatasets}
        />
      </Container>{" "}
      <AppBar position="static">
        <Container fixed>
          <Tabs value={value} onChange={handleChange} variant="fullWidth">
            <Tab label="CPU Single core" />
            <Tab label="CPU Multi core" />
            <Tab label="GPU" />
            <Tab label="Podsumowanie" />
          </Tabs>
        </Container>
      </AppBar>
      <Container fixed>
        <TabPanel value={value} index={0}>
          <SingleCoreTab config={generalConfig}></SingleCoreTab>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Grid container spacing={1} justify="center" alignItems="center">
            <Grid item xs={6}>
              <FormLabel>
                Liczba powtórzeń dla pojedynczych problemu:{" "}
              </FormLabel>
              {/* <Input
                type="number"
                onChange={onReapetsAmountMultiCoreChange}
                value={reapetsAmountMultiCore}
              /> */}
            </Grid>
            <Grid item xs={6}>
              <FormLabel>Liczba wątków: </FormLabel>
              {/* <Input
                type="number"
                onChange={onThredsAmountCPUChange}
                value={thredsAmountCPU}
              /> */}
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="outlined"
                color="primary"
                onClick={runCpuMultiCoreCoreHandler}
              >
                Uruchom
              </Button>
            </Grid>
          </Grid>
          {/* <Chart datasets={cpuMulticoreDatasets} /> */}
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Grid
            container
            item
            xs={12}
            spacing={1}
            justify="center"
            alignItems="center"
          >
            <Grid item xs={6}>
              <FormLabel>
                Liczba powtórzeń dla pojedynczych problemu:{" "}
              </FormLabel>
              {/* <Input
                type="number"
                onChange={onsetReapetsAmountGPUChange}
                value={reapetsAmountGPU}
              /> */}
            </Grid>
            <Grid item xs={6}>
              <FormLabel>Liczba wątków: </FormLabel>
              {/*  <Input
                type="number"
                onChange={onKernelsAmountGPUChange}
                value={kernelsAmountGPU}
              /> */}
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="outlined"
                color="primary"
                onClick={runGpuMultiCoreCoreHandler}
              >
                Uruchom
              </Button>
            </Grid>
          </Grid>
          {/* <Chart datasets={gpuDatasets} /> */}
        </TabPanel>
        <TabPanel value={value} index={3}>
          Item Four
        </TabPanel>
      </Container>
    </div>
  );
};

export default App;
