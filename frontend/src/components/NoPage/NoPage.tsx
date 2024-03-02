import React from 'react';
import {Grid} from "@mui/material";

const NoPage = () => {
  return (
    <>
      <Grid container spacing={1} justifyContent={'center'}>
        <h1>Non-existent page</h1>
      </Grid>
    </>
  );
};

export default NoPage;