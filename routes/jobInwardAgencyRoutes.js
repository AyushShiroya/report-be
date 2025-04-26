const express = require('express');
const {
    createAgency,
    getAllAgencies,
    getAgency,
    updateAgency,
    deleteAgency
} = require('../controllers/jobInwardAgencyController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.route('/')
    .post(createAgency)
    .get(getAllAgencies);

router.route('/:id')
    .get(getAgency)
    .put(updateAgency)
    .delete(deleteAgency);

module.exports = router;