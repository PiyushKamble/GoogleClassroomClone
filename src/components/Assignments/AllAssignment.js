import React, { useEffect, useState } from "react";
import { useLocalContext } from "../Context/context";
import { Avatar, Box, Container, Grid } from "@material-ui/core";
import DeleteIcon from '@mui/icons-material/Delete';
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';

import Chip from '@mui/material/Chip';
import ImgModal from "../teacher/ImageModal";
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ImageIcon from "@mui/icons-material/Image";

import StudentStatus from "./StudentStatus";
import AllStudentsTable from "./AllStudentsTable";
import DelConfirm from "../FeedbackUtils/DeleteConfirm";


const AllAssignment = ({ classData, modules, Assignments, studentsdata }) => {
  console.log(Assignments);
  const { db, openImg, setOpenImg, setOpenFileType, setShowStudentStatus,delDialog,setDelDialog } = useLocalContext();
  const [url, setUrl] = useState("");
  const [expanded, setExpanded] = React.useState(false);
  const [assmtId, setAssmtId] = useState(0);
  const [assmtIdx, setAssmtIdx] = useState(0);


  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);

  };

  const handleDelAssignment = (module, id) => {
    setDelDialog({...delDialog,status:false})

    db
      .collection("CreatedClasses")
      .doc(classData.ownerMail)
      .collection("ClassC")
      .doc(classData.code)
      .collection("Assignment")
      .doc(id)
      .delete();

  }


  return (
    <>
      <Grid
        container
        spacing={1}
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        {Assignments.map((item, index) => (
          <>
            <Card sx={{ margin: "2%", width: "35%", backgroundColor: "#fefefe", padding: 2 }} key={index}>

              <div style={{ float: "right", padding: "2%", cursor: "pointer" }}>
                <DeleteIcon sx={{ color: "#d11a2a" }} onClick={() =>setDelDialog({...delDialog,status:true,onConfirm:()=>handleDelAssignment(item.Modname, item.id)}) } />
                
              </div>
              <div className="amt__Cnt">
                <h2 className="amt__txt">{item.Title}</h2>
                <h5 className="amt__txt">{item.Modname}</h5>
                <p className="amt__txt">{item.text}</p>

                {
                  item.pdfURL?.map((pdf, idx) => (
                    <Chip key={idx} color="primary"
                      onClick={(e) => { setOpenImg(true); setUrl(pdf.URL); }} style={{ margin: "1%" }}
                      size="small" icon={<PictureAsPdfIcon />}
                      label={pdf.name.substr(0, 10)}
                    />


                  ))
                }
                {
                  item.docURL?.map((doc, idx) => (
                    <Chip key={idx} color="info"
                      onClick={(e) => { setOpenFileType("doc"); setOpenImg(true); setUrl(doc.URL); }} style={{ margin: "1%" }}
                      size="small" icon={<InsertDriveFileIcon />}
                      label={doc.name.substr(0, 10)}
                    />


                  ))
                }
                {
                  item.imgURL?.map((img, idx) => (
                    <Chip key={idx} color="secondary"
                      onClick={(e) => { setOpenImg(true); setUrl(img.URL); }} style={{ margin: "1%" }}
                      size="small" icon={<ImageIcon />}
                      label={img.name.substr(0, 10)}
                    />


                  ))
                }




              </div>
              <Button key={index} onClick={() => { setShowStudentStatus(true); setAssmtIdx(index);setAssmtId(item.id) }} variant="contained" color="success" size="small" sx={{ float: "right" }}>Status</Button>

            </Card>

          </>


          // </Box>

          //     </Typography>

          //   </AccordionSummary>
          //   <AccordionDetails>
          //     
          //     {/* <Requiredinfo id={item.id} /> */}
          //   </AccordionDetails>
          // </Accordion>

        ))}
        {/* <StudentStatus openStatus={status}/> */}
        {openImg && <ImgModal url={url} />}
      </Grid>

      {assmtId ?
        <AllStudentsTable
          id={assmtId}
          classData={classData}
          studentsdata={studentsdata}
          assmtDetails={Assignments[assmtIdx]}
        />
        :
        <></>
      }
      {delDialog.status  && <DelConfirm/>}
    </>


  )

}

export default AllAssignment;
