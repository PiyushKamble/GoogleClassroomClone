import React, { useState, useEffect } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import useStyles from "../../assets/styles/globalStyles/styles";
import { useLocalContext } from "../Context/context";
import ImgModal from "./ImageModal";
import SubModTable from "./SubModTable";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DelConfirm from "../FeedbackUtils/DeleteConfirm";


export default function AllModules({ classData, modules,progress }) {
  const classes = useStyles();
  console.log(classData);

  //setModules and subModules
  const [currModule, setCurrModule] = useState("");
  const [currSubModule, setCurrSubModule] = useState("");
  const [complete, setComplete] = useState(false);
  


  const { loggedUserMail, db, openImg, url,delDialog} = useLocalContext();

  //open closing accordion
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);

  //acccordion controlled
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);

  };

  const [subModules, setSubModules] = useState([]);
  // console.log("currModule ", currModule);


  //getting submodules
  const getSubModules = async (modName) => {


    let submodules = await db
      .collection("CreatedClasses")
      .doc(classData.ownerMail)
      .collection("ClassC")
      .doc(classData.code)
      .collection("Modules")
      .doc(modName)
      .collection("SubMod")
      .onSnapshot((snap) => {
        setSubModules(snap.docs.map((doc) => doc.data()));
      });
  };

  //toggling complete incomplete module
  const handleToggleMod =async (e,idx)=>{
    e.preventDefault();
    
    console.log("mod idx is ",idx);
    console.log(progress);

      

      progress[idx]=progress[idx]===0?1:0;
      

      await db
      .collection("CreatedClasses")
      .doc(classData.ownerMail)
      .collection("ClassC")
      .doc(classData.code)
      .collection("Status")
      .doc(loggedUserMail)
      .set({
        Progress:progress,
      },{merge:true})
    
      let userdata=await db
      .collection("CreatedClasses")
      .doc(classData.ownerMail)
      .collection("ClassC")
      .doc(classData.code)
      .collection("Status")
      .doc(loggedUserMail)
      .get()
      
      let assign=await db
      .collection("CreatedClasses")
      .doc(classData.ownerMail)
      .collection("ClassC")
      .doc(classData.code)
      .collection("Assignment")
      .where("Modname", "==", `module${idx+1}`)
      .get()
      console.log(assign)

      assign.forEach(async(doc)=>{
        var deadby = new Date();
        var dd = String(deadby.getDate() + parseInt(doc.data().maxDays)).padStart(2, '0');
        var mm = String(deadby.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = deadby.getFullYear();

        deadby = dd + '/' + mm + '/' + yyyy;

        let studentref =db.collection("CreatedClasses")
        .doc(classData.ownerMail)
        .collection("ClassC")
        .doc(classData.code)
        .collection("Assignment")
        .doc(doc.data().id)
        .collection("Submissions")
        .doc(loggedUserMail);


        await studentref.set(
          {
            email_id: userdata.data().email_id,
            name: userdata.data().name,
            Marks: -1,
            Status: false,
            DeadLine: deadby,
            onTime: true,
            id: doc.data()?.id,
            Title: doc.data()?.Title,
            Modname: doc.data()?.Modname,
            text: doc.data()?.text,
            pdfURL: doc.data()?.pdfURL,
            imgURL: doc.data()?.imgURL,
            docURL: doc.data()?.docURL
          },
          { merge: true }
        );
      })


  }

  //delete module
  const handleDelMod=(e,modName)=>{
    e.preventDefault();
    console.log(modName);
    


  }

  // console.log("subModules are", subModules);
  // console.log("submodules are ",subModules);
  return (
    <>
      {modules.map((data, index) => (
        // <div
        //   onClick={() => {

        //     getSubModules(data.modName);

        //   }}
        //   key={index}
        //   style={{
            
        //     width: "80%",
        //     margin: "auto",
        //     marginTop: "2%",
        //     border: "1px solid red",
        //     display: "block",
        //   }}
        // >
          <Accordion
          onClick={() => {

            getSubModules(data.modName);

          }}
          key={index}

          
          style={{
            
            width: "80%",
            margin: "auto",
            marginTop: "2%",
            // border: "2px solid #bd37b6",
            border: "2px solid #252934",
           
            display: "block",
            // color:"#252934",
            color:"#9c27b0",
            
            backgroundColor:"#f5f5f5",
            borderRadius:5,
          }}
            expanded={expanded === `${data.modName}`}
            onChange={handleChange(data.modName)}
            sx={{
              mt: 1,
              
           
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon style={{color:"	#bd37b6"}} />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography sx={{ width: "50%", flexShrink: 0 }}>
                {data.modName}

              </Typography>
              {loggedUserMail !== classData.ownerMail &&
                (<button style={{ padding: "1px", cursor: "pointer" }} onClick={(e)=>handleToggleMod(e,index)} >
                  {

                    progress && progress[index] ?
                      <CheckCircleIcon color="success" fontSize="medium" />
                      :
                      <AccessTimeIcon color="warning" fontSize="medium" />

                  }


                </button>)
              }

              {/* {loggedUserMail === classData.ownerMail &&
                (<button onClick={(e)=>{handleDelMod(e,data.modName)}}><DeleteIcon /></button>)
              } */}

            </AccordionSummary>
            <AccordionDetails>
              
              <SubModTable subMod={subModules} classData={classData} />
            </AccordionDetails>
            

          </Accordion>
        // </div>
        
      ))}
      {openImg && <ImgModal url={url}  />}
      {delDialog.status && <DelConfirm/>}
    </>
  );
}
