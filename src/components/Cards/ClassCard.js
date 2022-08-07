import React from "react";
import db,{ auth} from "../../firebase/config";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardActions from "@mui/material/CardActions";

import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import {Link,useHistory} from "react-router-dom"
import { useLocalContext } from "../Context/context";

export default function ClassCard({classData}) {
  let date = new Date().toISOString().slice(0, 10)
  const {loggedUserMail}=useLocalContext();
  const history =useHistory();

  const handleUnEnroll = async (e,code) => {

    try {
    await db
      .collection("joinedClasses")
      .doc(loggedUserMail)
      .collection("classesJ")
      .doc(code)
      .delete()
    
    await db
      .collection("CreatedClasses")
      .doc(classData.ownerMail)
      .collection("ClassC")
      .doc(code)
      .collection("Status")
      .doc(loggedUserMail)
      .delete()

    let Assignments = []
    await db
      .collection("CreatedClasses")
      .doc(classData.ownerMail)
      .collection("ClassC")
      .doc(code)
      .collection("Assignment")
      .onSnapshot((snap) => {
        Assignments=snap.docs.map((doc) => doc.data())     
      });

    Assignments.forEach(async(doc)=>{
      try {
        await db
          .collection("CreatedClasses")
          .doc(classData.ownerMail)
          .collection("ClassC")
          .doc(code)
          .collection("Assignment")
          .doc(doc.id)
          .collection("Submissions")
          .doc(loggedUserMail)
          .delete()

          
      }catch (e) {
        console.log(e);
    }
  });

    }catch(e) {
      console.log(e);
    }
  }

  const handleDelete = async (e,code) => {

    try {
    let Students = []
    await db
      .collection("CreatedClasses")
      .doc(classData.ownerMail)
      .collection("ClassC")
      .doc(code)
      .collection("Status")
      .onSnapshot((snap) => {
        Students=snap.docs.map((doc) => doc.data())     
      });

    await db
      .collection("CreatedClasses")
      .doc(loggedUserMail)
      .collection("ClassC")
      .doc(code)
      .delete()

      Students.forEach(async(doc)=>{
        try {
          await db
            .collection("joinedClasses")
            .doc(doc.email_id)
            .collection("classesJ")
            .doc(code)
            .delete()
  
            
        }catch (e) {
          console.log(e);
          }
      });
    }catch(e) {
      console.log(e);
    }
  }

  return (
    <Card sx={{ maxWidth: 350 ,backgroundColor:"#fefefz",}}
    
    >
      <CardHeader
        avatar={<Avatar alt="Remy Sharp" src={classData.ownerAvatarURL}/>}
        title={classData.ownerMail.split("@")[0]}
        subheader={classData.dateCreated}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {classData.className}
        </Typography>
        <Typography variant="body2" color="text.secondary">
        {classData.domain}
        </Typography>
        <Typography variant="body2" color="text.secondary">
        {classData.subject}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small"  onClick={()=>history.push(`/${classData.code}`)}>Open</Button>
        <div style={{float:"right"}}>
        {
          
          loggedUserMail===classData.ownerMail?
           <Button size="small" onClick={(e) => {
            handleDelete(e,classData.code);
          }} >Delete</Button>
           :
           <Button size="small" onClick={(e) => {
            handleUnEnroll(e,classData.code);
          }}>UnEnroll</Button>

        }
        </div>
       
      </CardActions>
    </Card>
  );
}
