import React, { useState } from 'react';
import { connect } from 'react-redux';

import Aux from '../Aux/Aux';
import classes from './Layout.module.css';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';

const Layout = props => {
  const [sideDrawerStat, setSideDrawerStat] = useState(false);
  // state = {
  //   showSideDrawer: false
  // }

  const SideDrawerClosedHandler = () => {
    setSideDrawerStat(false);
    // this.setState({ showSideDrawer: false })
  };

  const sideDrawerToggleHandler = () => {
    setSideDrawerStat(!sideDrawerStat);
    // this.setState({ showSideDrawer: !this.state.showSideDrawer }) // this approach
    // may lead to unexpect outcome
    // this.setState((prevState) => {
    //   return { showSideDrawer: !prevState.showSideDrawer };
    // })
  };

  return (
    <Aux>
      <Toolbar
        isAuth={props.isAuthenticated}
        drawerToggleClicked={sideDrawerToggleHandler}
      />
      <SideDrawer
        isAuth={props.isAuthenticated}
        closed={SideDrawerClosedHandler}
        open={sideDrawerStat}
      />
      <main className={classes.Content}>
        {props.children}
      </main>
    </Aux>
  );
};

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null
  }
}

export default connect(mapStateToProps)(Layout);