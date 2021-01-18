import React from 'react';
import { getBus, getRail } from './API/axios.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BlobProvider, PDFDownloadLink, Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import './App.css';

const styles = StyleSheet.create({
  page: {
      fontFamily: 'Helvetica',
      fontSize: 11,
      paddingTop: 30,
      paddingLeft:60,
      paddingRight:60,
      lineHeight: 1.5,
      flexDirection: 'column',
  }, 
  titleContainer:{
    flexDirection: 'row',
    marginTop: 24,
},
  reportTitle:{
    color: 'tomato',
    letterSpacing: 4,
    fontSize: 25,
    textAlign: 'center',
    textTransform: 'uppercase',
},
  reportsubTitle:{
    color: '#black',
    letterSpacing: 4,
    fontSize: 15,
    textAlign: 'center',
    textTransform: 'uppercase',
},
  invoiceNoContainer: {
    flexDirection: 'row',
    marginTop: 36,
    justifyContent: 'flex-end'
},
  invoiceDateContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
},
  invoiceDate: {
    fontSize: 12,
    fontStyle: 'bold',
},
  label: {
    width: 60
},
section: {
  margin: 10,
  padding: 10,
  flexGrow: 1,
  textAlign: 'center',
}
});

const ref=React.createRef();

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
        console.log(railResponse)
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

generateOrderPDF = (state) => {
    return (
      <Document title="Vozni red">
        <Page size="A4" style={styles.page}>
          <View style={styles.titleContainer}>
            <Text style={styles.reportTitle}>VOZNI RED</Text>
          </View>
          <View style={styles.invoiceDateContainer}>
            <Text>Datum:</Text>
            <Text style={styles.label}>{state.date}</Text>
          </View>
          <View>
            <Text style={styles.reportsubTitle}>{state.from} - {state.to}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.reportsubTitle}>AVTOBUSI</Text>
          </View>
          {state.buses.map((bus, index) => (
            <View style={styles.section}>
            <Text key={index}>Prevoznik: {bus.transporter}</Text>
            <Text key={index}>Trajanje: {bus.duration}</Text>
            <Text key={index}>Začetek: {bus.start}</Text>
            <Text key={index}>Konec: {bus.end}</Text>
            <Text key={index}>Razdalja: {bus.length}</Text>
            </View>
          ))}
          

          <View style={styles.section}>
            <Text style={styles.reportsubTitle}>VLAKI</Text>
          </View>
          {state.rails.map((rail, index) => (
          <View style={styles.section}>
            <Text key={index}>Prevoznik: {rail.transporter}</Text>
            <Text key={index}>Trajanje: {rail.duration}</Text>
            <Text key={index}>Začetek: {rail.start}</Text>
            <Text key={index}>Konec: {rail.end}</Text>
            <Text key={index}>Razdalja: {rail.length}</Text>
            </View>
          ))}
          
        </Page>
   </Document>
)
}


render() {

  return (
    
<body id="target">
<nav class="navbar navbar-dark bg-dark">
  <a class="navbar-brand" href="#">Smart Transport</a>
  </nav>   
  <div class="container1">
  <div class="centered"><h1> Vozni red </h1></div>
  <img class="img-fluid" width="100%" height="50%" src="https://www.flixbus.si/assets/static/flixbus-homepage-sm-03337cd2d2a51225a50bf890d83f1aeb.jpg"></img>
  </div>
  <div class="container">
    <br></br>
    <div className="App" ref={ref} > 
      <form onSubmit={this.handleSubmit}>
        <div class="form-group mb-2">
          <label  class="col-form-label">Vstopno mesto: </label>
            <input class="form-control" placeholder= "Maribor" value={this.state.from} type='text'name='from' onChange={this.handleChange} required/>
          </div>
          <div class="form-group mb-2">
          <label class="col-form-label">Izstopno mesto: </label>
            <input class="form-control" placeholder="Ljubljana" value={this.state.to} type='text' name='to' onChange={this.handleChange} required/>
          </div>
          <div class="form-group mb-2">
          <label  class="col-form-label">Datum </label>
            <input value={this.state.date} class="form-control datepicker" type='date' name='date' onChange={this.handleChange} required/>
          </div>
          <input type='submit' class="btn btn-primary" value="Išči prevozni red"/>
          <BlobProvider document={this.generateOrderPDF(this.state)}>
          {({ url }) => (
           <a  href={url} target="_blank">  Prenesi vozni red PDF <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-download" viewBox="0 0 16 16">
           <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
           <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
          </svg></a>
          )}
    </BlobProvider>
      <div>
      <br></br>
        <row>
        {this.state.buses.map((bus, index) => (
          <div class="col-12 card m-3">
            <div class="card-header" key={index}> <strong>{bus.from}- {bus.to}</strong></div>
            <div class="card-body">
                <p  class="card-text" key={index}><strong>Prevoznik: {bus.transporter}</strong></p>
                <p class="card-text" key={index}> Trajanje: {bus.duration}</p>
                <p  class="card-text" key={index}>Začetek: {bus.start}</p>
                <p  class="card-text" key={index}>Konec: {bus.end}</p>
                <p class="card-text" key={index}>Razdalja: {bus.length}</p>        
            </div>
          </div>
          ))}
      </row>
    </div>
    <div>
      <row>
      {this.state.rails.map((rail, index) => (
            <div class="col-12 card m-3">
            <div class="card-header" key={index}> <strong>{rail.from}- {rail.to}</strong></div>
            <div class="card-body">
                <p  class="card-text" key={index}><strong>Prevoznik: {rail.transporter}</strong></p>
                <p class="card-text" key={index}> Trajanje: {rail.duration}</p>
                <p  class="card-text" key={index}>Začetek: {rail.start}</p>
                <p  class="card-text" key={index}>Konec: {rail.end}</p>
                <p class="card-text" key={index}>Razdalja: {rail.length}</p>        
            </div>
          </div>
           ))}
      </row>
    </div>
    </form>
    </div>
    </div>
    </body>
  );
}
}


export default App;
