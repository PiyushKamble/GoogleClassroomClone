import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Slide,
  Box,
  Avatar,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { useLocalContext } from "../Context/context";
import useStyles from "../../assets/styles/globalStyles/styles";
import firebase from "@firebase/app-compat";
import { useHistory } from "react-router-dom";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});



export default function JoinClass() {
  const {
    joinClassDialog,
    setJoinClassDialog,
    loggedUser,
    loggedUserMail,
    db,auth
  } = useLocalContext();
  const classes = useStyles();
  const history =useHistory();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [errortxt, setErrortxt] = useState("");

  const [joinedData, setJoinedData] = useState({});

  const handleJoin = async (e) => {
    e.preventDefault();
    console.log(code, email);

    try {
      const toJoinClassRef = db
        .collection("CreatedClasses")
        .doc(email)
        .collection("ClassC")
        .doc(code);

      const toJoinClassmail = db
        .collection("CreatedClasses")
        .doc(email)
        .collection("ClassC")
        .doc(code)
        .collection("Status")
        .doc(loggedUser.email);

      let toJoinClass = await toJoinClassRef.get();
      let lernermail = await toJoinClassmail.get();
      
      if ((toJoinClass.exists) && (toJoinClass.owner !== loggedUser.email)) {
        if (lernermail.exists) {
            console.log("classFound ", toJoinClass.data());
            let data = toJoinClass.data();
    
            //updating the enrolled array in createdClasses to keep a track of enrolled students
            toJoinClassRef.update({
              enrolled: firebase.firestore.FieldValue.arrayUnion(loggedUserMail),
            });
    
            console.log(data);
            setJoinedData(data);
            setError(false);
            await db
              .collection("joinedClasses")
              .doc(loggedUserMail)
              .collection("classesJ")
              .doc(code)
              .set(
                {
                  code: data.code,
                  dateCreated: data.dateCreated,
                  ownerMail: data.ownerMail,
                  ownerAvatarURL:data.ownerAvatarURL,
                  className: data.className,
                  subject: data.subject,
                  domain: data.domain,
                },
                { merge: true }
              );
            await db
              .collection("CreatedClasses")
              .doc(email)
              .collection("ClassC")
              .doc(code)
              .collection("Status")
              .doc(loggedUser.email)
              .set(
                {
                  Enrolled_Status : true,
                  name: loggedUser.displayName,
                  avatarURL: loggedUser.photoURL },
                { merge: true }
              );
            setJoinClassDialog(false);
          } else {
            setError(true);
            setErrortxt("You dont have access to the class");
            return;
          }

      }
      else {
        setError(true);
        setErrortxt("No class found");
        return;
      }
      
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      <Dialog
        fullScreen
        open={joinClassDialog}
        onClose={() => setJoinClassDialog(false)}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setJoinClassDialog(false)}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Join Class
            </Typography>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              p: 1,
              m: 1,
              bgcolor: "background.paper",
            }}
          >
            <div className={classes.joinClass}>
              <h4>You are currently logged in as {loggedUser?.email}</h4>
              <div style={{ display: "flex", marginTop: "20px" }}>
                <Avatar alt="Remy Sharp" src={loggedUser?.photoURL} />
                <h5 style={{ margin: "10px" }}>{loggedUser?.displayName}</h5>
              </div>
              <Button onClick={()=>{auth.signOut();history.push("/login")}} variant="outlined">Logout</Button>
            </div>
            <div className={classes.joinClass}>
              <h3>Class Name</h3>
              <h4>Ask your teacher for Class Name and then, enter it!!</h4>
              <div style={{ display: "flex", marginTop: "20px" }}>
                <TextField
                  label="Class Name"
                  type="text"
                  variant="outlined"
                  color="primary"
                  error={error}
                  onChange={(e) => setCode(e.target.value)}
                  helperText={error && errortxt}
                  style={{ width: "50%", margin: "1%" }}
                  required={true}
                />
                <TextField
                  label="Owners email"
                  type="email"
                  variant="outlined"
                  color="primary"
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: "50%", margin: "1%" }}
                  required={true}
                />
              </div>
              <Button
                onClick={(e) => handleJoin(e)}
                style={{ margin: "1%" }}
                variant="outlined"
              >
                Join
              </Button>
            </div>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
}
