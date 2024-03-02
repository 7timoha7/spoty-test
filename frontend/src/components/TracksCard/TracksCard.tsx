import React, {useEffect, useState} from 'react';
import DoDisturbIcon from "@mui/icons-material/DoDisturb";
import {Box, Button, Card, Grid, IconButton, LinearProgress, ListItem, ListItemText} from "@mui/material";
import PauseIcon from "@mui/icons-material/Pause";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import DeleteIcon from "@mui/icons-material/Delete";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {selectTrackDeleteLoading, selectTracksToggleLoading} from "../../featurees/tracks/trackSlise";
import {selectUser} from "../../featurees/users/usersSlice";
import {getVideoId, selectModalShow, showModal} from "../../featurees/modalYouTube/modalYouTubeSlise";
import {IPlay, TrackType} from "../../types";
import {tracksAlbumsFetch, tracksDelete, tracksToggle} from "../../featurees/tracks/tracksThunks";
import {addHistory} from "../../featurees/trackHistory/trackHistoryThunks";

interface Props {
  item: TrackType;
}

const TracksCard:React.FC<Props> = ({item}) => {
  const dispatch = useAppDispatch();

  const user = useAppSelector(selectUser);
  const closeModal = useAppSelector(selectModalShow);

  const loadingDelete = useAppSelector(selectTrackDeleteLoading);
  const loadingToggle = useAppSelector(selectTracksToggleLoading);

  const [play, setPlay] = useState<IPlay | null>(null);
  const [progress, setProgress] = React.useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          return 0;
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, [play]);

  useEffect(() => {
    if (!closeModal) {
      setPlay(null);
    }
  }, [closeModal]);

  const clickPlay = async (trackId: string, videoId: string | null) => {
    setProgress(0);
    if (play) {
      setPlay(prev => ({
        id: trackId,
        status: prev?.id === trackId ? !prev.status : true,
      }));
    } else {
      setPlay({
        id: trackId,
        status: true
      });
    }
    if (videoId) {
      await dispatch(getVideoId(videoId));
      await dispatch(showModal(true));
    }
    await dispatch(addHistory(trackId));
  }

  const onClickDelete = async (trackId: string, albumId: string) => {
    await dispatch(tracksDelete(trackId));
    await dispatch(tracksAlbumsFetch(albumId));
  }

  const getPublished = async (idTrack: string, idTrackAlbum: string) => {
    await dispatch(tracksToggle(idTrack));
    await dispatch(tracksAlbumsFetch(idTrackAlbum))
  }

  const loadingToggleAndDelete = (id: string) => {
    if ((id === loadingToggle) || (loadingDelete === id)) {
      return true
    }
  }
  return (
    <>
      <Card sx={{maxWidth: "100%", mt: 2, bgcolor: '#7ff1dc', position: "relative"}} key={item._id}>
        {!item.isPublished &&
          <DoDisturbIcon
            sx={{position: "absolute", height: "100%", width: "100%", background: 'rgba(255,255,255,0.67)'}}
            color="disabled"></DoDisturbIcon>
        }
        <Grid container justifyContent={"space-between"} alignItems={'center'} spacing={3}>
          <Grid item>
            <ListItem>
              <ListItemText primary={`${item.trackNumber}. ${item.name} - ${item.duration}`}/>
            </ListItem>
          </Grid>
          {play?.id === item._id && play?.status ? (
            <Box sx={{width: '35%', mb: -3}}>
              <LinearProgress variant="determinate" value={progress}/>
            </Box>
          ) : null}
          {user ?
            <Grid item>
              <Grid container justifyContent={"space-between"} alignItems={'center'}>
                <Grid item>
                  <Button
                    disabled={loadingToggleAndDelete(item._id)}
                    onClick={() => clickPlay(item._id, item.videoId)}>
                    {play?.status && play.id === item._id ? (
                      <PauseIcon/>) : (<PlayCircleFilledIcon/>)}</Button>
                </Grid>
                {((user?.role === 'admin') || (user?._id === item.user && !item.isPublished)) &&
                  <Grid item>
                    <IconButton
                      disabled={loadingToggleAndDelete(item._id)}
                      onClick={() => onClickDelete(item._id, item.album)} aria-label="delete" size="large">
                      <DeleteIcon fontSize="inherit"/>
                    </IconButton>
                  </Grid>
                }
                {user?.role === 'admin' &&
                  <IconButton
                    disabled={loadingToggleAndDelete(item._id)}
                    onClick={() => getPublished(item._id, item.album)} aria-label="delete"
                    size="large">
                    {!item.isPublished ? <ToggleOffIcon color={'error'} fontSize="inherit"/> :
                      <ToggleOnIcon color={'info'} fontSize="inherit"/>
                    }
                  </IconButton>
                }
              </Grid>
            </Grid>
            : null}
        </Grid>
      </Card>
    </>
  );
};

export default TracksCard;