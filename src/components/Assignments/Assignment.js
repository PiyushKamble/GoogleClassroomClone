import React, { useState } from "react";
import { TextField, Box, Container, Button } from "@material-ui/core";
import { width } from "@mui/system";
import useStyles from "../../assets/styles/globalStyles/styles.js";
import { useLocalContext } from "../Context/context";
import firebase from "@firebase/app-compat";
import { v4 as uuidv4 } from "uuid";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import AllAssignment from "./AllAssignment.js";
import AllAnnouncements from "../Announcement/AllAnnouncements";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';

function Assignment({ classData, modules, Assignments, studentsdata }) {
    const { storage, db, loggedUserMail, loggedUser } = useLocalContext();

    const [inputValue, setInputValue] = useState("");
    const [module, setModule] = React.useState("");
    const [inputTitle, setInputTitle] = useState("");
    const [files, setFiles] = useState([]);
    const [maxdays, setmaxdays] = useState(0);
    const [error, setError] = useState(false);
    const [errortxt, setErrortxt] = useState("");
    const [errorformaxdays, setErrorformaxdays] = useState(false);
    const [errortxtformaxdays, setErrortxtformaxdays] = useState("");
    const handleChange = (e) => {

        setFiles(Object.keys(e.target.files).map(key => (e.target.files[key])));
    };

    const handleChangeModule = (event) => {
        setModule(event.target.value);
    };

    const addtostudent = async (modnum, id) => {
        let modData = await db
            .collection("CreatedClasses")
            .doc(classData.ownerMail)
            .collection("ClassC")
            .doc(classData.code)
            .collection("Assignment")
            .doc(id)
            .get();

        studentsdata.forEach(async (doc) => {
            let progarray = doc.Progress
            if (progarray[modnum - 1] === 1) {
                var deadby = new Date();
                var dd = String(deadby.getDate() + parseInt(maxdays)).padStart(2, '0');
                var mm = String(deadby.getMonth() + 1).padStart(2, '0'); //January is 0!
                var yyyy = deadby.getFullYear();

                deadby = dd + '/' + mm + '/' + yyyy;

                let studentref = db.collection("CreatedClasses")
                    .doc(classData.ownerMail)
                    .collection("ClassC")
                    .doc(classData.code)
                    .collection("Assignment")
                    .doc(id)
                    .collection("Submissions")
                    .doc(doc.email_id);


                await studentref.set(
                    {
                        email_id: doc.email_id,
                        name: doc.name,
                        Marks: -1,
                        Status: false,
                        DeadLine: deadby,
                        onTime: true,
                        id: modData.data().id,
                        Title: modData.data().Title,
                        Modname: modData.data().Modname,
                        text: modData.data().text,
                        pdfURL: modData.data().pdfURL,
                        imgURL: modData.data().imgURL,
                        docURL: modData.data().docURL
                    },
                    { merge: true }
                );
            }
        });

    }
    const handleUpload = async (e) => {

        if (inputTitle===""){
            setError(true);
            setErrortxt("Title is required");
            return;
        } else if (maxdays===0){
            setErrorformaxdays(true);
            setErrortxtformaxdays("No Of days required");
            return;
        } else {
            let id = `${module}-${inputTitle}`;
            let assign = await db
                .collection("CreatedClasses")
                .doc(classData.ownerMail)
                .collection("ClassC")
                .doc(classData.code)
                .collection("Assignment")
                .doc(id)
                .get();
            
            if (assign.exists){
                setError(true);
                setErrortxt("Assignment with same title exists");
                return;
            } else {
                let dbRef = await db
                .collection("CreatedClasses")
                .doc(classData.ownerMail)
                .collection("ClassC")
                .doc(classData.code)
                .collection("Assignment")
                .doc(id);

            let new_collection = await db
                .collection("CreatedClasses")
                .doc(classData.ownerMail)
                .collection("ClassC")
                .doc(classData.code)
                .collection("Assignment")
                .doc(id)
                .collection("Submissions")

            if (files.length > 0 && inputValue) {
                files.forEach(async (file, idx) => {
                    console.log(file.name, idx);
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
                            console.log("filetyoe is ", fileType);
                            try {
                                if (fileType === "pdf") {
                                    await dbRef.set(
                                        {
                                            id: id,
                                            timestamp: firebase.firestore.Timestamp.now(),
                                            text: inputValue,
                                            pdfURL: firebase.firestore.FieldValue.arrayUnion(obj),
                                            docURL: [],
                                            imgURL: [],
                                        },
                                        { merge: true }
                                    );
                                } else if (imgTypes.includes(fileType)) {
                                    await dbRef.set(
                                        {
                                            id: id,
                                            timestamp: firebase.firestore.Timestamp.now(),
                                            text: inputValue,
                                            imgURL: firebase.firestore.FieldValue.arrayUnion(obj),
                                            pdfURL: [],
                                            docURL: [],
                                        },
                                        { merge: true }
                                    );
                                } else if (docTypes.includes(fileType)) {
                                    await dbRef.set(
                                        {
                                            id: id,
                                            timestamp: firebase.firestore.Timestamp.now(),
                                            text: inputValue,
                                            docURL: firebase.firestore.FieldValue.arrayUnion(obj),
                                            pdfURL: [],
                                            imgURL: [],
                                        },
                                        { merge: true }
                                    );
                                }

                                if (inputTitle) {
                                    await dbRef.set(
                                        {
                                            Title: inputTitle,
                                            Modname: module
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
                    if (inputTitle) {
                        await dbRef.set(
                            {
                                Title: inputTitle,
                                Modname: module
                            },
                            { merge: true }
                        );
                    }

                    await dbRef.set(
                        {
                            id: id,
                            timestamp: firebase.firestore.Timestamp.now(),
                            text: inputValue,
                            pdfURL: [],
                            docURL: [],
                            imgURL: [],
                        },
                        { merge: true }
                    );
                } catch (e) {

                }
            } else {
                alert("input value needed")
            }
            let lastChar = module.substr(module.length - 1)
            addtostudent(parseInt(lastChar), id)}
}
    };
    const classes = useStyles();

    return (
        <Container>
            {(<Box
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
                <div style={{marginBottom:"1%"}}> 
                <TextField
                    sx={{

                        width: { sm: 250, md: 350 },
                    
                        "& .MuiOutlinedInput-root:hover": {
                          "& > fieldset": {
                            borderColor: "orange"
                          }
                        }
                      }}
                    
                    variant="outlined"
                    fullWidth
                    label="Title"
                    error={error}
                    helperText={error && errortxt}
                    required={true}
                    onChange={(e) => {
                        setInputTitle(e.target.value);
                        setError(false);
                    }}
                />
                </div>

                <div style={{marginBottom:"1%"}}> 
                <TextField
                    variant="outlined"
                    id="filled-multiline-static"
                    label="Description"
                    multiline
                    rows={2}
                    fullWidth
                    
                    onChange={(e) => {
                        setInputValue(e.target.value);
                    }}
                />
                </div>

                <div style={{marginBottom:"1%"}} >
                <TextField
                    id="outlined-number"
                    
                    label="Max No. Of Days"
                    type="number"
                    variant="outlined"
                    inputProps={{ min: 0 }}
                    error={errorformaxdays}
                    helperText={errorformaxdays && errortxtformaxdays}
                    required={true}
                    

                    InputLabelProps={{
                        shrink: true,
                    }}

                    onChange={(e) => {
                        setmaxdays(parseInt(e.target.value));
                        setErrorformaxdays(false);;
                    }}
                />
                </div>


                <div style={{ padding: "2%" }}>
                    <label>
                        <FileUploadIcon />
                        <input
                            onChange={(e) => handleChange(e)}
                            multiple
                            type="file"
                            accept=".png,.jpg,.jpeg,.pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            style={{ display: "none" }}
                        />
                    </label>

                    <div style={{ float: "right" }}>
                        <Fab
                            onClick={(e) => {
                                handleUpload(e);
                            }} size="small" color="secondary" aria-label="add"
                        >
                            <AddIcon />

                        </Fab>
                    </div>
                    <FormControl
                        style={{ width: "20%", float: "right", margin: "0 2% 2% 2%" }}
                    >
                        <InputLabel id="demo-simple-select-label">ADD TO</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={module}
                            label="Module"
                            onChange={(e) => handleChangeModule(e)}
                        >
                            {modules.map((data, index) => (
                                <MenuItem key={index} value={data.modName}>
                                    {data.modName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>

            </Box>)
            }
            <AllAssignment classData={classData} modules={modules} Assignments={Assignments} studentsdata={studentsdata} />

        </Container >
    );
}

export default Assignment;
