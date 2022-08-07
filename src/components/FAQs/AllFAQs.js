import React, { useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import { Box, Modal, TextField } from "@material-ui/core";
import useStyles from "../../assets/styles/globalStyles/styles";
import ImgModal from "../teacher/ImageModal";
import { useLocalContext } from "../Context/context";
import DeleteIcon from '@mui/icons-material/Delete';
import firebase from "@firebase/app-compat";
import NotListedLocationIcon from '@mui/icons-material/NotListedLocation';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import LinkIcon from "@mui/icons-material/Link";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ImageIcon from "@mui/icons-material/Image";
import DelConfirm from "../FeedbackUtils/DeleteConfirm";


export default function AllFAQ({ questions, classData }) {
  const classes = useStyles();
  const {  db, openImg, setOpenImg,delDialog,setDelDialog,loggedUserMail } = useLocalContext();
  const [url, setUrl] = useState();

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

  const handleDelFaq = async (ques, ans) => {
    setDelDialog({...delDialog,status:false})
    let faq = await db
      .collection("FAQs")
      .doc(classData.code)
      .collection("allFAQs")
      .doc(ques.name)
      .update({
        answers: firebase.firestore.FieldValue.arrayRemove(ans)
      })
  }

  return (
    <>
      {questions.map((question, index) => (
        //   <div
        //   key={index}
        //   style={{
        //     width: "80%",
        //     margin: "auto",
        //     marginTop: "2%",
        //     border: "1px solid black",
        //     display:"flex",

        //   }}
        // >
        <Accordion
          key={index}
          style={{
            width: "80%",
            margin: "auto",
            marginTop: "2%",
            border: "2px solid #f44336",

            borderRadius: 5

          }}

        >
          <AccordionSummary
            expandIcon={<NotListedLocationIcon sx={{ m: 1, color: "#d50000 " }} />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography   >{question.question}  </Typography>

          </AccordionSummary>
          <AccordionDetails>
            <div>
              {question.pdfURL?.map((pdf, idx) => (

                <Chip color="primary"
                  onClick={(e) => { setOpenImg(true); setUrl(pdf.URL); console.log(url) }} style={{ margin: "1%" }}
                  size="small" icon={<PictureAsPdfIcon />}
                  label={pdf.name}
                />
              ))


              }
            </div>

            <div>
              {question.imgURL?.map((pdf, idx) => (

                <Chip color="secondary"
                  onClick={(e) => { setOpenImg(true); setUrl(pdf.URL); console.log(url) }} style={{ margin: "1%" }}
                  size="small" icon={<ImageIcon />}
                  label={pdf.name}
                />
              ))


              }
            </div>

            <div>
              {question.linkURL?.map((URL, idx) => (

                <a style={{ textDecoration: "none",  }} href={URL.substr(0, 7) === "http://" ? URL : `http://${URL}`} target="_blank" rel="noreferrer" >
                  <Chip color="info"
                  style={{ margin: "1%",cursor: "pointer" }}
                  size="small" icon={<LinkIcon />}
                  label={URL}
                /></a>
              ))


              }
            </div>

            {question.answers.map((ans, idx) => (
              <ListItem
                key={idx}
                alignItems="flex-start"
                style={{ border: "2px solid #aeea00", borderRadius: 5, marginBottom: "1%" }}

              >
                <ListItemAvatar>
                  <Avatar alt="avtUrl" src={ans.avatarURL} />
                </ListItemAvatar>
                <ListItemText
                  sx={{ mt: 2 }}
                  primary={ans.answer}

                />
                {<DeleteIcon onClick={() =>setDelDialog({...delDialog,status:true,onConfirm:()=>handleDelFaq(question, ans)} )} style={{ cursor: "pointer" }} />}
                
              </ListItem>
            ))}
          </AccordionDetails>
          {openImg && <ImgModal url={url} />}
          {delDialog.status && <DelConfirm/>}
        </Accordion>

        // </div>
      ))}
      
    </>
  )
}
