import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../../app/store";

interface ModalState {
  show: boolean;
  videoId: string | null;
}

const initialState: ModalState = {
  show: false,
  videoId: null,
}

export const modalSLice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    showModal: (state, action: PayloadAction<boolean>) => {
      state.show = action.payload;
    },
    getVideoId: (state, action: PayloadAction<string | null>) => {
      state.videoId = action.payload;
    },
  }
});

export const modalReducer = modalSLice.reducer;
export const {showModal, getVideoId} = modalSLice.actions;

export const selectModalShow = (state: RootState) => state.modal.show;
export const selectVideoId = (state: RootState) => state.modal.videoId;






