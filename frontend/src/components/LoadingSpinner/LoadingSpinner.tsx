import React from 'react';
import {LinearProgress, Stack} from "@mui/material";

const LoadingSpinner = () => {
  return (
    <>
      <Stack sx={{ width: '100%', color: 'grey.500' }} spacing={2}>
        <LinearProgress color="secondary" />
      </Stack>
    </>
  );
};

export default LoadingSpinner;