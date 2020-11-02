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

export interface Dataset {
  data: {x: number, y: number}[],
  label: string,
  borderColor: string,
  fill: boolean,
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
  const [singleCoreDatasets, setSingleCoreDatasets] = useState<Dataset[]>([
    {
      data: [
        { x: 1, y: 3 },
        { x: 3, y: 6 },
        { x: 4, y: 8 },
        { x: 5, y: 15 },
        { x: 6, y: 5 },
      ],
      label: "Data1",
      borderColor: "#3333ff",
      fill: true,
    },
    {
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
    },
  ]);
  const [cpuMulticoreDatasets, setCpuMulticoreDatasets] = useState([]);
  const [gpuDatasets, setGpuDatasets] = useState([]);

  const handleChange = (event: React.ChangeEvent, newValue: number) => {
    setValue(newValue);
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
            <Input type="number" />
          </Grid>
          <Grid item xs={6} justify="center" alignItems="center">
            <Button variant="outlined" color="primary">
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
            <Input type="number" />
          </Grid>
          <Grid item xs={6} justify="center" alignItems="center">
            <FormLabel>Liczba wątków: </FormLabel>
            <Input type="number" />
          </Grid>
          <Grid item xs={6} justify="center" alignItems="center">
            <Button variant="outlined" color="primary">
              Uruchom
            </Button>
          </Grid>
        </Grid>
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
            <Input type="number" />
          </Grid>
          <Grid item xs={6}>
            <FormLabel>Liczba wątków: </FormLabel>
            <Input type="number" />
          </Grid>
          <Grid item xs={6}>
            <Button variant="outlined" color="primary">
              Uruchom
            </Button>
          </Grid>
        </Grid>
      </TabPanel>
      <TabPanel value={value} index={3}>
        Item Four
      </TabPanel>
    </div>
  );
};

export default App;
