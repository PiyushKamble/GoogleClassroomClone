import React from "react";
import db,{ auth } from "../../firebase/config";
import ClassCard from "../Cards/ClassCard";
import { Grid, Container } from "@material-ui/core";
import Paper from "@mui/material/Paper";

import useStyles from "../../assets/styles/globalStyles/styles";
function AllClasses({createdClasses,joinedClasses}) {
  const classes = useStyles();
  return (
    <Container className={classes.root}>
      <Grid
        container
        spacing={1}
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
      > 
      
        {
          createdClasses.map((classData,index)=>(
            <Grid key={index} item xs={12} sm={4} md={3}>
            <ClassCard  classData={classData} />
            </Grid>
          ))
        }
        
        {
          joinedClasses.map((classData,index)=>(
            <Grid key={index} item xs={12} sm={4} md={3}>
            <ClassCard  classData={classData} />
            </Grid>
          ))
        }
      </Grid>
      
    </Container>
  );
}

export default AllClasses;
