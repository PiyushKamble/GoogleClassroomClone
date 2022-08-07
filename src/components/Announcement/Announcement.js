import React, { useState } from "react";
import { TextField, Box, Container, Fab } from "@material-ui/core";
import { width } from "@mui/system";
import useStyles from "../../assets/styles/globalStyles/styles.js";
import { useLocalContext } from "../Context/context";
import firebase from "@firebase/app-compat";
import { v4 as uuidv4 } from "uuid";
import AllAnnouncements from "./AllAnnouncements";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import SendIcon from '@mui/icons-material/Send';
function Announcement({ classData }) {
  const { storage, db, loggedUserMail, loggedUser } = useLocalContext();

  const [inputValue, setInputValue] = useState("");
  const [inputLinks, setInputLinks] = useState([]);
  const [files, setFiles] = useState([]);
  const handleChange = (e) => {
   
    setFiles(Object.keys(e.target.files).map(key=>(e.target.files[key])));
  };
  const handleUpload = async (e) => {
    
    let id = uuidv4();
    let dbRef = db
      .collection("announcements")
      .doc(classData.code)
      .collection("allAnnouncements")
      .doc(id);

    if (files.length > 0 && inputValue) {
      files.forEach(async (file,idx) => {
        console.log(file.name,idx);
        let imgTypes = ["png", "jpeg", "jpg"];
        let docTypes = [
          "doc",
          "docx",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];
        let fileType = files[idx].name.split(".").slice(-1)[0].toLowerCase();
        
        const uploadImage = storage.ref(`${fileType}s/${file.name}`).put(file);
        let url;
        uploadImage.on("state_changed", async (snapshot) => {
          url = await storage.ref(`${fileType}s`).child(file.name).getDownloadURL();
          console.log("code is", classData.code);
          console.log(url);

          let progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("progress", progress);

          let obj = {};
          obj.URL = url;
          obj.name = file.name;


          if (progress === 100) {
            console.log("filetyoe is ",fileType);
            try {
             
                await dbRef.set(
                  {
                    id: id,
                    timestamp : firebase.firestore.Timestamp.now(),
                    text: inputValue,
                    sender: loggedUserMail,
                    ownerAvatarURL: loggedUser.photoURL,
                ...(imgTypes.includes(fileType) && {imgURL: firebase.firestore.FieldValue.arrayUnion(obj)}),
                ...(fileType==="pdf" && {pdfURL: firebase.firestore.FieldValue.arrayUnion(obj)}),
                ...(docTypes.includes(fileType) && {docURL: firebase.firestore.FieldValue.arrayUnion(obj)}),
                  },
                  { merge: true }
                );

              if (inputLinks !== []) {
                await dbRef.set(
                  {
                    linkURL: inputLinks
                  },
                  { merge: true }
                );
              }
            } catch (e) {
              alert(e);
            }
          }


        });

      })
      

    } else if (inputValue) {
      try {
        if (inputLinks !== []) {
          await dbRef.set(
            {
              linkURL: inputLinks,
            },
            { merge: true }
          );
        }

        await dbRef.set(
          {
            id: id,
            timestamp : firebase.firestore.Timestamp.now(),
            text: inputValue,
            sender: loggedUserMail,
            ownerAvatarURL: loggedUser.photoURL,
            text: inputValue,
            pdfURL:[],
            docURL:[],
            imgURL:[],
          },
          { merge: true }
        );
      } catch (e) {

      }
    } else {
      alert("input value needed")
    }

    setInputLinks([]);
    setInputValue("");
  };
  const classes = useStyles();

  return (
    <Container>
      { (<Box
        sx={{
          width: "80%",
          border: "1px solid black",
          padding: "2%",
          borderRadius: 10,
          m: "auto",
          mt: 1,
        }}
        boxShadow={6}
      >
        <TextField
          id="filled-multiline-static"
          label="Content"
          multiline
          rows={2}
          fullWidth
          variant="filled"
          defaultValue={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
        />

        <TextField
          fullWidth
          label="Links go here"
          onChange={(e) => {
            setInputLinks(e.target.value.split(" "));
          }}
        />

        <div style={{ padding: "2%" }}>
          <button>
          <label>
            <FileUploadIcon />
            <input
              onChange={(e) => handleChange(e)}
              multiple
              type="file"
              accept=".png,.jpg,.jpeg,.pdf,.doc,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              style={{ display: "none" }}
            />
          </label>
          </button>

          <div style={{ float: "right" }}>
            <button size="small" 
              onClick={(e) => {
                handleUpload(e);
                setInputValue("");
                setInputLinks([]);
                setFiles([]);
              }}
              className={classes.postBtn}
              
            >
              {" "}
              <SendIcon/>
            </button>
          </div>
        </div>
      </Box>)
      }
      <AllAnnouncements classData={classData} />
    </Container>
  );
}

export default Announcement;
