require('dotenv').config();
const Stations = require('../models/Stations');
const Helpers = require('../models/Helpers');
const moment = require('moment-timezone');
let timeZone = process.env.TIME_ZONE;
var Promise = require('bluebird');
var request = Promise.promisifyAll(require('request'), { multiArgs: true });
let WEATHERKEY = process.env.WEATHERKEY;

function getWeather() {
    return new Promise(async function (resolve, reject) {
        let data = {};
        let status = 500;
        await request
            .getAsync(
                `https://api.openweathermap.org/data/2.5/weather?q=Philadelphia&appid=${WEATHERKEY}`
            )
            .spread(async function (response, body) {
                status = 200;
                data = JSON.parse(body);
            })
            .catch(function (err) {
                console.log(err);
            });

        return resolve({
            status,
            data,
        });
    });
}

function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

exports.getAllStationsData = async (req, res) => {
    try {
        let status = 500;
        let stations = {};
        let currentDateTime = moment().format('YYYY-MM-DD HH');
        let weather = {};

        let inputs = req.query.at;
        if (!req.query.at) {
            inputs = currentDateTime;
        }

        await getWeather()
            .then((res) => {
                weather = res.data;
            })
            .catch((err) => {
                console.log(err);
            });

        await Stations.getAllStationsData(inputs)
            .then((response) => {
                status = response.status;
                stations = response.stations;
            })
            .catch((error) => {
                console.log('All Stations get error : ' + error);
                Helpers.errorLogging('All Stations get error : ' + error);
            });

        if (stations.length <= 0) {
            return res
                .status(404)
                .json({ at: inputs, msg: 'No station at this time found' });
        } else {
            getWeather();
            return res
                .status(200)
                .json({ at: inputs, status, stations, weather });
        }
    } catch (error) {
        console.log('All Stations get error : ' + error);
        Helpers.errorLogging('All Stations get error : ' + error);
    }
};

exports.getStationData = async (req, res) => {
    try {
        let status = 500;
        let station = {};
        let currentDateTime = moment().format('YYYY-MM-DD HH');
        let weather = {};

        let inputs = req.query.at;
        if (!req.query.at) {
            inputs = currentDateTime;
        }

        let kioskId = req.params.kioskId;

        await getWeather()
            .then((res) => {
                weather = res.data;
            })
            .catch((err) => {
                console.log(err);
            });

        await Stations.getStationData(inputs, kioskId)
            .then((response) => {
                status = response.status;
                station = response.station;
            })
            .catch((error) => {
                console.log('Station get error : ' + error);
                Helpers.errorLogging('Station get error : ' + error);
            });

        if (isEmpty(station)) {
            return res.status(404).json({
                at: inputs,
                msg: 'No station at this time and ksiokId found',
            });
        } else {
            getWeather();
            return res
                .status(200)
                .json({ at: inputs, status, station, weather });
        }
    } catch (error) {
        console.log('Station get error : ' + error);
        Helpers.errorLogging('Station get error : ' + error);
    }
};
