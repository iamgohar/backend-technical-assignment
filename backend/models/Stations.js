require('dotenv').config();
const stationTable = 'stations';
const moment = require('moment-timezone');
const Helpers = require('./Helpers');
let timeZone = process.env.TIME_ZONE;
const knex = require('../knex/knex.js');

function getStationData(inputs, kioskId) {
    return new Promise(async function (resolve, reject) {
        let stations = {};
        let station = {};
        let status = 500;

        await knex(stationTable)
            .where('created_at', inputs)
            .then((response) => {
                stations = response;
                status = 200;
            })
            .catch((error) => {
                console.log('Stations get error : ', error);
                Helpers.errorLogging('Stations get error : ' + error);
                status = 500;
            });
        if (stations.length > 0) {
            let parsedStations = JSON.parse(stations[0].stations);
            for (let i = 0; i < parsedStations.features.length; i++) {
                if (parsedStations.features[i].properties.id == kioskId) {
                    station = parsedStations.features[i];
                    break;
                }
            }
        }

        resolve({
            status,
            station,
        });
    });
}

function getAllStationsData(inputs) {
    return new Promise(async function (resolve, reject) {
        let stations = {};
        let status = 500;

        await knex(stationTable)
            .where('created_at', inputs)
            .then((response) => {
                stations = response;
                status = 200;
            })
            .catch((error) => {
                console.log('Stations get error : ', error);
                Helpers.errorLogging('Stations get error : ' + error);
                status = 500;
            });

        resolve({
            status,
            stations,
        });
    });
}

function saveStationsData(inputs) {
    return new Promise(async function (resolve, reject) {
        let status = 500;
        let currentDateTime = moment().format('YYYY-MM-DD HH');

        let stationInsert = {
            stations: inputs,
            created_at: currentDateTime,
        };

        await knex(stationTable)
            .insert(stationInsert)
            .then((response) => {
                status = 200;
            })
            .catch((error) => {
                console.log('Station insert error : ', error);
                Helpers.errorLogging('Station insert error : ' + error);
                status = 500;
            });

        return resolve({
            status,
        });
    });
}

module.exports = {
    getStationData,
    getAllStationsData,
    saveStationsData,
};
