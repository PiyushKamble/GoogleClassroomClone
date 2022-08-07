import React, { useState } from "react";
import { TextField, Box, Container, Button, Fab } from "@material-ui/core";
import useStyles from "../../assets/styles/globalStyles/styles.js";
import AllFAQ from "./AllFAQs";
import firebase from "@firebase/app-compat";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useLocalContext } from "../Context/context";
import FileUploadIcon from '@mui/icons-material/FileUpload';

function FAQ({ questions, classData }) {
  const classes = useStyles();
  let ct = 0;

  const { db, storage, loggedUser } = useLocalContext();

  const [quesNum, setQuesNum] = useState("");
  const [inputLinks, setInputLinks] = useState([]);
  const [ansQues,setAnsQues]=useState("");

  const [inputQuestion, setInputQuestion] = useState("");
  const [inputAns, setInputAns] = useState("");
  const [files, setFiles] = useState([]);
  const handleChange = (e) => {
    setFiles(Object.keys(e.target.files).map(key => (e.target.files[key])));
  };

  const handleAns = async (ques) => {
    try {
      await db
        .collection("FAQs")
        .doc(classData.code)
        .collection("allFAQs")
        .doc(ques)
        .set({
          answers: firebase.firestore.FieldValue.arrayUnion({
            avatarURL: loggedUser.photoURL,
            answer: inputAns,
          })
        }, { merge: true });
    } catch (e) {
      alert(e);
    }

  }

  const handleUpload = async (e) => {
    let id = inputQuestion;
    let quesLen = questions.length;
    let dbRef = db
      .collection("FAQs")
      .doc(classData.code)
      .collection("allFAQs")
      .doc(inputQuestion);

    if (files.length > 0 && inputQuestion) {
      files.forEach(async (file, idx) => {
        let imgTypes = ["png", "jpeg", "jpg"];
        let docTypes = [
          "doc",
          "docx",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];

        let fileType = files[idx].name.split(".").slice(-1)[0].toLowerCase();
        const uploadFile = storage.ref(`${fileType}s/${file.name}`).put(file);
        uploadFile.on("state_changed", async (snapshot) => {
          let url = await storage
            .ref(`${fileType}s`)
            .child(file.name)
            .getDownloadURL();
          console.log("code is", classData.code);
          console.log(url);
          let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("progress", progress);

          let obj = {};
          obj.URL = url;
          obj.name = file.name;
          obj.timestamp = firebase.firestore.Timestamp.now();

          if (progress === 100) {

            try {
              await dbRef
                .set({
                  timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                  name: `question${quesLen}`,
                  ...(imgTypes.includes(fileType) && { imgURL: firebase.firestore.FieldValue.arrayUnion(obj) }),
                  ...(fileType === "pdf" && { pdfURL: firebase.firestore.FieldValue.arrayUnion(obj) }),
                  // ...(docTypes.includes(fileType) && {docURL: firebase.firestore.FieldValue.arrayUnion(obj)}),

                  question: inputQuestion,
                  answers: [],
                }, { merge: true });
            } catch (e) {
              alert(e);
            }
          }
        });

      })
    } else if (inputQuestion && inputLinks) {
      try {
        await dbRef
          .set({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            name: `question${quesLen}`,
            question: inputQuestion,
            linkURL: inputLinks,
            answers: [],
          }, { merge: true });

      } catch (e) {
        alert(e);

      }


    } else if (inputQuestion) {
      try {
        await dbRef
          .set({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            name: `question${quesLen}`,
            question: inputQuestion,
            answers: [],
          });

      } catch (e) {
        alert(e);

      }

    } else {
      alert("Question needed");
    }
  };

  const [showQues, setShowQues] = useState(false);
  const [showAns, setShowAns] = useState(false);

  return (
    <Container>
      <Box
        sx={{
          width: "80%",
          border: "2px solid #9c27b0",
          padding: "2%",
          borderRadius: 10,
          m: "auto",
          mt: 1,
        }}

        boxShadow={6}
      >
        {!showAns && !showQues && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>

            <div style={{ margin: "1%" }}>
              <Button



                className={classes.FaqBtn}
                variant="outlined"
                onClick={() => {
                  setShowQues(true);
                }}

              >


                {" "}
                Ask
              </Button>
            </div>

            <div style={{ margin: "1%" }}>
              <Button

                variant="outlined"
                className={classes.FaqBtn}

                onClick={() => {
                  setShowAns(true);
                }}
              >
                {" "}
                Answer
              </Button>
            </div>

          </div>
        )}

        {showQues && (
          <>
          <div style={{margin:"1%"}}>
            <TextField
              id="filled-multiline-static"
              label="Ask Question"
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              defaultValue="Default Value"
              onChange={(e) => setInputQuestion(e.target.value)}
            />
            </div>
            <div style={{margin:"1%"}}>
            <TextField
              variant="outlined"
              fullWidth
              label="Links goes here"
              onChange={(e) => {
                setInputLinks(e.target.value.split(" "));
              }}
              helperText={`${inputLinks.length} links added`}
            />
            </div>


            <div style={{ padding: "2%" }}>
              <Fab size="small" style={{ backgroundColor: "#252934", color: "#FFF" }}>

                <label style={{ cursor: "pointer" }}>
                  <FileUploadIcon color="inherit" />
                  <input

                    style={{ display: "none" }}
                    multiple
                    onChange={(e) => handleChange(e)}
                    variant="outlined"
                    color="primary"
                    type="file"
                    accept=".png,.jpg,.jpeg,.pdf"
                  />
                </label>
              </Fab>





              <div style={{ display: "flex", float: "right" }}>
                <Button
                  onClick={() => {
                    handleUpload();
                  }}
                  variant="contained"
                  color="primary"
                  className={classes.postBtn}

                >
                  {" "}
                  POST
                </Button>
                <Button
                  onClick={() => {
                    setShowQues(false);
                  }}
                  className={classes.postBtn}
                  variant="contained"
                  color="secondary"
                  className={classes.cancelBtn}
                >
                  {" "}
                  Cancel
                </Button>

              </div>
            </div>
          </>
        )}

        {showAns && (
          <>
            <TextField
              id="filled-multiline-static"
              label="Ask Question"
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              defaultValue="Default Value"
              onChange={(e) => setInputAns(e.target.value)}
              style={{ marginBottom: "1%" }}
            />
            <FormControl style={{ width: "12%", margin: "0 2% 2% 2%" }}>
              <InputLabel id="demo-simple-select-label">ANS TO</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={quesNum}
                label="Module"
                onChange={(e) => {
                  setQuesNum(e.target.value);
                }}
              >
                {questions.map((ques, index) => (
                  <MenuItem key={index} value={ques.name} onClick={()=>setAnsQues(ques.question)}>
                    {ques.question}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <div style={{ margin: "1%", display: "flex", float: "right" }}>
              <Button
                onClick={() => {
                  handleAns(ansQues);
                }}
                className={classes.postBtn}
              >
                {" "}
                Ans
              </Button>
              <Button
                onClick={() => {
                  setShowAns(false);
                }}
                className={classes.cancelBtn}
              >
                {" "}
                Cancel
              </Button>
            </div>
          </>
        )}
      </Box>

      <AllFAQ questions={questions} classData={classData} />
    </Container>
  );
}

export default FAQ;
