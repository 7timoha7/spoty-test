import React from 'react';
import {Button, Card, CardActions, CardContent, CardMedia, Grid, Typography} from "@mui/material";
import {ArtistsType} from "../../types";
import {apiURL} from "../../constans";
import {useNavigate} from "react-router-dom";
import noImage from "../../assets/images/no_image.jpg";
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {selectUser} from "../../featurees/users/usersSlice";
import {artistDelete, artistsFetch, artistToggle} from "../../featurees/artists/artistsThunks";
import {selectArtistDeleteLoading, selectArtistToggleLoading} from "../../featurees/artists/artistsSlice";

interface Props {
  item: ArtistsType
}

const ArtistCard: React.FC<Props> = ({item}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const loadingDelete = useAppSelector(selectArtistDeleteLoading);
  const loadingToggle = useAppSelector(selectArtistToggleLoading);

  let img = noImage;

  if (item.image) {
    img = apiURL + item.image
  }

  const onClickDelete = async () => {
    await dispatch(artistDelete(item._id));
    await dispatch(artistsFetch());
  }

  const getPublished = async () => {
    await dispatch(artistToggle(item._id));
    await dispatch(artistsFetch());
  }

  const loadingToggleAndDelete = (id: string) => {
    if ((id === loadingToggle) || (loadingDelete === id)) {
      return true
    }
  }

  return (
    <>
      <Card sx={{maxWidth: 345, mb: 3, background: 'rgba(133,242,240,0.78)', position: "relative"}}>
        {!item.isPublished &&
          <DoDisturbIcon
            sx={{position: "absolute", height: "100%", width: "100%", background: 'rgba(255,255,255,0.67)'}}
            color="disabled"></DoDisturbIcon>
        }
        <CardMedia
          component="img"
          image={img}
          title={item.name}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {item.name}
          </Typography>
        </CardContent>
        <CardActions>
          <Grid container justifyContent={"space-between"} alignItems={"center"}>
            <Button
              disabled={loadingToggleAndDelete(item._id)}
              color="info"
              variant="contained"
              onClick={() => navigate('/albums/' + item._id)}>More</Button>
            {((user?.role === 'admin') || (user?._id === item.user && !item.isPublished)) &&
              <Button
                disabled={loadingToggleAndDelete(item._id)}
                onClick={onClickDelete}
                color="error"
                variant="contained">Delete</Button>}
            {user?.role === 'admin' &&
              <Button
                disabled={loadingToggleAndDelete(item._id)}
                onClick={getPublished}
                color={item.isPublished ? "warning" : "secondary"}
                variant="contained">{item.isPublished ? "Unpublished" : "Published"}</Button>}
          </Grid>
        </CardActions>
      </Card>
    </>
  );
};

export default ArtistCard;