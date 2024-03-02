import React from 'react';
import {AppBar, Box, Grid, Link, styled, Typography} from "@mui/material";
import Toolbar from '@mui/material/Toolbar';
import UserMenu from "./UserMenu";
import AnonymousMenu from "./AnonymousMenu";
import {useAppSelector} from "../../app/hooks";
import {selectUser} from "../../featurees/users/usersSlice";
import {NavLink} from "react-router-dom";

const Header = () => {

  const user = useAppSelector(selectUser);

  const Link = styled(NavLink)({
    color: 'inherit',
    textDecoration: 'none',
    '&:hover': {
      color: 'inherit'
    },
  });

  return (
    <>
      <Box sx={{flexGrow: 1}}>
        <AppBar position="static">
          <Toolbar>
            <Grid container justifyContent="space-between" alignItems="center">
              <Typography variant="h6" component="div">
                <Link to="/">Spotify</Link>
              </Typography>
              <Grid item>
                {user ? (
                  <UserMenu user={user}/>
                ): (
                  <AnonymousMenu/>
                )}
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
};

export default Header;