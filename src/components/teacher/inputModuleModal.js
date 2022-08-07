import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import {useLocalContext} from "../Context/context";
import { TextField } from "@material-ui/core";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 240,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 10,
  borderRadius:5,
  
  p: 4,
};

export default function BasicModal({addMod}) {
  const {openAddModModal,setOpenAddModModal,modNo,setModNo}=useLocalContext();
  const [open, setOpen] = React.useState(false);
  const handleClose = () => setOpenAddModModal(false);

  return (
    <div>
     
      <Modal
        open={openAddModModal}
        onClose={()=>handleClose()}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" style={{marginBottom:"2%"}}  variant="h6" component="h2">
            Enter module Number
          </Typography>
          <div style={{display:"flex"}}>

          <TextField
          id="outlined-number"
          label="Number"
          type="number"
          variant="outlined"
          inputProps={{ min: 0 }}
          onChange={(e)=>setModNo(e.target.value)}

          InputLabelProps={{
            shrink: true,
          }}
        />
        <div style={{margin:"2%"}}>

          <Button variant="contained" color="success" size="small" onClick={()=>addMod(modNo)}>Add</Button>
          </div>
          </div>
          
        </Box>
        
      </Modal>
    </div>
  );
}
