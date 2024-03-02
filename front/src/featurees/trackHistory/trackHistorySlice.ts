import {createSlice} from "@reduxjs/toolkit";
import {RootState} from '../../app/store';
import {fetchUserTracks} from "./trackHistoryThunks";
import {HistoryType} from "../../types";

interface trackHistoryState {
  tracksHistory: HistoryType[];
  tracksLoading: boolean;
}

const initialState: trackHistoryState = {
  tracksHistory: [],
  tracksLoading:false,
};

export const trackHistorySlice = createSlice({
  name: 'trackHistory',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUserTracks.pending, (state) => {
      state.tracksLoading = true;
    });
    builder.addCase(fetchUserTracks.fulfilled, (state, action) => {
      state.tracksHistory = action.payload!;
      state.tracksLoading = false;
    });
    builder.addCase(fetchUserTracks.rejected, (state) => {
      state.tracksLoading = false;
    });
  }
});

export const trackHistoryReducer = trackHistorySlice.reducer;

export const selectAddHistoryState = (state: RootState) => state.trackHistory.tracksHistory;
export const selectHistoryUserLoading = (state: RootState) => state.trackHistory.tracksLoading;
