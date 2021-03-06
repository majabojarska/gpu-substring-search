import Box from "@material-ui/core/Box";
import React from "react";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <Box my={3} hidden={value !== index} {...other}>
      {value === index && <>{children}</>}
    </Box>
  );
};

export default TabPanel;
