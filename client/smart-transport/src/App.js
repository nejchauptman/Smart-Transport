import React from 'react';
import './App.css';
import { getBus, getRail } from './API/axios.js';
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        buses: [],
        rails: [],
        from: '',
        to:'',
        date: '', 
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
}

  convertDate(dateString){
    var date = new Date(dateString);
    return date.getDate()+"."+(date.getMonth() + 1)+"."+date.getFullYear();
}


sendRequestForBuses(from, to, date) {
  const busesResponse = getBus(from, to, date);
        busesResponse.then((resp) => {
            const buses = resp.data;
            this.setState({
              buses: buses,
        });
    });
}

sendRequestForRail(from, to, date){
  const railResponse = getRail(from, to, date);
        railResponse.then((resp) => {
            const rails = resp.data;
            console.log(rails);
            this.setState({
              rails: rails,
        });
    });
  
}
handleSubmit = (event) => {
  event.preventDefault();
  this.state.date=this.convertDate(this.state.date);
  this.sendRequestForBuses(this.state.from, this.state.to,this.state.date);
  this.sendRequestForRail(this.state.from, this.state.to,this.state.date);


}
handleChange = (event) => {
  this.setState({ [event.target.name]: event.target.value,  [event.target.name]: event.target.value, [event.target.name]: event.target.value});

}

render() {

  return (
    <div>
      
      <div className="row">
    <form onSubmit={this.handleSubmit}>
    <input
      value={this.state.from}
      type='text'
      name='from'
      onChange={this.handleChange}
    />
    <input
      value={this.state.to}
      type='text'
      name='to'
      onChange={this.handleChange}
    />
     <input
      value={this.state.date}
      type='date'
      name='date'
      onChange={this.handleChange}
    />
    <input
      type='submit'
    />
   
    </form>
  </div>
    <div>
      <row className="row">
      {this.state.buses.map((bus, index) => (
                            <p key={index}>{bus.from}
                            <p key={index}>{bus.to}</p>
                            <p key={index}>{bus.transporter}</p>
                            <p key={index}>{bus.duration}</p>,
                            <p key={index}>{bus.start}</p>
                            <p key={index}>{bus.end}</p>
                            <p key={index}>{bus.length}</p>
                            </p>
                           
                        ))}
      </row>
    </div>
    <div>
      <row>
      {this.state.rails.map((rail, index) => (
                            <p key={index}>{rail.from}
                            <p key={index}>{rail.to}</p>
                            <p key={index}>{rail.start}</p>
                            <p key={index}>{rail.end}</p>
                            <p>Slovenske Železnice</p>

                            </p>
                           
                        ))}
      </row>
    </div>
    </div>
    
  );

}


}
export default App;
