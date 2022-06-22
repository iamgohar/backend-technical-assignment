var cron = require('node-cron');
const Stations = require('../models/Stations');

var Promise = require('bluebird');
var request = Promise.promisifyAll(require('request'), { multiArgs: true });

cron.schedule('0 0 */1 * * *', async () => {
    console.log('running a task every hour');

    await request
        .getAsync('https://kiosks.bicycletransit.workers.dev/phl')
        .spread(async function (response, body) {
            await Stations.saveStationsData(body)
                .then((res) => {
                    console.log(res);
                })
                .catch((err) => {
                    console.log(err);
                });
        })
        .catch(function (err) {
            console.log(err);
        });
});
