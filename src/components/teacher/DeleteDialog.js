import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useLocalContext } from '../Context/context';

export default function DeleteDialog({open,type,data}) {
  

  const {setDeleteDialog}=useLocalContext();
  console.log("ft and dt ",type,data);
  const handleFileDel=(e)=>{
    e.preventDefault(); 
    console.log("on confirm ",type,data)
  }
  
  return (
    <div>
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        style={{backgroundColor: 'transparent'}}

        
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure to delete??"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
           You won't be able to retrieve the deleted document and need to reupload it.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={(e)=>handleFileDel(e)}>Cancel</Button>
          <Button onClick={()=> {setDeleteDialog(false);}} autoFocus variant="contained" color="secondary" >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
