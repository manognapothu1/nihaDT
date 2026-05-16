const express = require('express');
const {
  getAllComplaints,
  updateComplaintStatus,
  getDashboardStats,
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(protect, adminOnly);
router.get('/complaints', getAllComplaints);
router.patch('/complaints/:id/status', updateComplaintStatus);
router.get('/stats', getDashboardStats);

module.exports = router;
