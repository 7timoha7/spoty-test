import React, {useState} from 'react';
import {Avatar, Button, Grid, Menu, MenuItem, styled} from '@mui/material';
import {User} from "../../types";
import {NavLink, useNavigate} from "react-router-dom";
import {useAppDispatch} from "../../app/hooks";
import {logout} from "../../featurees/users/usersThunks";
import noImage from "../../assets/images/no_image.jpg";
import {apiURL} from "../../constans";
import {artistsFetch} from "../../featurees/artists/artistsThunks";


interface Props {
  user: User;
}

const UserMenu: React.FC<Props> = ({user}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleClose = () => {
    setAnchorEl(null);
  };

  const Link = styled(NavLink)({
    color: 'inherit',
    textDecoration: 'none',
    '&:hover': {
      color: 'inherit'
    },
  });

  const handleLogout = async () => {
    await dispatch(logout());
    await dispatch(artistsFetch());
    await navigate('/');
  };

  let img = noImage;

  if (user.googleId && user.avatar) {
    img = user.avatar;
  } else if (user.avatar) {
    img = apiURL + user.avatar
  }

  return (
    <>
      <Grid container>
        <Button
          onClick={handleClick}
          color="inherit"
        >
          Hello, {user.username}
        </Button>
        <Avatar alt={user.displayName} src={img}/>
      </Grid>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem> <Link to={'/artistAdd'}>Add artist</Link> </MenuItem>
        <MenuItem> <Link to={'/albumsAdd'}>Add album</Link> </MenuItem>
        <MenuItem> <Link to={'/trackAdd'}>Add track</Link> </MenuItem>
        <MenuItem> <Link to={'/trackHistory'}>Track History</Link> </MenuItem>
        <MenuItem>Profile</MenuItem>
        <MenuItem>My account</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;

