import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {albumsFetch} from "./albumsThunks";
import {useParams} from "react-router-dom";
import {selectAlbumsLoading, selectAlbumsState} from "./albumsSlice";
import {Box, Container, Grid, Typography} from "@mui/material";
import AlbumsCard from "../../components/AlbumsCard/AlbumsCard";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import {selectUser} from "../users/usersSlice";

const Albums = () => {
  const albumsState = useAppSelector(selectAlbumsState);
  const loading = useAppSelector(selectAlbumsLoading);
  const user = useAppSelector(selectUser)

  const dispatch = useAppDispatch();
  const {id} = useParams();

  useEffect(() => {
    dispatch(albumsFetch(id as string));
  }, [dispatch, id]);

  const noContent = () => {
    return <Grid container spacing={1} justifyContent={'center'}><h1>No Content</h1></Grid>
  }

  return (
    <>
      <Container maxWidth="md" sx={{mt: 4}}>
        {albumsState ? <>
          {loading ? <LoadingSpinner/> : <>
            {albumsState?.artist.name ? <Box
              sx={{background: 'rgba(190,208,198,0.84)', borderRadius: 10, padding: '10px', textAlign: 'center'}}>
              <Typography variant="h3">{albumsState?.artist.name}</Typography></Box> : null}
            <Grid container spacing={2} justifyContent={'space-between'} mt={3}>
              {albumsState?.albums.map(item => {
                if (user?.role === 'admin') {
                  return <AlbumsCard item={item} key={item._id}/>
                } else if ((user?._id === item.user && !item.isPublished) || item.isPublished) {
                  return <AlbumsCard item={item} key={item._id}/>
                }
              })}
            </Grid>
          </>}
        </> : noContent()}
      </Container>
    </>
  );
};

export default Albums;