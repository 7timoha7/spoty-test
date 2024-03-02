// import {configureStore} from "@reduxjs/toolkit";
// import {artistsReducer} from "../featurees/artists/artistsSlice";
// import {albumsReducer} from "../featurees/albums/albumsSlice";
// import {tracksReducer} from "../featurees/tracks/trackSlise";
// import {usersReducer} from "../featurees/users/usersSlice";
//
// const usersPersistConfig = {
//   key: 'shop:users',
//   storage,
//   whitelist: ['user'],
// };
//
// export const store = configureStore({
//   reducer: {
//     artists: artistsReducer,
//     albums: albumsReducer,
//     tracks: tracksReducer,
//     users: usersReducer,
//   }
// });
//
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;


import {combineReducers, configureStore} from '@reduxjs/toolkit';

import {persistReducer, persistStore} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import {FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE} from 'redux-persist/es/constants';
import {tracksReducer} from "../featurees/tracks/trackSlise";
import {albumsReducer} from "../featurees/albums/albumsSlice";
import {artistsReducer} from "../featurees/artists/artistsSlice";
import {usersReducer} from "../featurees/users/usersSlice";
import {trackHistoryReducer} from "../featurees/trackHistory/trackHistorySlice";
import {modalReducer} from "../featurees/modalYouTube/modalYouTubeSlise";

const usersPersistConfig = {
  key: 'spotify:users',
  storage,
  whitelist: ['user'],
};

const rootReducer = combineReducers({
  artists: artistsReducer,
  albums: albumsReducer,
  tracks: tracksReducer,
  users: persistReducer(usersPersistConfig, usersReducer),
  trackHistory: trackHistoryReducer,
  modal: modalReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


