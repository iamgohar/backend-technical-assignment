const express = require('express');
const router = express.Router();

// routes imports
const stationRoutes = require('./station');

// API PREFIX ON ALL ROUTES
router.use('/api/v1', stationRoutes);

module.exports = router;
