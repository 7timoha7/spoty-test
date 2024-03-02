import React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {getVideoId, selectModalShow, selectVideoId, showModal} from "../../featurees/modalYouTube/modalYouTubeSlise";
import YouTube from "react-youtube";

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'content',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const ModalYouTube = () => {

  const dispatch = useAppDispatch();
  const modalShow = useAppSelector(selectModalShow);
  const videoIdState = useAppSelector(selectVideoId);

  const closeModal = (close: boolean) => {
    dispatch(showModal(close));
    dispatch(getVideoId(null));
  }

  const videoOptions = {
    playerVars: {
      autoplay: 1,
      controls: 1,
      rel: 0,
      showinfo: 0,
      mute: 1,
      loop: 1
    }
  };

  return (
    <div>
      <Modal
        open={modalShow}
        onClose={() => closeModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {videoIdState ? (
            <YouTube opts={videoOptions} videoId={videoIdState}/>
          ) : <h1>No video</h1>}
        </Box>
      </Modal>
    </div>
  );
};

export default ModalYouTube;