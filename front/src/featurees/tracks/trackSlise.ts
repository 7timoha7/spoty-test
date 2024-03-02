import {createSlice} from "@reduxjs/toolkit";
import {TrackMutationType, ValidationError} from "../../types";
import {RootState} from "../../app/store";
import {trackAdd, tracksAlbumsFetch, tracksDelete, tracksToggle} from "./tracksThunks";

interface TracksState {
  tracks: TrackMutationType | null;
  tracksLoading: boolean;
  trackAddLoading: boolean;
  trackError: ValidationError | null;
  deleteLoading: boolean | string;
  trackToggleLoading: boolean | string;
}

const initialState: TracksState = {
  tracks: null,
  tracksLoading: false,
  trackAddLoading: false,
  trackError: null,
  deleteLoading: false,
  trackToggleLoading: false,
}

export const tracksSLice = createSlice({
  name: 'tracks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(tracksAlbumsFetch.pending, (state) => {
      state.tracksLoading = true;
    });
    builder.addCase(tracksAlbumsFetch.fulfilled, (state, action) => {
      state.tracks = action.payload!;
      state.tracksLoading = false;
    });
    builder.addCase(tracksAlbumsFetch.rejected, (state) => {
      state.tracksLoading = false;
    });

    builder.addCase(trackAdd.pending, (state) => {
      state.trackAddLoading = true;
      state.trackError = null;
    });
    builder.addCase(trackAdd.fulfilled, (state) => {
      state.trackAddLoading = false;
    });
    builder.addCase(trackAdd.rejected, (state, {payload: error}) => {
      state.trackAddLoading = false;
      state.trackError = error || null;
    });

    builder.addCase(tracksDelete.pending, (state, action) => {
      state.deleteLoading = action.meta.arg;
    });
    builder.addCase(tracksDelete.fulfilled, (state) => {
      state.deleteLoading = false;
    });
    builder.addCase(tracksDelete.rejected, (state) => {
      state.deleteLoading = false;
    });

    builder.addCase(tracksToggle.pending, (state, action) => {
      state.trackToggleLoading = action.meta.arg;
    });
    builder.addCase(tracksToggle.fulfilled, (state) => {
      state.trackToggleLoading = false;
    });
    builder.addCase(tracksToggle.rejected, (state) => {
      state.trackToggleLoading = false;
    });
  }
});

export const tracksReducer = tracksSLice.reducer;

export const selectTracksState = (state: RootState) => state.tracks.tracks;
export const selectTracksLoading = (state: RootState) => state.tracks.tracksLoading;
export const selectTrackAddLoading = (state: RootState) => state.tracks.trackAddLoading;
export const selectTrackAddError = (state: RootState) => state.tracks.trackError;
export const selectTrackDeleteLoading = (state: RootState) => state.tracks.deleteLoading;
export const selectTracksToggleLoading = (state: RootState) => state.tracks.trackToggleLoading;





