const express = require('express');
const router = express.Router();

const {
    getStationData,
    getAllStationsData,
} = require('../controllers/StationController');

router.get('/stations', getAllStationsData);
router.get('/stations/:kioskId', getStationData);

module.exports = router;
