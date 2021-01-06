import axios from 'axios';

const path = "http://localhost:5000/"
async function getBus(from, to,date) {
    try {
      const response = await axios.get(path+'arriva?from=' + from +'&to='+to+'&date='+date);
      return response;
    } catch (err) {
      console.log(err);
      return "Something is wrong!";
    }
  }


  async function getRail(from, to, date) {
    try {
      const response = await axios.get(path+'rail?from=' + from +'&to='+to+'&date='+date);
      return response;
    } catch (err) {
      console.log(err);
      return "Something is wrong!" ;
    }
  }
  export {getBus,getRail};