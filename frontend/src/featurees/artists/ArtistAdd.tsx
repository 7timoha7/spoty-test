import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";
import {Button, Container, Grid, TextField} from "@mui/material";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {selectArtistsAddError, selectArtistsAddLoading} from "./artistsSlice";
import {ArtistsToServer} from "../../types";
import {artistAdd} from "./artistsThunks";
import FileInput from "../../components/FileInput/FileInput";

const ArtistAdd = () => {

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const errorArtistState = useAppSelector(selectArtistsAddError);
  const loading = useAppSelector(selectArtistsAddLoading);

  const [state, setState] = useState<ArtistsToServer>({
    name: '',
    desc: '',
    image: '',
  });

  const submitFormHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(artistAdd(state)).unwrap();
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
      return errorArtistState?.errors[fieldName].message;
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
                id="description" label="description"
                onChange={inputChangeHandler}
                name="desc"
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

export default ArtistAdd;