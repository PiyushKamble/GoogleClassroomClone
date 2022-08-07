import { useState } from "react";
import { TextField } from "@mui/material";
import {
  FormControl,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import useStyles from "../../assets/styles/globalStyles/styles";
import { useHistory } from "react-router";

//importing firebase functions
import db,{ auth } from "../../firebase/config";

function SignUp(props) {
  const classes = useStyles();
  const history = useHistory();

  // const [fname,setFname]=useState("");
  // const [lname,setLname]=useState("");
  // const [userName,setUserName]=useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");


  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(email, password,role);

    // creating a new user
        try {
          const newUser = await auth.createUserWithEmailAndPassword(
            email,
            password
          );

          
          if(role==="Teacher"){
            await newUser.user.updateProfile({
                displayName:"teacher",
            });
    

            db.collection("teachers").doc(newUser.user.uid).set({  
                email:email,
                role:role,
            })

          }else{
            await newUser.user.updateProfile({
                displayName:"student",
            });
            db.collection("students").doc(newUser.user.uid).set({
                email:email,
                role:role,
            })

          }
          
          alert("signup successful");
          history.push("/joinOrCreate");
        } catch (e) {
          alert(e);
          history.push("/signUp");
        }
  };

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>HELLO PLEASE SIGNUP </h1>
      <form
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <FormControl noValidate autoComplete="on" className={classes.forms}>
          <TextField
            label="email"
            type="email"
            variant="outlined"
            color="primary"
            name="email"
            className={classes.inputFields}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="password"
            type="password"
            variant="outlined"
            color="primary"
            name="password"
            className={classes.inputFields}
            onChange={(e) => setPassword(e.target.value)}
            helperText={
              password && password.length < 6
                ? "Password must be at least 6 characters long"
                : ""
            }
          />

          <RadioGroup row aria-label="gender" name="row-radio-buttons-group">
            <FormControlLabel value="Teacher" control={<Radio />} onChange={(e)=>setRole(e.target.value)} label="Teacher"/>
            <FormControlLabel value="Student" control={<Radio />} onChange={(e)=>setRole(e.target.value)} label="Student" />
          </RadioGroup>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={classes.inputFields}
          >
            SignUp
          </Button>
        </FormControl>
      </form>
    </div>
  );
}

export default SignUp;
