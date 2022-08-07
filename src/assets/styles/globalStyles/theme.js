import { createTheme } from '@mui/material/styles';
import { purple } from '@mui/material/colors';
const customTheme=createTheme({
    //colors
    palette:{
        primary :{
            main:"#252934",
        },
        secondary:{
            main:"#bd37b6",  
        }
        

    },
    //typography fpr fonts
    typography:{
       fontFamily:"Titillium+Web",
       fontWeightLight:400,
       fontWeightRegular:500,
       fontWeightMedium:600,
       fontWeightBold:700,
    }


});

export default customTheme;