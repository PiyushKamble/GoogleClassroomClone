import { useState } from "react";
import { useHistory } from "react-router";
import { Box, Button } from "@mui/material";
import useStyles from "../../assets/styles/globalStyles/styles";
import GoogleIcon from "@mui/icons-material/Google";
import { useLocalContext } from "../Context/context";
//importing firebase functions
import { auth, db } from "../../firebase/config";

function Login(props) {
  const classes = useStyles();
  const history = useHistory();

  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const { login, loggedUser } = useLocalContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(email, password);

    //creating a new user
    try {
      const newUser = await auth.signInWithEmailAndPassword(email, password);
      alert("signIn successful");
      history.push("/allClasses");
    } catch (e) {
      alert(e);
      history.push("/signUp");
    }
  };

  return (
    <div>
      <img
        style={{
          display: "flex",
          margin: "auto",
          marginTop: "10%",
          width: "10%",
        }}
        src="https://www.pngrepo.com/png/237114/512/dummy-crash.png"
        alt="logo"
      />

      <Box
        sx={{
          width: "15%",
          padding: "1%",
          borderRadius: 10,
          m: "auto",
          mt: 1,
        }}
        boxShadow={6}
      >
        <Button
          type="submit"
          variant="contained"
          color="primary"
          style={{ width: "100%" }}
          onClick={() => {
            login();
            history.push("/");
          }}
        >
          Login With Google <GoogleIcon />
        </Button>
      </Box>
    </div>
  );
}

export default Login;
