import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ImageIcon from "@mui/icons-material/Image";
import LinkIcon from "@mui/icons-material/Link";
import DeleteDialog from './DeleteDialog';
import DeleteIcon from '@mui/icons-material/Delete';
import { useLocalContext } from "../Context/context";
import firebase from '@firebase/app-compat';



function Row({ module, classData }) {
  // console.log("module is ",module)
  const [open, setOpen] = useState(false)

  const { db, loggedUserMail, setOpenImg, setUrl ,setOpenFileType,delDialog,setDelDialog} = useLocalContext();

  const handleDelFile = async (type, data, id) => {
    setDelDialog({...delDialog,status:false});
    console.log("in del");

      let fileRef = await db
      .collection("CreatedClasses")
      .doc(classData.ownerMail)
      .collection("ClassC")
      .doc(classData.code)
      .collection("Modules")
      .doc(`module${id[0]}`)
      .collection("SubMod")
      .doc(id)

    if (type == "pdf") {
      fileRef.update({
        pdfURL: firebase.firestore.FieldValue.arrayRemove(data)

      })
    } else if (type == "img") {
      fileRef.update({
        imgURL: firebase.firestore.FieldValue.arrayRemove(data)

      })

    } else if (type == "doc") {
      fileRef.update({
        docURL: firebase.firestore.FieldValue.arrayRemove(data)

      })

    } else if (type == "link") {
      fileRef.update({
        linkURL: firebase.firestore.FieldValue.arrayRemove(data)

      })
    }

    
    



  }


  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {module.id}
        </TableCell>
        <TableCell align="center">{module.pdfURL?.length || 0}</TableCell>
        <TableCell align="center">{module.docURL?.length || 0}</TableCell>
        <TableCell align="center">{module.imgURL?.length || 0}</TableCell>
        <TableCell align="center">{module.linkURL?.length || 0}</TableCell>

      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Details
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell >Date</TableCell>
                    <TableCell align="center">Time</TableCell>
                    <TableCell align="center">Name</TableCell>
                    <TableCell align="center">Link</TableCell>
                    {loggedUserMail === classData.ownerMail &&
                      (<TableCell align="center">Del</TableCell>)}


                  </TableRow>
                </TableHead>
                <TableBody>


                  {module.pdfURL?.map((data) => (
                    <TableRow key={data.name}>
                      <TableCell component="th" scope="row">
                        {data.timestamp.toDate().toISOString().substr(0, 10)}
                      </TableCell>
                      <TableCell>{data.timestamp.toDate().toLocaleTimeString()}</TableCell>
                      <TableCell>{data.name}</TableCell>
                      <TableCell align="center"><PictureAsPdfIcon
                        onClick={() => { setOpenImg(true); setUrl(data.URL) }} /></TableCell>
                      {loggedUserMail === classData.ownerMail &&
                        (<TableCell align="center">< DeleteIcon onClick={() => {
                          // setDeleteDialog(true);
                          setDelDialog({value:"delete",status:true,onConfirm:()=>{handleDelFile("pdf", data, module.id)}});

                          
                        }}
                          style={{ cursor: "pointer" }} fontSize="medium" /></TableCell>)
                      }



                    </TableRow>
                  ))}
                  {module.docURL?.map((data) => (
                    <TableRow key={data.name}>
                      <TableCell component="th" scope="row">
                        {data.timestamp.toDate().toISOString().substr(0, 10)}
                      </TableCell>
                      <TableCell>{data.timestamp.toDate().toLocaleTimeString()}</TableCell>
                      <TableCell>{data.name.slice(0, 10)}...</TableCell>
                      <TableCell align="center"><InsertDriveFileIcon onClick={() => { setOpenImg(true); setUrl(data.URL);setOpenFileType("doc") }} /></TableCell>
                      {loggedUserMail === classData.ownerMail &&
                        (<TableCell align="center">< DeleteIcon onClick={() => {
                          
                          setDelDialog({value:"delete",status:true,onConfirm:()=>{handleDelFile("doc", data, module.id);}});
                         
                          
                        }}
                          style={{ cursor: "pointer" }} fontSize="medium" /></TableCell>)}
                    </TableRow>
                  ))}
                  {module.imgURL?.map((data) => (
                    <TableRow key={data.name}>
                      {/* {console.log("tpe is ",data.timestamp.toDate().toISOString().substr(11,12))} */}
                      <TableCell component="th" scope="row">
                        {data.timestamp.toDate().toISOString().substr(0, 10)}
                      </TableCell>
                      <TableCell>{data.timestamp.toDate().toLocaleTimeString()}</TableCell>
                      <TableCell>{data.name.slice(0, 10)}...</TableCell>
                      <TableCell align="center"><ImageIcon  onClick={() => { setOpenImg(true); setUrl(data.URL) }} /></TableCell>
                      {loggedUserMail === classData.ownerMail &&
                        (<TableCell align="center">< DeleteIcon onClick={() => {
                          // setDeleteDialog(true);
                          
                          setDelDialog({value:"delete",status:true,onConfirm:()=>{handleDelFile("img", data, module.id);}});
                          
                        }}
                          style={{ cursor: "pointer" }} fontSize="medium" /></TableCell>)}

                    </TableRow>
                  ))}

                  {module.linkURL?.map((URL, index) => (

                    <TableRow key={URL}>

                      <TableCell component="th" scope="row">
                        --
                      </TableCell>
                      <TableCell>--</TableCell>
                      <TableCell>{URL.substr(0, 7) === "http://" ? URL : `http://${URL}`}</TableCell>
                      <TableCell align="center"><a href={URL.substr(0, 7) === "http://" ? URL : `http://${URL}`} target="_blank" rel="noreferrer" >
                        <LinkIcon  /></a></TableCell>
                      {loggedUserMail === classData.ownerMail &&
                        (<TableCell align="center">< DeleteIcon onClick={() => {
                          // setDeleteDialog(true);
                          setDelDialog({value:"delete",status:true,onConfirm:()=>{handleDelFile("link", URL, module.id);}});
                          
                        }}
                          style={{ cursor: "pointer" }} fontSize="medium" /></TableCell>)}
                    </TableRow>
                  ))}




                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>

    </React.Fragment>
  )
}






export default function CollapsibleTable({ subMod, classData }) {
  console.log("submofs is ", subMod);
  const { openImg } = useLocalContext();


  return (
    <>

      <TableContainer component={Paper} sx={{ bgcolor: "#f3e5f5", border: "1px solid #252934" }}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>SubModule</TableCell>
              <TableCell align="center">Pdfs</TableCell>
              <TableCell align="center">Docs</TableCell>
              <TableCell align="center">Images</TableCell>
              <TableCell align="center">Urls</TableCell>

            </TableRow>
          </TableHead>
          <TableBody>
            {subMod.map((subModule, index) => (
              <>
                <Row key={index} module={subModule} classData={classData} />

              </>

            ))}
          </TableBody>
        </Table>
        {/* {openImg && <ImgModal url={url} />} */}
      </TableContainer>

      {/* <DeleteDialog open={deleteDialog} data={delFileData} type={delFileType} /> */}
    </>
  );
}
