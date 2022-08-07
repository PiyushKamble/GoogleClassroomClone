import React, { useState, useEffect } from 'react';
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import { Typography } from '@material-ui/core';
import Avatar from '@mui/material/Avatar';
import useStyles from "../../assets/styles/globalStyles/styles";
import { TextField, Button } from "@material-ui/core";
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { useLocalContext } from "../Context/context";
import { useRef } from 'react';


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


export default function AllStudentsTable({ id, classData, studentsdata,assmtDetails }) {
  console.log("stdu  details ",studentsdata);
  const { db,showStudentStatus,setShowStudentStatus,loggedUser } = useLocalContext();
  const classes = useStyles();
  const [csd, setcsd] = useState([]);
  const [isd, setisd] = useState([]);
  const [empty_array, setarray] = useState([]);
  const [assignmentmarks, setassignmarks] = useState(0);

  console.log("isd ",isd);
  console.log("csd ",csd);


  const [open, setOpen] = React.useState(false);

  

  useEffect(() => {
    requiredinfo()
  }, []);

  const requiredinfo = async () => {
    let completedStudents = []
    let incompletedStudents = []
    studentsdata.forEach(async (student) => {
      const studentAssignmentinfo = await db
        .collection("CreatedClasses")
        .doc(classData.ownerMail)
        .collection("ClassC")
        .doc(classData.code)
        .collection("Assignment")
        .doc(id)
        .collection("Submissions")
        .doc(student.email_id)
        .get()

      if (studentAssignmentinfo.exists) {
        completedStudents.push(studentAssignmentinfo.data())
      }
      else {
        const notreachedstudent = await db
          .collection("CreatedClasses")
          .doc(classData.ownerMail)
          .collection("ClassC")
          .doc(classData.code)
          .collection("Status")
          .doc(student.email_id)
          .get()

        incompletedStudents.push(notreachedstudent.data())
      }
      setcsd(completedStudents)
      setisd(incompletedStudents)

    })
  }

  const handleaddmarks = async (e, mail_id) => {
    try {
      const addClass = await db
        .collection("CreatedClasses")
        .doc(classData.ownerMail)
        .collection("ClassC")
        .doc(classData.code)
        .collection("Assignment")
        .doc(id)
        .collection("Submissions")
        .doc(mail_id)
        .set({
          Marks: assignmentmarks,
        },
          { merge: true });

      requiredinfo()


    } catch (e) {
      alert(e);
    }
  };

  return (
    <>
     
      <div style={{ margin: "auto" }}>

        <Dialog

          PaperProps={{
            sx: {
              width: 600,

            }
          }}

          open={showStudentStatus}
          TransitionComponent={Transition}
          keepMounted
          onClose={()=>setShowStudentStatus(false)}
          aria-describedby="alert-dialog-slide-description"

        >
          <DialogTitle>{assmtDetails.Title}</DialogTitle>
          <DialogContent >
            <List sx={{ width: '100%', maxWidth: 600, bgcolor: 'background.paper' }}>
              {csd.map((stud, idx) => (
                <>
                
                  <ListItem key={idx} alignItems="flex-start" >
                    
                    <ListItemAvatar>
                      <Avatar   />
                    </ListItemAvatar>
                    <ListItemText
                      primary="Brunch this weekend?"
                      secondary={
                        <React.Fragment>
                          <Typography
                            sx={{ display: 'inline' }}
                            component="span"
                            variant="body2"
                            color="primary"
                          >
                            Ali Connors
                          </Typography>
                          {" — I'll be in your neighborhood doing errands thisbs nsdbsuidbsjkdbj…"}
                        </React.Fragment>


                      }
                    />
                    <div style={{ float: "right", fontSize: "2rem" }}>10</div>
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </>
              ))}

              {isd.map((stud,idx)=>(
                <div  key={idx} >
                
                <ListItem 
                
                alignItems="flex-start"  
                style={{backgroundColor:"#ffcccb",borderRadius:"10px"}}
                >
                  
                  <ListItemAvatar>
                    <Avatar   />
                  </ListItemAvatar>
                  <ListItemText
                    primary={stud.name}
                    
                  />
                  <div style={{ float: "right", fontSize: "1rem",color:"#f70d1a" }}>NOT REACHED</div>
                </ListItem>
                <Divider variant="inset" component="li" />
              </div>


              ))}




            </List>


          </DialogContent>
          <DialogActions>
            <Button onClick={()=>setShowStudentStatus(false)}>Disagree</Button>
            <Button onClick={()=>setShowStudentStatus(false)}>Agree</Button>
          </DialogActions>
        </Dialog>
      </div>
    </>

  );
}

// <>
    //   <TableContainer component={Paper}>
    //     <Table aria-label="collapsible table">
    //       <TableHead >
    //         <TableRow>
    //           <TableCell>Name</TableCell>
    //           <TableCell align="center">Status</TableCell>
    //           <TableCell align="center">Marks</TableCell>
    //         </TableRow>
    //       </TableHead>
    //       <TableBody>
    //       {csd.map((student,index)=>(
    //         student.Status==false?  
    //         <TableRow >
    //         <TableCell>{student.name}</TableCell>
    //         <TableCell align="center">Not Completed</TableCell>
    //         <TableCell align="center">--</TableCell>
    //         </TableRow>
    //         :student.Marks=="-1"?
    //         <TableRow >
    //         <TableCell>{student.name}</TableCell>
    //         <TableCell align="center"><a href={student.UploadedURL[0].URL} target="_blank" rel="noreferrer"><PictureAsPdfIcon /></a></TableCell>
    //         <TableCell><TextField
    //           label="Marks"
    //           type="number"
    //           variant="outlined"
    //           color="primary"
    //           size="small"
    //           className={classes.createInputFields}
    //           inputProps={{ min: 0, max: 10 }}
    //           onChange={(e) => setassignmarks(parseInt(e.target.value))}
    //         /><Button
    //         type="submit"
    //         variant="contained"
    //         color="primary"
    //         size="medium"
    //         onClick={(e) => {
    //           handleaddmarks(e,student.email_id);
    //         }}
    //       >
    //         Add
    //       </Button></TableCell>
    //         </TableRow>
    //       :
    //       <TableRow >
    //       <TableCell>{student.name}</TableCell>
    //       <TableCell align="center"><a href={student.UploadedURL[0].URL} target="_blank" rel="noreferrer"><PictureAsPdfIcon /></a></TableCell>
    //       <TableCell align="center">{student.Marks}</TableCell>
    //       </TableRow>

    //         ))}
    //       {isd.map((student,index)=>(
    //         <TableRow >
    //         <TableCell>{student.name}</TableCell>
    //         <TableCell align="center">Not Reached</TableCell>
    //         <TableCell align="center">--</TableCell>
    //         </TableRow>

    //         ))}
    //       </TableBody>
    //     </Table>
    //   </TableContainer>
    // </>