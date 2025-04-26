const express = require('express');
const router = express.Router();
const FormEnteryController = require('../controllers/formEnteryController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Create a new reference
router.post('/', FormEnteryController.createReference);

// Get all references
router.get('/', FormEnteryController.getAllReferences);

// Get single reference by ID
router.get('/:id', FormEnteryController.getReferenceById);

// Update reference
router.put('/:id', FormEnteryController.updateReference);

// Delete reference
router.delete('/:id', FormEnteryController.deleteReference);

module.exports = router;