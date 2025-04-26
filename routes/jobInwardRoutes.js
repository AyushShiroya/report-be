const express = require('express');
const {
  createJobInward,
  getAllJobInwards,
  getJobInward,
  updateJobInward,
  deleteJobInward
} = require('../controllers/jobInwardController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.route('/')
  .post(createJobInward)
  .get(getAllJobInwards);

router.route('/:id')
  .get(getJobInward)
  .put(updateJobInward)
  .delete(deleteJobInward);

module.exports = router;