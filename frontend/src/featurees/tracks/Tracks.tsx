import React, {useEffect} from 'react';
import {Box, Container, Grid, List, Typography} from "@mui/material";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {selectTracksLoading, selectTracksState} from "./trackSlise";
import {tracksAlbumsFetch} from "./tracksThunks";
import {useParams} from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import {selectUser} from "../users/usersSlice";
import ModalYouTube from "../../components/ModalYouTube/ModalYouTube";
import TracksCard from "../../components/TracksCard/TracksCard";

const Tracks = () => {
  const dispatch = useAppDispatch();
  const tracksState = useAppSelector(selectTracksState);
  const loading = useAppSelector(selectTracksLoading);
  const user = useAppSelector(selectUser);
  const {id} = useParams();

  useEffect(() => {
    dispatch(tracksAlbumsFetch(id as string));
  }, [dispatch, id]);

  const noContent = () => {
    return <Grid container spacing={1} justifyContent={'center'}><h1>No Content</h1></Grid>
  }

  return (
    <>
      <Container maxWidth={'md'} sx={{mt: 4}}>
        {tracksState ? <>
          {loading ? <LoadingSpinner/> : <>
            {tracksState?.albumName ? (<>
              <Box
                sx={{background: 'rgba(190,208,198,0.84)', borderRadius: 10, padding: '10px', textAlign: 'center'}}>
                <Typography variant="h3">{tracksState?.albumName.artist.name}</Typography>
                <Typography sx={{color: 'rgb(7,82,100)'}} variant="h5">{tracksState?.albumName.name}</Typography>
              </Box>
            </>) : null}
            <List>
              {tracksState?.trackAlbum.map(item => {
                if (user?.role === 'admin') {
                  return <TracksCard item={item} key={item._id}/>
                } else if ((user?._id === item.user && !item.isPublished) || item.isPublished) {
                  return <TracksCard item={item} key={item._id}/>
                } else {
                  return null
                }
              })}
            </List>
          </>}
        </> : noContent()}
      </Container>
      <ModalYouTube/>
    </>
  );
};

export default Tracks;