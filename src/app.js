const express = require('express');
const hbs = require("hbs");
const path = require("path");
const app = express();

// 
const mongoose = require('mongoose');

//

const weatherData = require('../utils/weatherData');

const port = process.env.PORT || 3000

const publicStaticDirPath = path.join(__dirname, '../public')

const viewsPath = path.join(__dirname, '../templates/views');

const partialsPath = path.join(__dirname, '../templates/partials');

app.set('view engine', 'hbs');
app.set('views', viewsPath);
//
mongoose.connect('mongodb://localhost:27017/weather');
//Create Schema
const citySchema = new mongoose.Schema({
    Temperature : String,
    Description : String,
    CityName : String,
    Date: String
  });
const cityModel = mongoose.model("city", citySchema);
// var xyz = new cityModel({Temperature: '32', Description: 'Fog', CityName:'Buffalo'});
// xyz.save()

// mongoose.connection.once('open', function(){
//     console.log('Connection has been made, now make firework..');
//     done();
// }).on('error',function(error){
//     console.log('Connection error:', error);
// });

// });

//
hbs.registerPartials(partialsPath);
app.use(express.static(publicStaticDirPath));

app.get('', (req, res) => {
    res.render('index', {
        title: "Today's Weather"
    })
})

//localhost:3000/weather?address=lahore
app.get('/weather', (req, res) => {
    const address = req.query.address
    if(!address) {
        return res.send({
            error: "You must enter address in search text box"
        })
    }

    weatherData(address, (error, {temperature, description, cityName} = {}) => {
        if(error) {
            return res.send({
                error
            })
        }
        console.log(temperature, description, cityName);
        //
        const timestamp = Date.now();
        var datetime = new Date();

        var xyz = new cityModel({Temperature: temperature, Description: description, CityName:cityName, Date});
        xyz.save()
        //
        res.send({
            temperature,
            description,
            cityName
        })
    })
});

app.get("*", (req, res) => {
    res.render('404', {
        title: "page not found"
    })
})


app.listen(port, () => {
    console.log("Server is up and running on port: ", port);
})