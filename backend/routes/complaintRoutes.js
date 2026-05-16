const express = require('express');
const {
  createComplaint,
  getMyComplaints,
  getComplaintById,
} = require('../controllers/complaintController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').post(protect, createComplaint).get(protect, getMyComplaints);
router.get('/:id', protect, getComplaintById);

module.exports = router;
