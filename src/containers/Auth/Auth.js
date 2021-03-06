import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';
import classes from './Auth.module.css';
import * as actions from '../../store/actions/index';
import { updateObject, checkValidity } from '../../shared/utility';

const Auth = props => {
  const [authForm, setAuthForm] = useState({
    email: {
      elementType: 'input',
      elementConfig: {
        type: 'email',
        placeholder: 'E-mail Address'
      },
      value: '',
      validation: {
        required: true,
        isEmail: true
      },
      valid: false,
      touched: false
    },
    password: {
      elementType: 'input',
      elementConfig: {
        type: 'password',
        placeholder: 'Password'
      },
      value: '',
      validation: {
        required: true,
        minLength: 6
      },
      valid: false,
      touched: false
    }
  });
  const [disableButton, setDisableButton] = useState(true);

  const { buildingBurger, authRedirectPath, onSetAuthRedirectPath } = props;

  useEffect(() => {
    if (!buildingBurger && authRedirectPath !== '/') {
      onSetAuthRedirectPath();
    };
  }, [buildingBurger, authRedirectPath, onSetAuthRedirectPath]);

  const inputChangedHandler = (event, controlName) => {
    const updatedControls = updateObject(
      authForm,
      {
        [controlName]: updateObject(
          authForm[controlName],
          {
            value: event.target.value,
            valid: checkValidity(event.target.value,
              authForm[controlName].validation),
            touched: true
          }
        )
      }
    );
    let disable = true;
    if (updatedControls.email.touched && updatedControls.password.touched) {
      disable = false;
    };
    setAuthForm(updatedControls);
    setDisableButton(disable);
    // this.setState({ controls: updatedControls, disable: disable });
  };

  const submitHandler = (event, method) => {
    event.preventDefault();
    props.onAuth(
      authForm.email.value,
      authForm.password.value,
      method
    );
  };

  const formElementsArray = [];
  for (let key in authForm) {
    formElementsArray.push({
      id: key,
      config: authForm[key]
    });
  };

  let form = formElementsArray.map(formElement => (
    <Input
      key={formElement.id}
      elementType={formElement.config.elementType}
      elementConfig={formElement.config.elementConfig}
      value={formElement.config.value}
      invalid={!formElement.config.valid}
      shouldValidate={formElement.config.validation}
      touched={formElement.config.touched}
      changed={(event) => inputChangedHandler(event, formElement.id)} />
  ));

  if (props.loading) {
    form = <Spinner />;
  };

  let errorMessage = null;
  if (props.error) {
    errorMessage = <p>{props.error.message}</p>
  };

  let authRedirect = null;
  if (props.isAuthenticated) {
    authRedirect = <Redirect to={props.authRedirectPath} />
  };

  return (
    <div className={classes.Auth}>
      {authRedirect}
      {errorMessage}
      <form>
        {form}
        <Button btnType="Success"
          clicked={(event) => submitHandler(event, 'login')}
          disabled={disableButton}
        >LOGIN</Button>
        <Button btnType="Danger"
          clicked={(event) => submitHandler(event, 'signup')}
          disabled={disableButton}
        >SIGNUP</Button>
      </form>

    </div>
  );
};

const mapStateToProps = state => {
  return {
    error: state.auth.error,
    loading: state.auth.loading,
    isAuthenticated: state.auth.token !== null,
    buildingBurger: state.burgerBuilder.building,
    authRedirectPath: state.auth.authRedirectPath
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onAuth: (email, password, method) => dispatch(actions.auth(email, password, method)),
    onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/'))
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Auth);