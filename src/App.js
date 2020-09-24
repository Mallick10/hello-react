import React, { Component } from 'react';
import './App.css';
import firebase from "firebase"
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth"

firebase.initializeApp({
  apiKey: "AIzaSyCUe4vDDkFUajHBXjYqXIfrbf5Pf-I0pVI",
  authDomain: "bobbleai-5ddce.firebaseapp.com"
})

const emailRegex = RegExp(
  /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
);

const formValid = ({ formErrors, ...rest }) => {
  let valid = true;

  // validate form errors being empty
  Object.values(formErrors).forEach(val => {
    val.length > 0 && (valid = false);
  });
  // validate the form was filled out
  Object.values(rest).forEach(val => {
    val === null && (valid = false);
  });

  return valid;
};

class App extends Component {

  state = { isSignedIn: false }
  uiConfig = {
    signInFlow: "popup",
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    ],
    callbacks: {
      signInSuccess: () => false
    }
  }

  componentDidMount = () => {
    firebase.auth().onAuthStateChanged(user => {
      this.setState({ isSignedIn: !!user })
      console.log("user", user)
    })
  }


  
  constructor(props){
    super(props);

    this.state = {
      firstName: null,
      lastName: null,
      email: null,
      password: null,
      formErrors: {
        firstName: "",
        lastName: "",
        email: "",
        password: ""
      }
    }
  }

  handleSubmit = e => {
    e.preventDefault();

    if (formValid(this.state)) {
      console.log(`
        --SUBMITTING--
        First Name: ${this.state.firstName}
        Last Name: ${this.state.lastName}
        Email: ${this.state.email}
        Password: ${this.state.password}
      `);
    } else {
      console.error("FORM INVALID - DISPLAY ERROR MESSAGE");
    }
  };

  handleChange = e => {
    e.preventDefault();
    const { name, value } = e.target;
    let formErrors = { ...this.state.formErrors };

    switch (name) {
      case "firstName":
        formErrors.firstName =
          value.length < 3 ? "minimum 3 characaters required" : "";
        break;
      case "lastName":
        formErrors.lastName =
          value.length < 3 ? "minimum 3 characaters required" : "";
        break;
      case "email":
        formErrors.email = emailRegex.test(value)
          ? ""
          : "invalid email address";
        break;
      case "password":
        formErrors.password =
          value.length < 6 ? "minimum 6 characaters required" : "";
        break;
      default:
        break;
    }

    this.setState({ formErrors, [name]: value }, () => console.log(this.state));
  };
  

  render(){
    const { formErrors } = this.state;

    return (
      //Facebook and Google Authentication Part//
      <div className="wrapper">
        <div className="form-wrapper">

          {this.state.isSignedIn ? (
            <span>
              
              
              <div className="profile-pic2">
              <img className="profile-pic"
                alt="profile picture"
                src={firebase.auth().currentUser.photoURL}
              />
              </div>
              <h1 className="name">Welcome {firebase.auth().currentUser.displayName}</h1>
              <div className="SignIn">Signed In!</div>
              <button className="SignOut" onClick={() => firebase.auth().signOut()}>Sign out!</button>

            </span>
          ) : (
            <StyledFirebaseAuth
              uiConfig={this.uiConfig}
              firebaseAuth={firebase.auth()}
            />
          )}


           
          <h1>Create your account</h1>
          <form onSubmit={this.handleSubmit} noValidate>
  
            <div className="firstName">
              <label htmlFor="firstName">First Name</label>
              <input type="text" className={formErrors.firstName.length > 0 ? "error" : null} placeholder="First Name" name="firstName" noValidate onChange={this.handleChange}/>
              {formErrors.firstName.length > 0 && (
                <span className="errorMessage">{formErrors.firstName}</span>
              )}
            </div>
            
  
            <div className="lastName">
              <label htmlFor="lastName">Last Name</label>
              <input type="text" className={formErrors.lastName.length > 0 ? "error" : null} placeholder="Last Name" name="lastName" noValidate onChange={this.handleChange}/>
              {formErrors.lastName.length > 0 && (
                <span className="errorMessage">{formErrors.lastName}</span>
              )}

            </div>
  
            <div className="email">
              <label htmlFor="email">E-mail</label>
              <input type="email" className={formErrors.email.length > 0 ? "error" : null} placeholder="e-mail id" name="email" noValidate onChange={this.handleChange}/>
              {formErrors.email.length > 0 && (
                <span className="errorMessage">{formErrors.email}</span>
              )}
            </div>
  
            <div className="password">
              <label htmlFor="password">Password</label>
              <input type="password" className={formErrors.password.length > 0 ? "error" : null} placeholder="password" name="password" noValidate onChange={this.handleChange}/>
              {formErrors.password.length > 0 && (
                <span className="errorMessage">{formErrors.password}</span>
              )}
            </div>
  
            <div className="createAccount">
            <small>By clicking Sign Up, you agree to our <a>Terms of use</a> and our <a>Privacy Policy</a> </small>
              <button type="submit">Sign Up</button>
              
            </div>
            
          </form>
  
        </div>
         
      </div>
    );
  }

}

export default App;
