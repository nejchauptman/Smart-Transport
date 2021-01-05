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
    await page.type('input.input-departure.form-control.ta-field.typeahead', 'Maribor')
    await page.waitForTimeout(800)
    await page.type('input[name="destination"]', 'Ptuj');
    await page.waitForTimeout(800)
    await page.evaluate( () => document.getElementById("trip-date").value = "")
    await page.type('input.form-control.flatpickr-input', '8.1.2021')
    await page.evaluate(() => {document.querySelector('button[type=submit]').click();});
    await page.waitForNavigation();
    await page.waitForSelector('.connection');

    const rides = await page.$$('.connection');
    for (let ride of rides){
        const length = await ride.$eval('div.length', (el)=>el.innerText);
        const price = await ride.$eval('div.price', (el)=>el.innerText);
       /* const nekaj = await ride.$eval("div > table", el => el.innerHTML);
        console.log(nekaj);*/
        listOfRides.push({ length: length, price: price });
    }
    res.json(listOfRides);
    }
);

app.listen(5000);