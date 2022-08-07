import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import {useLocalContext} from "../Context/context"

export default function ImgModal({url}) {
  const [open, setOpen] = React.useState(false);
  const  {setOpenImg,openImg,openFileType,setOpenFileType}=useLocalContext();

  const handleClickOpen = () => {
    setOpenImg(true);
  };

  const handleClose = () => {
    setOpenImg(false);
    setOpenFileType("");
  };

  return (
    <React.Fragment>
      <Dialog style={{width:"100%"}} open={openImg} onClose={handleClose}>
       
        <DialogContent>
          
          <Box
            noValidate
            component="form"
            sx={{
              display: "flex",
              flexDirection: "column",
              m: "auto"
            }}
          >
            {/* <embed src={`http://docs.google.com/gview?url=${url}&embedded=true`}></embed> */}

{openFileType?
<>
<h1>No preview Plzz Download!!!</h1>
<embed  src={url} width="100" height="100" ></embed>
</>

  :
<embed  src={url} width="500" height="800" ></embed>      }   
 </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="secondary" onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
} 
