import React, {useEffect} from 'react';
import ArtistCard from "../../components/ArtistCard/ArtistCard";
import {Container, Grid} from "@mui/material";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {artistsFetch} from "./artistsThunks";
import {selectArtistsLoading, selectArtistsState} from "./artistsSlice";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import {selectUser} from "../users/usersSlice";

const Artists = () => {
  const dispatch = useAppDispatch();
  const stateArtist = useAppSelector(selectArtistsState);
  const loading = useAppSelector(selectArtistsLoading);
  const user = useAppSelector(selectUser);

  useEffect(() => {
    dispatch(artistsFetch());
  }, [dispatch]);

  const noContent = () => {
    return <Grid container spacing={1} justifyContent={'center'}><h1>No Content</h1></Grid>
  }

  return (
    <>
      <Container maxWidth="md" sx={{mt: 4}}>
        {stateArtist ? <>
          <Grid container spacing={2} justifyContent={'space-between'}>
            {loading ? <LoadingSpinner/> :
              stateArtist.map(item => {
                if (user?.role === 'admin') {
                  return <ArtistCard item={item} key={item._id}/>
                } else if ((user?._id === item.user && !item.isPublished) || item.isPublished) {
                  return <ArtistCard item={item} key={item._id}/>
                }
              })}
          </Grid>
        </> : noContent()}
      </Container>
    </>
  );
};

export default Artists;