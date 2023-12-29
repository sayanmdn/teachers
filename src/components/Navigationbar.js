import React, { useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { delAuth, initAuth } from "../redux/actions";
import axios from "axios";
import { URL } from "../config";
import { Navbar, Nav, NavItem, Image } from "react-bootstrap";
import logo from "../assets/logo.png";

// Functional component for the navigation bar
export function Navigationbar(props) {
  // Access the browser history
  let history = useHistory();

  // Access the Redux dispatch function
  const dispatch = useDispatch();

  // useEffect hook to perform actions after the component is mounted
  useEffect(() => {
    // Retrieve the authentication token from local storage
    const authToken = localStorage.getItem("token");

    // Send a request to check the validity of the token
    axios
      .post(
        `${URL}post/isAuthenticated`,
        { token: "not needed here" },
        { headers: { Authorization: authToken }, retry: 3 }
      )
      .then((res) => {
        // If the token is valid, dispatch the user's authentication information
        if (res.data.code === "tokenValid") {
          dispatch(initAuth(res.data.message));
        }
      })
      .catch((err) => {
        console.log("Error from isValidAuthToken " + err);
      });
  }, [dispatch]); // Dependency array to run the effect only once after mounting

  // Select the authentication state from the Redux store
  const auth = useSelector((state) => state.auth);

  // Function to handle user logout
  const handleLogout = () => {
    // Clear the authentication token from local storage
    localStorage.setItem("token", null);
    // Dispatch an action to delete the user's authentication information
    dispatch(delAuth());
    // Redirect the user to the login page
    history.push("/login");
  };

  // Render the navigation bar component
  return (
    <Navbar
      variant="dark"
      expand="lg"
      style={{ background: "#112233", color: "white" }}
    >
      <Navbar.Brand className="navbar-header">
        {/* Link to the home page */}
        <Link
          to="/"
          style={{ color: "#bbb", marginLeft: "100px" }}
          component={Nav.Link}
        >
          <div>
            <Image src={logo} style={{ width: "50px", height: "50px" }} />
            <snap>Tutor Trackers</snap>
          </div>
        </Link>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-nav-bar" style={{ marginRight: "100px" }}>
        <Nav className="ml-auto">
          {/* Navigation links based on user authentication status */}
          <NavItem>
            <Nav.Link to="/" as={Link}>
              Home
            </Nav.Link>
          </NavItem>
          {!auth.isLoggedIn && (
            <NavItem>
              <Nav.Link to="/register" as={Link}>
                Teacher's Registration
              </Nav.Link>
            </NavItem>
          )}
          {/* {!auth.isLoggedIn && (
            <NavItem>
              <Nav.Link to="/login" as={Link}>
                Teacher's Login
              </Nav.Link>
            </NavItem>
          )} */}
          {!auth.isLoggedIn && (
            <NavItem>
              <Nav.Link to="/student-access" as={Link}>
                Student Access
              </Nav.Link>
            </NavItem>
          )}
          {auth.isLoggedIn && (
            <NavItem>
              {/* Logout link with a click event handler */}
              <Nav.Link onClick={() => handleLogout()} as={Link}>
                Logout
              </Nav.Link>
            </NavItem>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
