import React from 'react';
import Header from "./components/Header/Header";
import {CssBaseline} from "@mui/material";
import {Route, Routes} from "react-router-dom";
import Artists from "./featurees/artists/Artists";
import Albums from "./featurees/albums/Albums";
import Tracks from "./featurees/tracks/Tracks";
import NoPage from "./components/NoPage/NoPage";
import Login from "./featurees/users/Login";
import Register from "./featurees/users/Register";
import TrackHistory from "./featurees/trackHistory/TrackHistory";
import ArtistAdd from "./featurees/artists/ArtistAdd";
import AlbumAdd from "./featurees/albums/AlbumAdd";
import TrackAdd from "./featurees/tracks/TrackAdd";
import {useAppSelector} from "./app/hooks";
import {selectUser} from "./featurees/users/usersSlice";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

function App() {
  const user = useAppSelector(selectUser);

  return (
    <div>
      <CssBaseline/>
      <Header/>
      <Routes>
        <Route path={'/'} element={<Artists/>}/>
        <Route path={'/artistAdd'} element={
          <ProtectedRoute isAllowed={user !== null}>
            <ArtistAdd/>
          </ProtectedRoute>
          }/>
        <Route path={'/albums/:id'} element={<Albums/>}/>
        <Route path={'/albumsAdd'} element={
          <ProtectedRoute isAllowed={user !== null}>
            <AlbumAdd/>
          </ProtectedRoute>
        }/>
        <Route path={'/tracks/:id'} element={<Tracks/>}/>
        <Route path={'/trackAdd'} element={
          <ProtectedRoute isAllowed={user !== null}>
            <TrackAdd/>
          </ProtectedRoute>
        }/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/trackHistory" element={<TrackHistory/>}/>
        <Route path={'/*'} element={<NoPage/>}/>
      </Routes>
    </div>
  );
}

export default App;
