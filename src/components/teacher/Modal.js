import React from "react"
import { Box,Modal,TextField,Container} from "@material-ui/core";
const QModal=()=>{
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
    
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
      };
    return(
  <Modal
  open={open}
  onClose={handleClose}
  aria-labelledby="modal-modal-title"
  aria-describedby="modal-modal-description"
>
  <Box sx={style}>
  <TextField
        id="filled-multiline-static"
        label="Multiline"
        fullWidth
        multiline
        rows={4}
        variant="filled"
        defaultValue="Default Value"
      />
  
  <button onClick={(e)=>console.log()} style={{ padding: "1%",float:"right" }}>Post</button>
  </Box>
</Modal>)

}

export default Modal;