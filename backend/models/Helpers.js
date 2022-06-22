require('dotenv').config();
const fs = require('fs');
const moment = require('moment-timezone');

function fileExist(filePath) {
    return new Promise((resolve, reject) => {
        fs.access(filePath, fs.F_OK, (err) => {
            let status = 500;
            if (err) {
                return reject(err);
            } else {
                status = 1;
            }
            //file exists
            resolve(status);
        });
    });
}

function errorLogging(error) {
    let path = './logs';
    const fs = require('fs'); // Or `import fs from "fs";` with ESM
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
    }
    let dateToday = moment().format('DD-MM-YYYY');
    let logfilePath = './logs/' + dateToday + '.txt';
    if (!fs.existsSync(logfilePath)) {
        fs.createWriteStream(logfilePath);
    }
    let newError = '';
    newError +=
        '--------------------------------------------------------------------------';
    let dateTimeNow = moment().format('DD-MM-YYYY h:mm:ss A');
    newError += '\n';
    newError += dateTimeNow;
    newError += '\n';
    newError += error;
    newError += ' \n\n ';

    fs.appendFile(logfilePath, newError, function (err) {
        if (err) throw err;
    });
}

module.exports = {
    fileExist,
    errorLogging,
};
