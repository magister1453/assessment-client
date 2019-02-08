import React, { Component } from "react";
import { Link } from 'react-router-dom';
import AuthHelperMethods from './components/AuthHelperMethods';


class Login extends Component {

    /* In order to utilize our authentication methods within the AuthService class, we want to instantiate a new object */
    Auth = new AuthHelperMethods();
    state = {
        username: "",
        password: ""
    }

    /* Fired off every time the use enters something into the input fields */
    _handleChange = (e) => {
        this.setState(
            {
                [e.target.name]: e.target.value
            }
        )
    }

    handleFormSubmit = e => {
        e.preventDefault();

        this.Auth.login(this.state.username, this.state.password)
            .then(res => {
                if (res === false) {
                    return alert("Sorry those credentials don't exist!");
                }
                this.props.history.replace("/");
            })
            .catch(err => {
                alert(err);
            });
    };

    componentWillMount() {

        if (this.Auth.loggedIn()){
            this.props.history.replace('/');
        }
        
    }

    render() {
        return (
            <React.Fragment>
                <div className="main-wrapper">
                    <div className="box">
                        <div className="box-header">
                            <h1>Login</h1>
                        </div>
                        <form className="box-form">
                            <input
                                className="form-item"
                                placeholder="Username"
                                name="username"
                                type="text"
                                onChange={this._handleChange}
                            />
                            <input
                                className="form-item"
                                placeholder="Password"
                                name="password"
                                type="password"
                                onChange={this._handleChange}
                            />
                            <button className="form-submit" onClick={this.handleFormSubmit}>Login</button>
                        </form>
                        <Link className="link" to="/signup">Don't have an account? <span className="link-signup">Signup</span></Link>
                    </div>
                </div>
                
            </React.Fragment>
        );
    }

}

export default Login;