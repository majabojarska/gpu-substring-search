import React, { useState } from "react";
import "./styles/App.scss";
import { makeStyles, Theme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import TabPanel from "./components/TabPanel/TabPanel";
import ControlPanel from "./components/ControlPanel/ControlPanel";
import { Container } from "@material-ui/core";
import SingleCoreTab from "./components/Tabs/SingleCoreTab";
import MultiCoreTab from "./components/Tabs/MultiCoreTab";
import GPUTab from "./components/Tabs/GPUTab";
import SummaryTab from "./components/Tabs/SummaryTab";
import { BenchmarkChartDataSeries } from "./components/Chart/BenchmarkChart";

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
  const [CPUSingleDataSeries, setCPUSingleDataSeries] = useState<
    BenchmarkChartDataSeries[]
  >([]);
  const [CPUMultiDataSeries, setCPUMultiDataSeries] = useState<
    BenchmarkChartDataSeries[]
  >([]);
  const [GPUDataSeries, setGPUDataSeries] = useState<
    BenchmarkChartDataSeries[]
  >([]);

  const handleChange = (event: React.ChangeEvent, newValue: number) => {
    setValue(newValue);
  };

  const resetDatasets = () => {
    setCPUMultiDataSeries([]);
    setCPUSingleDataSeries([]);
    setGPUDataSeries([]);
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
          <SingleCoreTab
            config={generalConfig}
            dataSeries={CPUSingleDataSeries}
            setDataSeries={setCPUSingleDataSeries}
          />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <MultiCoreTab
            config={generalConfig}
            dataSeries={CPUMultiDataSeries}
            setDataSeries={setCPUMultiDataSeries}
          />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <GPUTab
            config={generalConfig}
            dataSeries={GPUDataSeries}
            setDataSeries={setGPUDataSeries}
          />
        </TabPanel>
        <TabPanel value={value} index={3}>
          <SummaryTab
            SingleDataSeries={CPUSingleDataSeries}
            MultiDataSeries={CPUMultiDataSeries}
            GPUDataSeries={GPUDataSeries}
          />
        </TabPanel>
      </Container>
    </div>
  );
};

export default App;
