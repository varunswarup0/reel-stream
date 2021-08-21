import {BrowserRouter as Router, Route, Switch, Redirect} from "react-router-dom";
import {useContext} from "react";
import Login from "./Components/Login/Login";
import Signup from "./Components/Signup/Signup";
import Profile from "./Components/Profile/Profile";
import Feeds from "./Components/Feeds/Feeds";
import {AuthContext, AuthProvider} from "./Context/Authprovider";
import './App.css';

function App()
{
  return (
    <div className="App">
      <AuthProvider>
        <Router>
          <Switch>
            <Route path="/login" component={Login} exact></Route>
            <Route path="/signup" component={Signup} exact></Route>
            <PrivateRoute path="/" comp={Feeds} exact></PrivateRoute>
            <PrivateRoute path="/profile" comp={Profile} exact></PrivateRoute>
          </Switch>
        </Router>
      </AuthProvider>
    </div>
  );
}

// private component to render feed and profile
const PrivateRoute = ({path, comp: component}) =>
{
  let {currentUser: isLoggedIn} = useContext(AuthContext);
  if (isLoggedIn)
  {
    return (<Route path={path} component={component}></Route>);
  }
  else
  {
    return (<Redirect to="/login"></Redirect>);
  }
}
export default App;
