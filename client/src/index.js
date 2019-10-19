import React from 'react';
import ReactDOM from 'react-dom';
import {Switch, Route, HashRouter} from 'react-router-dom';
import CacheRoute, { CacheSwitch } from 'react-router-cache-route'
import {Provider} from 'react-redux';


import './index.css';
import Chatroom from './containers/chatroom/chatroom';
import Login from './containers/login/login';
import Register from './containers/register/register';
import Main from './containers/main/main';
import Header from './components/header/header';
import Personal from './containers/psersonal/personal';
import Nav from './containers/nav/nav';
import Edit from './containers/edit/edit';
import User from './containers/user/user';
import Users from './containers/users/users';
import Users2 from './containers/users2/users2';
import Cards from './containers/cards/cards';
import Card from './containers/card/card';
import store from './redux/store';


ReactDOM.render(
  (
  <Provider store = {store}>
    <HashRouter>
        <Switch>
            <Route component={ Chatroom } path="/chatroom" />
            <Route component={ Login } path="/login" />
            <Route component={ Register } path="/register" />
            <Route component={ Personal } path="/personal" />
            <Route component={ Edit } path="/edit" />
            <Route component={ User } path="/user/:id" />
            <Route component={Users} path="/users/:id" />
            <Route component={Users2} path="/users2/:id" />
            <Route component={Cards} path="/cards/:id" />
            <Route component={Card} path="/card/:id" />
            <Route component={ Main } path="/" />
        </Switch>
            {/* <CacheSwitch>
              <Route component={ Chatroom } path="/chatroom" />
              <Route component={ Login } path="/login" />
              <Route component={ Register } path="/register" />
              <Route component={ Personal } path="/personal" />
              <Route component={ Edit } path="/edit" />
              <Route component={ User } path="/user/:id" />
              <Route component={Users} path="/users/:id" />
              <Route component={Users2} path="/users2/:id" />
              <Route component={Cards} path="/cards/:id" />
              <Route component={Card} path="/card/:id" />
              <CacheRoute className='mainRoute' component={ Main } path="/" />
            </CacheSwitch> */}
      <Header/>
        <Nav/>   
    </HashRouter>
  </Provider>
  )
  , document.getElementById('root'));
