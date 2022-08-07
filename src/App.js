//styles import
import { useState, useEffect } from "react";

import theme from "./assets/styles/globalStyles/theme";
import { ThemeProvider } from "@mui/material/styles";
import Layout from "./components/Layout/Layout";
//import routes
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { CssBaseline } from "@material-ui/core";


//components import
import Navbar from "./components/navbar/Navbar";
import Login from "./components/userDetails/Login";
import AllClasses from "./components/Home/AllClasses";
import Class from "./components/teacher/Class";
import { useLocalContext } from "./components/Context/context";
import Footer from "./components/Footer/Footer";


function App() {
  const [createdClasses, setCreatedClasses] = useState([]);
  const [joinedClasses, setJoinedClasses] = useState([]);
  const [modules,setModules]=useState([]);

  const { db, auth, loggedUser, loggedUserMail,classes } = useLocalContext();

  //getting all user created classes
  useEffect(() => {
    if (loggedUser) {
      let unsubscribe = db
        .collection("CreatedClasses")
        .doc(loggedUserMail)
        .collection("ClassC")
        .onSnapshot((snapshot) => {
          setCreatedClasses(snapshot.docs.map((doc) => doc.data()));
        });

        

      return () => unsubscribe();
    }
  }, [loggedUserMail]);

  //getting all user joined classes
  useEffect(() => {
    if (loggedUser) {
      let unsubscribe = db
        .collection("joinedClasses")
        .doc(loggedUserMail)
        .collection("classesJ")
        .onSnapshot((snapshot) => {
          setJoinedClasses(snapshot.docs.map((doc) => doc.data()));
        });

      return () => unsubscribe();
    }
  }, [loggedUserMail]);

  // console.log(createdClasses, joinedClasses);

  return (
    <ThemeProvider theme={theme}>
      
       
      <Router>
      
        <Navbar />
        <div className={classes.root}>
        <Layout >
        <CssBaseline/>
          
         
          <Switch>
            {createdClasses.map((classData, index) => (
              <Route key={index} path={`/${classData.code}`} exact>
                <Class classData={classData} />
              </Route>
            ))}

            {joinedClasses.map((classData, index) => (
              <Route key={index} path={`/${classData.code}`} exact>
                <Class classData={classData} />
              </Route>
            ))}

            <Route path="/" exact>
            {loggedUser?
              <AllClasses  createdClasses={createdClasses} joinedClasses={joinedClasses}/>
              :<Login/>}

            </Route>
            <Route path="/login" exact>
              <Login />
            </Route>
          </Switch>
         
        </Layout>
        </div>
      </Router>
      
      {/* <Footer/> */}
    </ThemeProvider>
  );
}

export default App;
