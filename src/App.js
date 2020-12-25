import React, { useEffect } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import asyncComponent from './hoc/asyncComponent/asyncComponent';

import Layout from './hoc/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
import Logout from './containers/Auth/Logout/Logout';
import * as actions from './store/actions/index';

const AsyncCheckout = asyncComponent(() => {
  return import('./containers/Checkout/Checkout');
});
const AsyncOrders = asyncComponent(() => {
  return import('./containers/Orders/Orders');
});
const AsyncAuth = asyncComponent(() => {
  return import('./containers/Auth/Auth');
});

const App = props => {
  useEffect(() => {
    props.onAutoLogin();
    console.log('AUTO LOGIN RUNNING');
  }, [props]);

  let routes = (
    <Switch>
      <Route path="/auth" component={AsyncAuth} />
      <Route path="/" exact component={BurgerBuilder} />
      <Redirect to="/" />
    </Switch>
  );

  if (props.isAuthenticated) {
    routes =
      <Switch>
        <Route path="/checkout" component={AsyncCheckout} />
        <Route path="/orders" component={AsyncOrders} />
        <Route path="/logout" component={Logout} />
        <Route path="/auth" component={AsyncAuth} />
        <Route path="/" exact component={BurgerBuilder} />
        <Redirect to="/" />
      </Switch>
  }

  return (
    <div>
      <Layout>{routes}</Layout>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onAutoLogin: () => dispatch(actions.authCheckState())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
