import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

const useStyles = makeStyles(() => ({
  container: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  centered: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
}));

const TabPanel = (props: TabPanelProps) => {
  const classes = useStyles();
  const { children, value, index, ...other } = props;

  return (
    <div
      className={classes.container}
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3} className={classes.centered}>
          {children}
        </Box>
      )}
    </div>
  );
};

export default TabPanel;
