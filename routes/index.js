// routes/index.js or your main router file
const express = require('express');
const userRoutes = require('./userRoutes');
const jobInwardRoutes = require('./jobInwardRoutes');
const jobAgencyRoutes = require('./jobInwardAgencyRoutes');
const allJobInwardRoutes = require('./allJobInwardRoutes')
const formEnteryRoutes = require('./formEnteryRoutes')
const router = express.Router();

router.use('/users', userRoutes);
router.use('/jobinwards', jobInwardRoutes);
router.use('/agency', jobAgencyRoutes)
router.use('/alljobinwards', allJobInwardRoutes);
router.use('/formentry', formEnteryRoutes);

module.exports = router;