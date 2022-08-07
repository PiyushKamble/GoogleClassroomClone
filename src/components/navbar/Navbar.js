import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import ProfileMenu from "./ProfileMenu";
import { useHistory } from "react-router";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useLocalContext } from "../Context/context";
import CreateClass from "../Home/CreateClass";
import JoinClass from "../Home/JoinClass";

function NavbarHome() {
  //using dialogStates from context
  const { setCreateClassDialog, setJoinClassDialog } = useLocalContext();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  //globalstates
  const { loggedUser } = useLocalContext();

  const handleClose = () => {
    setAnchorEl(null);
  };
  const history = useHistory();
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link to="/">
              <img
                style={{ width: "50px" }}
                src="https://www.pngrepo.com/png/237114/512/dummy-crash.png"
                alt="logo"
              />
            </Link>
          </Typography>
          {loggedUser ? (
            <>
              <AddCircleOutlineOutlinedIcon
                id="demo-positioned-button"
                aria-controls="demo-positioned-menu"
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
                style={{cursor:"pointer"}}
                fontSize="large"

              />

              <Menu
                id="demo-positioned-menu"
                aria-labelledby="demo-positioned-button"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
              >
                <MenuItem
                  onClick={() => {
                    setCreateClassDialog(true);
                    handleClose();
                  }}
                >
                  Add Class
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setJoinClassDialog(true);
                    handleClose();
                  }}
                >
                  Join Class
                </MenuItem>
              </Menu>

              <ProfileMenu />
              <CreateClass />
              <JoinClass />
            </>
          ) : (
            <>
              <Button color="inherit" onClick={() => history.push("/login")}>
                {" "}
                Login
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default NavbarHome;
