import React, {Component} from "react";

import './login.css'
import axios from "axios";
import { Link } from 'react-router-dom';
import AuthHelperMethods from './components/AuthHelperMethods';

export default class Signup extends Component {

    Auth = new AuthHelperMethods();
    state = {
        name: "",
        username: "",
        email: "",
        password: ""
    }

    _handleChange = (e) => {
        
        this.setState(
            {
                [e.target.name]: e.target.value
            }
        )

        console.log(this.state);
    }

    handleFormSubmit = e => {
        e.preventDefault();

        //Add this part right here
        axios.post("http://localhost:8080/api/auth/signup", {
            name: this.state.name,
            username: this.state.username,
            email: this.state.email,
            password: this.state.password
        })
            .then(data => {
                console.log(data);
                this.props.history.replace("/login");
            });
    };

    render() {
        return (
            <React.Fragment>
                <div className="main-wrapper">
                    <div className="box">
                        <div className="box-header">
                            <h1>Signup</h1>
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
                            <input
                                className="form-item"
                                placeholder="Name"
                                name="name"
                                type="text"
                                onChange={this._handleChange}
                            />
                            <input
                                className="form-item"
                                placeholder="Email"
                                name="email"
                                type="email"
                                onChange={this._handleChange}
                            />
                            <button className="form-submit" onClick={this.handleFormSubmit}>Signup</button>
                        </form>
                        <Link className="link" to="/login">Already have an account? <span className="link-signup">Login</span></Link>
                    </div>
                </div>
                
            </React.Fragment>
        );
    }

}