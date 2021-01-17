import { createMuiTheme } from '@material-ui/core/styles';
import { red, blue, orange, lightGreen, cyan, pink } from '@material-ui/core/colors';

// Create a theme instance.
const theme = createMuiTheme({
    palette: {
        primary: blue,
        secondary: pink,
        success: lightGreen,
        warning: orange,
        error: red,
        info: cyan,
    },
});

export default theme;
