import {createSlice} from "@reduxjs/toolkit";
import {ArtistsType, ValidationError} from "../../types";
import {artistAdd, artistDelete, artistsFetch, artistToggle} from "./artistsThunks";
import {RootState} from "../../app/store";

interface ArtistsState {
  artists: ArtistsType[];
  artistsLoading: boolean;
  artistAddLoading: boolean;
  error: ValidationError | null;
  deleteLoading: boolean | string;
  artistToggleLoading: boolean | string;
}

const initialState: ArtistsState = {
  artists: [],
  artistsLoading: false,
  artistAddLoading: false,
  error: null,
  deleteLoading: false,
  artistToggleLoading: false,
}

export const artistsSLice = createSlice({
  name: 'artists',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(artistsFetch.pending, (state) => {
      state.artistsLoading = true;
    });
    builder.addCase(artistsFetch.fulfilled, (state, action) => {
      state.artists = action.payload!;
      state.artistsLoading = false;
    });
    builder.addCase(artistsFetch.rejected, (state) => {
      state.artistsLoading = false;
    });

    builder.addCase(artistAdd.pending, (state) => {
      state.artistAddLoading = true;
      state.error = null;
    });
    builder.addCase(artistAdd.fulfilled, (state) => {
      state.artistAddLoading = false;
    });
    builder.addCase(artistAdd.rejected, (state, {payload: error}) => {
      state.artistAddLoading = false;
      state.error = error || null;
    });

    builder.addCase(artistDelete.pending, (state, action) => {
      state.deleteLoading = action.meta.arg;
    });
    builder.addCase(artistDelete.fulfilled, (state) => {
      state.deleteLoading = false;
    });
    builder.addCase(artistDelete.rejected, (state) => {
      state.deleteLoading = false;
    });

    builder.addCase(artistToggle.pending, (state, action) => {
      state.artistToggleLoading = action.meta.arg;
    });
    builder.addCase(artistToggle.fulfilled, (state) => {
      state.artistToggleLoading = false;
    });
    builder.addCase(artistToggle.rejected, (state) => {
      state.artistToggleLoading = false;
    });
  }
});

export const artistsReducer = artistsSLice.reducer;

export const selectArtistsState = (state: RootState) => state.artists.artists;
export const selectArtistsLoading = (state: RootState) => state.artists.artistsLoading;
export const selectArtistsAddLoading = (state: RootState) => state.artists.artistAddLoading;
export const selectArtistsAddError = (state: RootState) => state.artists.error;
export const selectArtistDeleteLoading = (state: RootState) => state.artists.deleteLoading;
export const selectArtistToggleLoading = (state: RootState) => state.artists.artistToggleLoading;









