import React, { Component } from 'react';
import './App.css';
import GoogleLogin from 'react-google-login'
import Facebook from './Facebook'
import axios from 'axios';


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
      const data = {
        First_Name: this.state.firstName,
        Last_Name: this.state.lastName,
        Email: this.state.email,
        Password : this.state.password
      }
      axios.post(`https://reqres.in/api/users`, { data })
      .then(result => {
        console.log(result);
        console.log(result.data);
      })
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

  responseGoogle=(response)=>{
    console.log(response);
    console.log(response.profileObj);
    
    
  }
  

  render(){
    const { formErrors } = this.state;

    return (
      
      <div className="wrapper">
        <div className="form-wrapper">
          
          <div className="gl">

            <GoogleLogin
            clientId="346625909188-ndkast8r5u0f98iquvan031k9v8fthng.apps.googleusercontent.com"
            buttonText="Login"
            onSuccess={this.responseGoogle}
            onFailure={this.responseGoogle}
            cookiePolicy={'single_host_origin'}
        
            />
            
          </div>

          <div className="fb">

            <Facebook />
          </div>


           
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
