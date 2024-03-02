import React from 'react';
import {Button, Card, CardActionArea, CardContent, CardMedia, Grid, Typography} from "@mui/material";
import {apiURL} from "../../constans";
import {AlbumsMutationNew} from "../../types";
import {useNavigate} from "react-router-dom";
import noImage from "../../assets/images/no_image.jpg";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {selectUser} from "../../featurees/users/usersSlice";
import {albumsDelete, albumsFetch, albumToggle} from "../../featurees/albums/albumsThunks";
import DoDisturbIcon from "@mui/icons-material/DoDisturb";
import {selectAlbumsDeleteLoading, selectAlbumToggleLoading} from "../../featurees/albums/albumsSlice";

interface Props {
  item: AlbumsMutationNew;
}

const AlbumsCard: React.FC<Props> = ({item}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const loadingDelete = useAppSelector(selectAlbumsDeleteLoading);
  const loadingToggle = useAppSelector(selectAlbumToggleLoading);

  let img = noImage;
  if (item.image) {
    img = apiURL + item.image
  }

  const onClickDelete = async () => {
    await dispatch(albumsDelete(item._id));
    await dispatch(albumsFetch(item.artist._id));
  }

  const getPublished = async () => {
    await dispatch(albumToggle(item._id));
    await dispatch(albumsFetch(item.artist._id));
  }

  const loadingToggleAndDelete = (id: string) => {
    if ((id === loadingToggle) || (loadingDelete === id)) {
      return true
    }
  }

  return (
    <>
      <Card sx={{maxWidth: 345, mb: 4, background: 'rgba(255,255,255,0.67)', position: "relative"}}>
        <CardActionArea onClick={() => navigate('/tracks/' + item._id)}>
          {!item.isPublished &&
            <DoDisturbIcon
              sx={{position: "absolute", height: "100%", width: "100%", background: 'rgba(255,255,255,0.67)'}}
              color="disabled"></DoDisturbIcon>
          }
          <CardMedia
            component="img"
            image={img}
            alt={item.name}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {item.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {item.year}
            </Typography>
          </CardContent>
        </CardActionArea>
        <Grid container marginBottom={2} mt={1} justifyContent={"space-around"} alignItems={"center"}>
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
      </Card>
    </>
  );
};

export default AlbumsCard;