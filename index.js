const express = require('express');
const puppeteer = require('puppeteer');
const app = express();

const STRAN = 'https://arriva.si/';

app.get('/', async (req, res) => {
    
    //headless false = dynamic web page is used
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    let listOfRides = [];

    await page.goto(`${STRAN}`);
    await page.type('input.input-departure.form-control.ta-field.typeahead', 'Maribor AP')
    await page.waitForTimeout(800)
    await page.type('input[name="destination"]', 'Ptuj AP');
    await page.waitForTimeout(800)
    await page.evaluate( () => document.getElementById("trip-date").value = "")
    await page.type('input.form-control.flatpickr-input', '8.1.2021')
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
        
       /* const nekaj = await ride.$eval("div > table", el => el.innerHTML);
        console.log(nekaj);*/

    }
    res.json(listOfRides);
    }
);

app.listen(5000);