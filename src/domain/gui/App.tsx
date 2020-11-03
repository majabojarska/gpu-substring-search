import React, { useState } from "react";
import "./styles/App.scss";
import ModePicker from "./components/ModePicker/ModePicker";
import Chart from "./components/Chart/Chart";
import { makeStyles, Theme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import TabPanel from "./components/TabPanel/TabPanel";
import ControlPanel from "./components/ControlPanel/ControlPanel";
import { Button, FormLabel, Input } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";

export interface GeneralConfigProps {
  textLength: number;
  patternLength: number;
  textLengthDelta: number;
  datasetLength: number;
}

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

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  tabPanel: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
}));

const App: React.FC = () => {
  const classes = useStyles();
  const [value, setValue] = useState<number>(0);
  const [generalConfig, setGeneralConfig] = useState<
    GeneralConfigProps | undefined
  >({ textLength: 0, patternLength: 0, textLengthDelta: 0, datasetLength: 0 });
  const [reapetsAmountSingleCore, setReapetsAmountSingleCore] = useState(0)
  const [reapetsAmountMultiCore, setReapetsAmountMultiCore] = useState(0)
  const [reapetsAmountGPU, setReapetsAmountGPU] = useState(0)
  const [thredsAmountCPU, setThredsAmountCPU] = useState(0)
  const [kernelsAmountGPU, setKernelsAmountGPU] = useState(0)
  const [singleCoreDatasets, setSingleCoreDatasets] = useState([]);
  const [cpuMulticoreDatasets, setCpuMulticoreDatasets] = useState([]);
  const [gpuDatasets, setGpuDatasets] = useState([]);

  const handleChange = (event: React.ChangeEvent, newValue: number) => {
    setValue(newValue);
  };

  const onReapetsAmountSingleCoreChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setReapetsAmountSingleCore(+event.target.value)
  }

  const onReapetsAmountMultiCoreChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setReapetsAmountMultiCore(+event.target.value)
  }

  const onsetReapetsAmountGPUChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setReapetsAmountGPU(+event.target.value)
  }

  const onThredsAmountCPUChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setThredsAmountCPU(+event.target.value)
  }

  const onKernelsAmountGPUChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setKernelsAmountGPU(+event.target.value)
  }

  const runSingleCoreHandler = () => {
    console.log("run single core");
    //run test

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

    const updatedDatasets = singleCoreDatasets.concat(newDataset);
    setSingleCoreDatasets(updatedDatasets);
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

    const updatedDatasets = cpuMulticoreDatasets.concat(newDataset);
    setCpuMulticoreDatasets(updatedDatasets);
    
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

    const updatedDatasets = gpuDatasets.concat(newDataset);
    setGpuDatasets(updatedDatasets);
    
  };

  const resetDatasets = () => {
    setSingleCoreDatasets([]);
    setCpuMulticoreDatasets([]);
    setGpuDatasets([]);
    console.log("Reset!");
  };

  return (
    <div className={classes.root}>
      <ControlPanel
        config={generalConfig}
        setConfig={setGeneralConfig}
        resetFunc={resetDatasets}
      />
      <AppBar position="static" className={classes.tabPanel}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="simple tabs example"
        >
          <Tab label="CPU Single core" {...a11yProps(0)} />
          <Tab label="CPU Multi core" {...a11yProps(1)} />
          <Tab label="GPU" {...a11yProps(2)} />
          <Tab label="Podsumowanie" {...a11yProps(3)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <Grid
          container
          xs={12}
          spacing={1}
          justify="center"
          alignItems="center"
        >
          <Grid item xs={6} justify="center" alignItems="center">
            <FormLabel>Liczba powtórzeń dla pojedynczych problemu: </FormLabel>
            <Input type="number" onChange={onReapetsAmountSingleCoreChange} value={reapetsAmountSingleCore}/>
          </Grid>
          <Grid item xs={6} justify="center" alignItems="center">
            <Button
              variant="outlined"
              color="primary"
              onClick={runSingleCoreHandler}
            >
              Uruchom
            </Button>
          </Grid>
        </Grid>
        <Chart datasets={singleCoreDatasets} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Grid
          container
          xs={12}
          spacing={1}
          justify="center"
          alignItems="center"
        >
          <Grid item xs={6} justify="center" alignItems="center">
            <FormLabel>Liczba powtórzeń dla pojedynczych problemu: </FormLabel>
            <Input type="number" onChange={onReapetsAmountMultiCoreChange} value={reapetsAmountMultiCore} />
          </Grid>
          <Grid item xs={6} justify="center" alignItems="center">
            <FormLabel>Liczba wątków: </FormLabel>
            <Input type="number" onChange={onThredsAmountCPUChange} value={thredsAmountCPU} />
          </Grid>
          <Grid item xs={6} justify="center" alignItems="center">
            <Button
              variant="outlined"
              color="primary"
              onClick={runCpuMultiCoreCoreHandler}
            >
              Uruchom
            </Button>
          </Grid>
        </Grid>
        <Chart datasets={cpuMulticoreDatasets} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Grid
          container
          xs={12}
          spacing={1}
          justify="center"
          alignItems="center"
        >
          <Grid item xs={6}>
            <FormLabel>Liczba powtórzeń dla pojedynczych problemu: </FormLabel>
            <Input type="number" onChange={onsetReapetsAmountGPUChange} value={reapetsAmountGPU}/>
          </Grid>
          <Grid item xs={6}>
            <FormLabel>Liczba wątków: </FormLabel>
            <Input type="number" onChange={onKernelsAmountGPUChange} value={kernelsAmountGPU}/>
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
        <Chart datasets={gpuDatasets} />
      </TabPanel>
      <TabPanel value={value} index={3}>
        Item Four
      </TabPanel>
    </div>
  );
};

export default App;
