import useStyles from "../../assets/styles/globalStyles/styles";
import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Container,Button } from "@mui/material";
import Module from "./Module";
import Announcement from "../Announcement/Announcement";
import FAQ from "../FAQs/FAQ";
import { useLocalContext } from "../Context/context";
import People from "../People/People";
import Assignment  from "../Assignments/Assignment";
import Asstabforstudnets from "../Assignments/StudentsAssignment";
function Class({ classData }) {
  const classes = useStyles();
  const { loggedUserMail, db,deleteDialog } = useLocalContext();
  const [value, setValue] = React.useState("module");
  const [modules, setModules] = React.useState([]);
  const [questions, setQuestions] = React.useState([]);
  const [rows,setRows]=useState([]);
  const [progress,setProgress]= useState([]);
  const [Assignments, setAssignments] = useState([]);
  const [studentsdata,setstudents]= useState([]);



  //getting modules
  useEffect(() => {
    if (classData) {
      console.log("classData", classData);
      let unsubscribe = db
        .collection("CreatedClasses")
        .doc(
          loggedUserMail !== classData.ownerMail
            ? classData.ownerMail
            : loggedUserMail
        )
        .collection("ClassC")
        .doc(classData.code)
        .collection("Modules")
        .onSnapshot((snap) => {
          setModules(snap.docs.map((doc) => doc.data()));
        });
      return () => unsubscribe();
    }
  }, [classData,loggedUserMail]);



  //getting all FAQs
  useEffect(() => {
    if (classData) {
      console.log("classData", classData);
      let unsubscribe = db
        .collection("FAQs")
        .doc(classData.code)
        .collection("allFAQs")
        .onSnapshot((snap) => {
          setQuestions(snap.docs.map((doc) => doc.data()));
        });
      return () => unsubscribe();
    }
  }, [classData,loggedUserMail]);

  //getting people data
  /* useEffect(() => {
    try {
      let unsubscribe = db
        .collection("CreatedClasses")
        .doc(classData.ownerMail)
        .collection("ClassC")
        .doc(classData.code)
        .collection("Status").orderBy('Enrolled_Status','desc').onSnapshot((snap) => {
          setRows(snap.docs.map((doc) => doc.data()));
        });
      
    }catch (e) {
      console.log(e);
  }
  }, [classData]); */

  //getting progress details
  useEffect(async() => {
    if(classData.ownerMail!==loggedUserMail){
      try {
        let prog =await db
          .collection("CreatedClasses")
          .doc(classData.ownerMail)
          .collection("ClassC")
          .doc(classData.code)
          .collection("Status")
          .doc(loggedUserMail)
          .get();

          setProgress(prog.data().Progress)
      }catch (e) {
        console.log(e);
    }
    }
    
  }, [classData]);

  //get assignments
  useEffect(async() => {
    if(classData){
      try {
        let unsubscribe = await db
            .collection("CreatedClasses")
            .doc(classData.ownerMail)
            .collection("ClassC")
            .doc(classData.code)
            .collection("Assignment")
            .onSnapshot((snap) => {
              setAssignments(snap.docs.map((doc) => doc.data()))            
            });

          
      }catch (e) {
        console.log(e);
    }
    }
    
  }, [classData]);

  
  //getting people data for assignment
  useEffect(() => {
    if(classData){
    try {
      let unsubscribe = db
        .collection("CreatedClasses")
        .doc(classData.ownerMail)
        .collection("ClassC")
        .doc(classData.code)
        .collection("Status")
        .where("Enrolled_Status", "==", true)
        .onSnapshot((snap) => {
          setstudents(snap.docs.map((doc) => doc.data()));
        });
      
    }catch (e) {
      console.log(e);
    }
  }
  }, [classData]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Tabs value={value} onChange={handleChange} centered>
          <Tab value="module" label="Modules" />
          <Tab value="announce" label="Announcements" />
          <Tab value="classwork" label="task" />
          <Tab value="FAQs" label="FAQs" />
          <Tab value="people" label="People" />
        </Tabs>
        

      </Box>
      <Container>

        {value === "module" ? (
          <Module modules={modules} classData={classData} progress={progress} />
        ) : value === "announce" ? (
          <Announcement classData={classData} />
        ) : value === "classwork" && loggedUserMail === classData.ownerMail ? (
          <Assignment classData={classData} modules={modules} Assignments={Assignments} studentsdata={studentsdata}/>
        ) :value === "classwork" && loggedUserMail !== classData.ownerMail ? (
          <Asstabforstudnets classData={classData} Assignments={Assignments}/>
        ) :value === "FAQs" ? (
          <FAQ questions={questions} classData={classData} />
        ) : value === "people" ? (
          <People classData={classData} Assignments={Assignments}/>
        ) : null}
      </Container>
    </>
  );
}
export default Class;
