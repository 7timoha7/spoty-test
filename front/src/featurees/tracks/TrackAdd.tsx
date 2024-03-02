import React, {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {useNavigate} from "react-router-dom";
import {selectArtistsState} from "../artists/artistsSlice";
import {TrackToServer} from "../../types";
import {artistsFetch} from "../artists/artistsThunks";
import {trackAdd} from "./tracksThunks";
import {Button, Container, Grid, MenuItem, TextField} from "@mui/material";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import {selectTrackAddError, selectTrackAddLoading} from "./trackSlise";
import {selectAlbumsState} from "../albums/albumsSlice";
import {albumsFetch} from "../albums/albumsThunks";
import {selectUser} from "../users/usersSlice";

const TrackAdd = () => {


  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const errorTrackState = useAppSelector(selectTrackAddError);
  const loading = useAppSelector(selectTrackAddLoading);
  const artistState = useAppSelector(selectArtistsState);
  const albumsState = useAppSelector(selectAlbumsState);
  const user = useAppSelector(selectUser);

  const [state, setState] = useState<TrackToServer>({
    name: '',
    album: '',
    trackNumber: 0,
    duration: '',
    videoId: '',
  });

  const [stateArtist, setStateArtist] = useState('')

  useEffect(() => {
    dispatch(artistsFetch());
  }, [dispatch]);

  useEffect(() => {
    if (stateArtist) {
      dispatch(albumsFetch(stateArtist));
    }
  }, [dispatch, stateArtist]);

  const onChangeAlbum = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStateArtist(e.target.value);
  }


  const submitFormHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(trackAdd(state)).unwrap();
      await navigate('/');
    } catch (e) {
      console.error(e);
    }
  };

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setState(prevState => {
      return {...prevState, [name]: value};
    });
  };

  const getFieldError = (fieldName: string) => {
    try {
      return errorTrackState?.errors[fieldName].message;
    } catch {
      return undefined;
    }
  };

  return (
    <>
      <Container
        maxWidth={'xl'}
        sx={{mt: 4, p: 3, background: 'rgba(190,208,198,0.84)', borderRadius: 5}}>
        <form
          autoComplete="off"
          onSubmit={submitFormHandler}
        >
          <Grid container direction="column" spacing={2}>
            <Grid item xs>
              <TextField
                required
                disabled={loading}
                id="name" label="Name"
                onChange={inputChangeHandler}
                name="name"
                error={Boolean(getFieldError('name'))}
                helperText={getFieldError('name')}
              />
            </Grid>
            <Grid item xs>
              <TextField
                disabled={loading}
                required
                select
                label="Artist"
                name="artist"
                value={stateArtist}
                onChange={onChangeAlbum}
              >
                <MenuItem value="" disabled>Please select a artist</MenuItem>
                {artistState.map(artist => {
                  if (user?.role === 'admin') {
                    return <MenuItem key={artist._id} value={artist._id}>{artist.name}</MenuItem>
                  } else if ((user?._id === artist.user && !artist.isPublished) || artist.isPublished) {
                    return <MenuItem key={artist._id} value={artist._id}>{artist.name}</MenuItem>
                  }
                })}
              </TextField>
            </Grid>
            <Grid item xs>
              <TextField
                disabled={!stateArtist || loading}
                required
                select
                label="Album"
                name="album"
                value={state.album}
                onChange={inputChangeHandler}
              >
                <MenuItem value="" disabled>Please select a artist</MenuItem>
                {albumsState?.albums.length && albumsState.albums.map(albums => {
                    if (user?.role === 'admin') {
                      return <MenuItem key={albums._id} value={albums._id}>{albums.name}</MenuItem>
                    } else if ((user?._id === albums.user && !albums.isPublished) || albums.isPublished) {
                      return <MenuItem key={albums._id} value={albums._id}>{albums.name}</MenuItem>
                    }
                })}
              </TextField>
            </Grid>
            <Grid item xs>
              <TextField
                type={"number"}
                inputProps={{min: 1, max: 500}}
                required
                disabled={loading}
                id="trackNumber" label="Track Number"
                onChange={inputChangeHandler}
                name="trackNumber"
                error={Boolean(getFieldError('trackNumber'))}
                helperText={getFieldError('trackNumber')}
              />
            </Grid>
            <Grid item xs>
              <TextField
                required
                disabled={loading}
                id="duration" label="Duration"
                onChange={inputChangeHandler}
                name="duration"
                error={Boolean(getFieldError('duration'))}
                helperText={getFieldError('duration')}
              />
            </Grid>
            <Grid item xs>
              <TextField
                disabled={loading}
                id="videoId" label="video id in YouTube"
                onChange={inputChangeHandler}
                name="videoId"
              />
            </Grid>
            <Grid item xs>
              <Button disabled={loading} type="submit" color="primary" variant="contained">Create</Button>
            </Grid>
            {loading ? <LoadingSpinner/> : null}
          </Grid>
        </form>
      </Container>
    </>
  );
};

export default TrackAdd;