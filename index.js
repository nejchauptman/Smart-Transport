const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
var cors = require('cors')

app.use(cors())

const arriva_web_page = 'https://arriva.si/';
const slo_rail_web_page = 'https://potniski.sz.si/'


//example: http://localhost:5000/arriva?from=Maribor&to=Ptuj&date=2021-01-26
app.get('/arriva', async (req, res) => {
    
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    let listOfRides = [];

    await page.goto(`${arriva_web_page}`);
    await page.waitForTimeout(800)
    await page.type('input.input-departure.form-control.ta-field.typeahead', req.query.from)
    await page.waitForTimeout(800)
    await page.type('input[name="destination"]', req.query.to);
    await page.waitForTimeout(800)
    await page.evaluate( () => document.getElementById("trip-date").value = "")
    await page.type('input.form-control.flatpickr-input', req.query.date)
    await page.evaluate(() => {document.querySelector('button[type=submit]').click();});
    await page.waitForNavigation();
    await page.waitForSelector('.connection');
    const rides = await page.$$('.connection');

    for (let ride=0;  ride< rides.length; ride ++){
        if(ride!=0){
            const length = await rides[ride].$eval('div.length', (el)=>el.innerText);
            const price = await rides[ride].$eval('div.price', (el)=>el.innerText);
            const start = await rides[ride].$eval('div.departure-arrival > table > tbody > tr.departure > td > span', (el)=>el.innerText);
            const end = await rides[ride].$eval('div.departure-arrival > table > tbody > tr.arrival > td > span', (el)=>el.innerText);
            const duration = await rides[ride].$eval('div.duration > div > span ', (el)=>el.innerText);
            const transporter = await rides[ride].$eval('div.duration > div.prevoznik > span:nth-child(2)  ', (el)=>el.innerHTML);
            const from = await rides[ride].$eval('div.departure-arrival > table > tbody > tr.departure > td:nth-child(3) > span', (el)=>el.innerText);
            const to = await rides[ride].$eval('div.departure-arrival > table > tbody > tr.arrival > td:nth-child(3) > span', (el)=>el.innerText);
            listOfRides.push({ length: length, price: price, start:start, end:end , duration : duration, transporter:transporter, from:from, to: to });
        }
    }
    await page.close();
    res.json(listOfRides);
    
    }
);

//example: http://localhost:5000/rail?from=Maribor&to=Ptuj&date=2021-01-26
app.get("/rail", async(req,res) =>{
    const browser = await puppeteer.launch({ headless: false });
    const second_page = await browser.newPage();
    let listOfRailRides = [];

    await second_page.goto(`${slo_rail_web_page}`);
    await second_page.evaluate( () => document.getElementById("departure-date").value = "");
    await second_page.type('input.form-control.flatpickr-input', req.query.date);
    await second_page.waitForTimeout(800);
    await second_page.type('input#entry-station-selectized', req.query.from);
    await second_page.keyboard.press('Enter');
    await second_page.waitForTimeout(800);
    await second_page.type('input#exit-station-selectized', req.query.to);
    await second_page.keyboard.press('Enter');
    await second_page.evaluate(() => {document.querySelector('button[type=submit]').click();});
    await second_page.waitForNavigation();
    await second_page.waitForSelector('.connection.card.no-shadow.connection-active');
    const rail_rides = await second_page.$$('.connection.card.no-shadow.connection-active');

    for (let rail_ride=0;  rail_ride< rail_rides.length; rail_ride ++){
        const from = await rail_rides[rail_ride].$eval('div.col-12.col-md-10.order-2.order-md-1 > div:nth-child(1) > div > div > div > div > div:nth-child(1) > strong:nth-child(1)', (el)=>el.innerText);
        const start = await rail_rides[rail_ride].$eval('div.col-12.col-md-10.order-2.order-md-1 > div:nth-child(1) > div > div > div > div > div:nth-child(1) > strong:nth-child(2)', (el)=>el.innerText);
        const end = await rail_rides[rail_ride].$eval('div.col-12.col-md-10.order-2.order-md-1 > div:nth-child(4) > div > div > div > div > strong:nth-child(2)', (el)=>el.innerText);
        const time = await rail_rides[rail_ride].$eval('span:nth-child(2) > span.value', (el)=>el.innerText);
        const to = await rail_rides[rail_ride].$eval('div.col-12.col-md-10.order-2.order-md-1 > div:nth-child(4) > div > div > div > div > strong:nth-child(1)', (el)=>el.innerText);
        
        listOfRailRides.push({ from: from, to:to,  time: time, start: start, end:end});
    }
    await second_page.close();
    res.json(listOfRailRides);
    });
app.listen(5000);