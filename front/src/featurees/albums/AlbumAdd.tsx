import React, {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {useNavigate} from "react-router-dom";
import {AlbumsToServer} from "../../types";
import {Button, Container, Grid, MenuItem, TextField} from "@mui/material";
import FileInput from "../../components/FileInput/FileInput";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import {selectAlbumAddLoading, selectAlbumsError} from "./albumsSlice";
import {albumAdd} from "./albumsThunks";
import {selectArtistsState} from "../artists/artistsSlice";
import {artistsFetch} from "../artists/artistsThunks";
import {selectUser} from "../users/usersSlice";


const AlbumAdd = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const errorAlbumState = useAppSelector(selectAlbumsError);
  const loading = useAppSelector(selectAlbumAddLoading);
  const artistsState = useAppSelector(selectArtistsState);
  const user = useAppSelector(selectUser);

  const [state, setState] = useState<AlbumsToServer>({
    name: '',
    artist: '',
    year: 0,
    image: '',
  });

  console.log('forma' + state);

  useEffect(() => {
    dispatch(artistsFetch());
  }, [dispatch]);

  const submitFormHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(albumAdd(state)).unwrap();
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

  const fileInputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, files} = e.target;
    setState(prevState => ({
      ...prevState, [name]: files && files[0] ? files[0] : null,
    }));
  };

  const getFieldError = (fieldName: string) => {
    try {
      return errorAlbumState?.errors[fieldName].message;
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
                required
                select
                label="Artist"
                name="artist"
                value={state.artist}
                onChange={inputChangeHandler}
                error={Boolean(getFieldError('artist'))}
                helperText={getFieldError('artist')}
              >
                <MenuItem value="" disabled>Please select a artist</MenuItem>
                {artistsState.map(artist => {
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
                required
                disabled={loading}
                id="year" label="Released"
                onChange={inputChangeHandler}
                name="year"
                error={Boolean(getFieldError('year'))}
                helperText={getFieldError('year')}
                inputProps={{min: 1, max: 100000000}}
                type={"number"}
              />
            </Grid>

            <Grid item xs>
              <FileInput
                label="Image"
                onChange={fileInputChangeHandler}
                name="image"
                type="image/*"
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

export default AlbumAdd;