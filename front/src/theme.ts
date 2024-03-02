import { createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    background: {
      paper: '#b0aeae',
      default: 'rgba(29,29,29,0.86)',
    },
  },
  components: {
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        fullWidth: true,
      }
    }
  }
});

export default theme;