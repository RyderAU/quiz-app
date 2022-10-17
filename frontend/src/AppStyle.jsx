import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  media: {
    paddingTop: '100%',
  },
  root: {
    width: '100%',
  },

  questionImage: {
    width: '300px',
  },
  videoWrapper: {
    width: '640px',
    height: '360px',
    [theme.breakpoints.down(650)]: {
      width: '390px',
      height: '220px',
    },
  },

  largeIcon: {
    width: '40px',
    height: '40px',
  },

  homeIconWrapper: {
    padding: '0px',
  },

  hidden: {
    display: 'none',
  },

}));

export default useStyles;
