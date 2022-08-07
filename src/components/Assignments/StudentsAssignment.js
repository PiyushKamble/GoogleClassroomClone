import React, { useEffect, useState } from "react";
import { useLocalContext } from "../Context/context";
import { Avatar, Box } from "@material-ui/core";
import DeleteIcon from '@mui/icons-material/Delete';
import firebase from "@firebase/app-compat";
import useStyles from "../../assets/styles/globalStyles/styles.js";
import FileUploadIcon from '@mui/icons-material/FileUpload';




const Asstabforstudnets = ({ classData,Assignments }) => {
    const { storage,loggedUserMail,db ,loggedUser} = useLocalContext();
    const [StudentsAss, setStudentsAss] = useState([]);
    const [files, setFiles] = useState([]);


    useEffect(() => {
      getallassignments()
    }, []);


    const getallassignments = async ()=> {
      let temp_students_assign=[]

      var bar = new Promise((resolve, reject) => {
        Assignments.forEach(async(doc,index)=>{
          try {
            let assignment = await db
              .collection("CreatedClasses")
              .doc(classData.ownerMail)
              .collection("ClassC")
              .doc(classData.code)
              .collection("Assignment")
              .doc(doc.id)
              .collection("Submissions")
              .doc(loggedUserMail)
              .get()

              console.log("aat alo")
              if(assignment.exists){
                console.log("ajun aat alo")
                if(assignment.data().Status == false && assignment.data().onTime == true){
                  let today = new Date();
                  let todaydate = String(today.getDate()).padStart(2, '0');
                  let todaymonth =  String(today.getMonth() + 1).padStart(2, '0');
                  let duedate = assignment.data().DeadLine;
                  let day = duedate.split("/");
                  if(parseInt(todaydate)>parseInt(day[0]) || parseInt(todaymonth)>parseInt(day[1])){
                    assignment.set(
                      {
                        onTime: false,
                      },
                      { merge: true }
                    );
                  }
                }
                temp_students_assign.push(assignment.data())
              }
      
              
          }catch (e) {
            console.log(e);
        }
        if (index === Assignments.length-1){
          resolve()
        }
      });
    });
    
    bar.then(() => {
        setStudentsAss(temp_students_assign)
    });
    }
    
    const handleChange = (e) => {
    
      setFiles(Object.keys(e.target.files).map(key=>(e.target.files[key])));
    };
    console.log(StudentsAss)


    const handleUpload = async (e,id) => {
    
      let dbRef = db
        .collection("CreatedClasses")
        .doc(classData.ownerMail)
        .collection("ClassC")
        .doc(classData.code)
        .collection("Assignment")
        .doc(id)
        .collection("Submissions")
        .doc(loggedUserMail);
  
      if (files.length > 0) {
        files.forEach(async (file,idx) => {
          console.log(file.name,idx);
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
                if (fileType === "pdf") {
                  await dbRef.set(
                    {
                      Status: true,
                      UploadedURL: firebase.firestore.FieldValue.arrayUnion(obj),
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
        
  
      } else {
        alert("input value needed")
      }

      getallassignments()
  
    };
    const classes = useStyles();

    return (
        <>
      {StudentsAss.map((item, index) => (
        <Box
          key={index}
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

          <div key={index} className="amt">
            <div className="amt__Cnt">
              <h2 className="amt__txt">{item.Title}</h2> 
              <h5 className="amt__txt">{item.Modname}</h5>
              <p className="amt__txt">{item.text}</p>
              {
                item.imgURL?.map((obj, idx) => (
                  <embed key={idx} src={obj.URL} style={{ width: "100%" }} >

                  </embed>


                ))
              }
              {
                item.docURL?.map((obj, idx) => (
                  <embed key={idx} src={obj.URL} style={{ width: "40%" }}>

                  </embed>


                ))
              }
              {
                item.pdfURL?.map((obj, idx) => (
                  <embed key={idx} src={obj.URL} width="50" height="50">

                  </embed>


                ))
              }


            </div>
            <div style={{ padding: "2%" }}>
          <label>
            <FileUploadIcon />
            <input
              onChange={(e) => handleChange(e)}
              multiple
              type="file"
              accept=".pdf"
              style={{ display: "none" }}
            />
          </label>

          <div style={{ float: "right" }}>
            {item.Status==false ?
            <button
              onClick={(e) => {
                handleUpload(e,item.id);
              }}
              className={classes.postBtn}
            >
              {" "}
              Submit
            </button>
            :
            <button
              onClick={(e) => {
                handleUpload(e,item.id);
              }}
              className={classes.postBtn}
            >
              {" "}
              Resubmit
            </button>}
          </div>
        </div>
          </div>
        </Box>
      ))}
    </>
    )
}

export default Asstabforstudnets
