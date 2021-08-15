import 'bootstrap/dist/css/bootstrap.min.css'
import React from 'react';
import { Route, HashRouter as Router, Switch } from 'react-router-dom'
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Account from './sites/account.js'
import Settings from './sites/settings';
import Login from './sites/login';
import reportWebVitals from './reportWebVitals';
import Register from './sites/register';
import Races from './sites/races';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Switch>
        <Route path='/' component={App}/>
        <Route path='/user/:user' component={Account}/>
        <Route path='/account/settings' component={Settings}/>
        <Route path='/login' component={Login}/>
        <Route path='/register' component={Register}/>
        <Route path='/races' component={Races}/>
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
