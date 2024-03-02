import React, {useEffect} from 'react';
import {Card, Container, Grid, List, ListItem, ListItemText} from "@mui/material";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {fetchUserTracks} from "./trackHistoryThunks";
import {selectAddHistoryState, selectHistoryUserLoading} from "./trackHistorySlice";
import dayjs from "dayjs";
import {selectUser} from "../users/usersSlice";
import {useNavigate} from "react-router-dom";

const TrackHistory = () => {
  const dispatch = useAppDispatch();
  const tracksHistory = useAppSelector(selectAddHistoryState);
  const loading = useAppSelector(selectHistoryUserLoading);
  const user = useAppSelector(selectUser);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchUserTracks());
  }, [dispatch]);

  if (!user) {
    navigate('/login');
  }

  const noContent = () => {
    return <Grid container spacing={1} justifyContent={'center'}><h1>No Content</h1></Grid>
  }

  return (
    <div>
      <Container maxWidth={'md'} sx={{mt: 4}}>
        {tracksHistory ? <>
          {loading ? <LoadingSpinner/> : <>
            <h1>Track history</h1>
            <List>
              {tracksHistory?.map(item => {
                return (
                  <Card sx={{maxWidth: "100%", mt: 2, bgcolor: '#7ff1dc'}} key={item._id}>
                    <Grid container justifyContent={"space-between"} spacing={2}>
                      <Grid item>
                        <ListItem>
                          <ListItemText primary={`${item.track.album.artist.name}.
                         ${item.track.name} - ${dayjs(item.datetime).format('DD-MM-YYYY HH:mm ')}`}/>
                        </ListItem>
                      </Grid>
                    </Grid>
                  </Card>
                )
              })}
            </List>
          </>}
        </> : noContent()}
      </Container>
    </div>
  );
};

export default TrackHistory;