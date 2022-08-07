import { createContext,useContext,useState,useEffect } from "react";
import db,{storage,auth,provider} from "../../firebase/config";
import useStyles from  "../../assets/styles/globalStyles/styles"

const AddContext=createContext();

export const useLocalContext=()=>{
    return useContext(AddContext);
}

export const ContextProvider=({children})=>{
    const [createClassDialog,setCreateClassDialog]=useState(false);
    const [joinClassDialog,setJoinClassDialog]=useState(false);
    const [loggedUser,setLoggedUser]=useState(null);
    const [loggedUserMail,setLoggedUserMail]=useState(null);
    const [openImg, setOpenImg]=useState(false);
    const [deleteDialog,setDeleteDialog]=useState(false);
    const [openAddModModal,setOpenAddModModal]=useState(false);
    const [modNo,setModNo]=useState(0);
    const [openFileType,setOpenFileType]=useState(false);
    const [url,setUrl]=useState("");
    const [showStudentStatus,setShowStudentStatus]=useState(false)
    const [delDialog,setDelDialog]=useState({status:false,value:""});
    const [confDel,setConfDel]=useState(false);
    const classes=useStyles();
    



    const login=()=> auth.signInWithPopup(provider);
    const logOut=()=> auth.signOut();


    //useeffect
    useEffect(()=>{

        const unsubscribe=auth.onAuthStateChanged((user)=>{
            if(user){
                setLoggedUser(user);
                setLoggedUserMail(user.email)
                console.log(user);
                
                
            }else{
                setLoggedUser(null);
                setLoggedUserMail(null)
            }


        })

        return ()=>{
            unsubscribe();
        }
    },[])

    const value = {
        createClassDialog,
        setCreateClassDialog,
        joinClassDialog,
        setJoinClassDialog,
        login,logOut,
        loggedUser,loggedUserMail,db,auth,storage,
        openImg,setOpenImg,
        deleteDialog,setDeleteDialog,
        openAddModModal,setOpenAddModModal,
        modNo,setModNo,classes,
        url,setUrl,
        openFileType,setOpenFileType,
        showStudentStatus,setShowStudentStatus,
        delDialog,setDelDialog,
        confDel,setConfDel

        
      };
    return (
        <AddContext.Provider value={value}>
        {children}
        </AddContext.Provider>
        )



}

