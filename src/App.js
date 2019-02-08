import React, { Component } from 'react';
import './App.css';
import axios from "axios";
import AuthHelperMethods from './components/AuthHelperMethods';
import withAuth from './components/withAuth';
import Select from "react-dropdown-select";
import JsonTable from 'ts-react-json-table';
import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css';


class App extends Component {

  /* Create a new instance of the 'AuthHelperMethods' compoenent*/
  Auth = new AuthHelperMethods();
  state = {
    username: "",
    password: "",
    providers: [],
    minDischarges: 0,
    maxDischarges: 0,
    minAverageCoveredCharges: 0,
    maxAverageCoveredCharges: 0,
    minAverageMedicareCharges: 0,
    maxAverageMedicareCharges: 0,
    states: [],
    currentState: "",
    currentDischarges: { min: 0, max: 0 },
    currentAverageCoveredCharges: { min: 0, max: 0 },
    currentAverageMedicarePayments: { min: 0, max: 0 }
  };

    _handleChange = (e) => {

        this.setState(
            {
                [e.target.name]: e.target.value
            }
        );

        console.log(this.state);
    };

    componentWillMount() {
        this.Auth.fetch('http://localhost:8080/api/provider/searchParameters', {
            method: 'GET'
        }).then(res => {
            this.setState({
                minDischarges: res.minDischarges,
                maxDischarges: res.maxDischarges,
                currentDischarges: { min : res.minDischarges, max : res.maxDischarges},
                minAverageCoveredCharges: res.minAverageCoveredCharges,
                maxAverageCoveredCharges: res.maxAverageCoveredCharges,
                currentAverageCoveredCharges: { min : res.minAverageCoveredCharges, max : res.maxAverageCoveredCharges},
                minAverageMedicareCharges: res.minAverageMedicareCharges,
                maxAverageMedicareCharges: res.maxAverageMedicareCharges,
                currentAverageMedicarePayments: { min : res.minAverageMedicareCharges, max : res.maxAverageMedicareCharges},
            });
            let statesFromApi = res.states.map(state => { return {value: state, display: state} });
            this.setState({ states: [{value: '', display: '(Select your state)'}].concat(statesFromApi) });
        })
    }

    _handleLogout = () => {
        this.Auth.logout();
        this.props.history.replace('/login');
    }

    handleFormSubmit = e => {
        e.preventDefault();
        let url = new URL('http://localhost:8080/api/provider');
        let params = {
            max_discharges:this.state.currentDischarges.max,
            min_discharges:this.state.currentDischarges.min,
            max_average_covered_charges:this.state.currentAverageCoveredCharges.max,
            min_average_covered_charges:this.state.currentAverageCoveredCharges.min,
            max_average_medicare_payments:this.state.currentAverageMedicarePayments.max,
            min_average_medicare_payments:this.state.currentAverageMedicarePayments.min,
            state:this.state.currentState
        };
        url.search = new URLSearchParams(params);
        this.Auth.fetch(url, {
            method: 'GET'
        }).then(res => {
            this.setState({providers: res});
        })
    };

    handleSliderChange(event){
        this.setState({value: event.target.value});
    }

  //Render the protected component
  render() {

    return (
      <div className="App">
        <div className="main-page">
          <div className="top-section">
            <form className="box-form">
                <label>Total Discharges</label>
                <InputRange
                    maxValue={this.state.maxDischarges}
                    minValue={this.state.minDischarges}
                    value={this.state.currentDischarges}
                    onChange={currentDischarges => this.setState({ currentDischarges })} />
                <br/>
                <label>Average Covered Charges</label>
                <InputRange
                    maxValue={this.state.maxAverageCoveredCharges}
                    minValue={this.state.minAverageCoveredCharges}
                    value={this.state.currentAverageCoveredCharges}
                    onChange={currentAverageCoveredCharges => this.setState({ currentAverageCoveredCharges })} />
                <br/>
                <label>Average Medicare Payments</label>
                <InputRange
                    maxValue={this.state.maxAverageMedicareCharges}
                    minValue={this.state.minAverageMedicareCharges}
                    value={this.state.currentAverageMedicarePayments}
                    onChange={currentAverageMedicarePayments => this.setState({ currentAverageMedicarePayments })} />
              <select value={this.state.currentState}
                  onChange={(e) => this.setState({currentState: e.target.value})}>
                  {this.state.states.map((state) => <option key={state.value} value={state.value}>{state.display}</option>)}
              </select>
              <button className="form-submit" onClick={this.handleFormSubmit}>Search</button>
            </form>
          </div>
          <div className="bottom-section">
              <JsonTable rows = {this.state.providers} />
            <button onClick={this._handleLogout}>LOGOUT</button>
          </div>
        </div>
      </div>
    );
  }
}

//In order for this component to be protected, we must wrap it with what we call a 'Higher Order Component' or HOC.
export default withAuth(App);
