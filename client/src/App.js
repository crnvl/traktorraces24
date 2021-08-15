import Home from './sites/home';
import Account from './sites/account.js'
import Settings from './sites/settings';
import Login from './sites/login';
import Register from './sites/register';
import Races from './sites/races';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'

function App() {
    return (
        <Router>
        <Switch>
          <Route exact path='/' component={Home}/>
          <Route exact path='/user/:user' component={Account}/>
          <Route exact path='/account/settings' component={Settings}/>
          <Route exact path='/login' component={Login}/>
          <Route exact path='/register' component={Register}/>
          <Route exact path='/races' component={Races}/>
        </Switch>
      </Router>
    )
}

export default App;