import { Box, Grid, Typography } from "@material-ui/core";
import React from "react";
import platform from "platform";
import gpuInfo from "webgl-info";
const gpu = gpuInfo();

const SysInfo: React.FC = () => {
  return (
    <Grid container spacing={0}>
      <Grid item sm={12}>
        <Typography variant="h6">System</Typography>
      </Grid>
      <Grid item sm={12}>
        <Typography>{platform.description}</Typography>
      </Grid>
      <Grid item sm={12}>
        <Typography variant="h6">GPU</Typography>
      </Grid>
      <Grid item sm={12}>
        <Typography>{gpu.webgl2.unMaskedRenderer}</Typography>
      </Grid>
      <Grid item sm={6}>
        <Box mr={1}>
          <Typography align="right">maxViewportDimensions:</Typography>
        </Box>
      </Grid>
      <Grid item sm={6}>
        <Typography>
          {JSON.stringify(gpu.webgl2.maximum.maxViewportDimensions)}
        </Typography>
      </Grid>
      <Grid item sm={6}>
        <Box mr={1}>
          <Typography align="right">maxTextureSize:</Typography>
        </Box>
      </Grid>
      <Grid item sm={6}>
        <Typography>
          {JSON.stringify(gpu.webgl2.maximum.maxTextureSize)}
        </Typography>
      </Grid>
      <Grid item sm={6}>
        <Box mr={1}>
          <Typography align="right">maxFragmentUniformVectors:</Typography>
        </Box>
      </Grid>
      <Grid item sm={6}>
        <Typography>
          {JSON.stringify(gpu.webgl2.maximum.maxFragmentUniformVectors)}
        </Typography>
      </Grid>
      <Grid item sm={6}>
        <Box mr={1}>
          <Typography align="right">maxRenderBufferSize:</Typography>
        </Box>
      </Grid>
      <Grid item sm={6}>
        <Typography>
          {JSON.stringify(gpu.webgl2.maximum.maxRenderBufferSize)}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default SysInfo;
