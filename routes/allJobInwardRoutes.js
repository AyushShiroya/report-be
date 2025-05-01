const express = require('express');
const router = express.Router();
const jobInwardController = require('../controllers/allJobInwardController');
const authMiddleware = require('../middleware/authMiddleware');
const uploadMiddleware = require('../middleware/uploadMiddleware');

// Apply auth middleware to all routes
router.use(authMiddleware);

// POST /api/jobinwards - Create new job inward
router.post(
    '/',
    uploadMiddleware.array('documents'),
    jobInwardController.createJobInward
);

// GET /api/jobinwards - Get all job inwards
router.get('/', jobInwardController.getAllJobInwards);

router.get('/stats', jobInwardController.getJobStats);

router.get('/stats/monthly', jobInwardController.getMonthlyJobInwardStats);

// GET /api/jobinwards/:id - Get single job inward
router.get('/:id', jobInwardController.getJobInwardById);


// PUT /api/jobinwards/:id - Update job inward
router.put(
    '/:id',
    uploadMiddleware.array('documents'),
    jobInwardController.updateJobInward
);

// DELETE /api/jobinwards/:id - Delete job inward
router.delete('/:id', jobInwardController.deleteJobInward);


module.exports = router;