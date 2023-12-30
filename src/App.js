import "./App.css";
import { useEffect } from "react";
import { Navigationbar } from "./components/Navigationbar";
import { Area1 } from "./components/Area1";
import { Register } from "./components/Register";
import { Profile } from "./components/Profile";
import { StudentAccess } from "./components/StudentAccess";
import { Contact } from "./components/Contact";
import reactGa from "react-ga";
// import { Login } from "./components/Login";
// import { Warehouse } from "./components/Warehouse";
// import { NewsComponent } from "./components/NewsContainer";
// import { WriteComponent } from "./components/WriteComponent";

import { Provider } from "react-redux";

import store from "./redux/store";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  useEffect(() => {
    reactGa.initialize("UA-92548969-2");
    reactGa.pageview("/");
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Navigationbar />
        <Switch>
          <div className="main-class">
            <Route exact path="/">
              <Area1 />
            </Route>
            <Route exact path="/register">
              <Register />
            </Route>
            {/* <Route exact path="/login">
              <Login />
            </Route>
            <Route exact path="/warehouse">
              <Warehouse />
            </Route>
            <Route exact path="/news">
              <NewsComponent />
            </Route>
            <Route exact path="/write">
              <WriteComponent />
            </Route> */}
            <Route exact path="/student-access">
              <StudentAccess />
            </Route>
            <Route exact path="/contact-us">
              <Contact />
            </Route>
            <Route path="/teachers/:id" component={Profile} />
          </div>
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;
