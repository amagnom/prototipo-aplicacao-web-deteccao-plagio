import React, {Component} from "react";
import history from "./history_locale";
import ResultPage from "./components/ResultPage";
import HomePage from "./components/HomePage";
import Graph from "./components/resultpage/Graph";
import ExamplePage from "./components/ExamplePage";

import {
    Router,
    Switch,
    Route,
} from "react-router-dom";

export default class Links extends Component {
    render() {
        return (
            <Router history={history}>
                <Switch>
                    <Route exact path="/" component={HomePage}/>
                    <Route path="/result" component={ResultPage}/>
                    <Route path="/graph" component={Graph}/>
                    <Route path="/examples" component={ExamplePage}/>
                </Switch>
            </Router>
        );
    }
}
