import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

// Routes
import Setting from "./setting";
import Password from "./password";

function App() {
  return (
    <>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Setting}>
            <Setting />ges
          </Route>
          <Route exact path="/password" component={Password}>
            <Password />
          </Route>
        </Switch>
      </BrowserRouter>
    </>
  );
}

export default App;
