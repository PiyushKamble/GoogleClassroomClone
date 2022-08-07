import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@material-ui/core'
import React from 'react'
import { useLocalContext } from '../Context/context'
import NotListedLocationIcon from '@mui/icons-material/NotListedLocation';
export default function DeleteConfirm() {
    const {delDialog,setDelDialog}=useLocalContext();
    return (
        
        <Dialog
        open={delDialog.status}
        onClose={()=>setDelDialog({...delDialog,status:false})}
        
        >
            <DialogTitle style={{textAlign:"center"}}>
                <NotListedLocationIcon sx={{fontSize:"800%",color:"#D22B2B"}}/>
            </DialogTitle>

            <DialogContent>
                <Typography variant="h6">
                    Are you sure to delete ?
                </Typography>

                <Typography variant="subtitle2">
                    This cannot be undone!!
                </Typography>

            </DialogContent>

            <DialogActions>
                <Button variant="contained" style={{backgroundColor:"#FF3131	"}} onClick={delDialog.onConfirm}>Yes</Button>
                <Button variant="contained" color="primary" onClick={()=>setDelDialog({...delDialog,status:false})}>No</Button>
            </DialogActions>
        </Dialog>
    )
}
