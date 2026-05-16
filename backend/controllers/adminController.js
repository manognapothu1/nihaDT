const Complaint = require('../models/Complaint');
const User = require('../models/User');

exports.getAllComplaints = async (req, res, next) => {
  try {
    const { category, status, search } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (status) filter.status = status;
    if (search) filter.title = { $regex: search, $options: 'i' };

    const complaints = await Complaint.find(filter)
      .populate('userId', 'name email')
      .sort({ updatedAt: -1 });
    res.json(complaints);
  } catch (error) {
    next(error);
  }
};

exports.updateComplaintStatus = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    const { status, assignedTo, adminNote } = req.body;
    if (status) complaint.status = status;
    if (assignedTo !== undefined) complaint.assignedTo = assignedTo;
    if (adminNote !== undefined) complaint.adminNote = adminNote;
    complaint.updatedAt = Date.now();

    await complaint.save();
    res.json(complaint);
  } catch (error) {
    next(error);
  }
};

exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalComplaints = await Complaint.countDocuments();
    const statusCounts = await Complaint.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    const categoryCounts = await Complaint.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    const summary = {
      totalUsers,
      totalComplaints,
      statusCounts: statusCounts.reduce((acc, item) => ({ ...acc, [item._id]: item.count }), {}),
      categoryCounts: categoryCounts.reduce((acc, item) => ({ ...acc, [item._id]: item.count }), {}),
    };

    res.json(summary);
  } catch (error) {
    next(error);
  }
};
