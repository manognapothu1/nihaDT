const Complaint = require('../models/Complaint');

const computePriority = (category, urgent) => {
  if (urgent) return 'High';
  if (category === 'electrical' || category === 'internet') return 'High';
  if (category === 'water' || category === 'cleaning') return 'Medium';
  return 'Low';
};

exports.createComplaint = async (req, res, next) => {
  try {
    const { title, description, category, image, urgent } = req.body;
    if (!title || !description || !category) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    const priority = computePriority(category, urgent === true || urgent === 'true');

    const complaint = await Complaint.create({
      userId: req.user._id,
      title,
      description,
      category,
      image,
      urgent: urgent === true || urgent === 'true',
      priority,
      updatedAt: Date.now(),
    });

    res.status(201).json(complaint);
  } catch (error) {
    next(error);
  }
};

exports.getMyComplaints = async (req, res, next) => {
  try {
    const { category, status, search } = req.query;
    const filter = { userId: req.user._id };

    if (category) filter.category = category;
    if (status) filter.status = status;
    if (search) filter.title = { $regex: search, $options: 'i' };

    const complaints = await Complaint.find(filter).sort({ updatedAt: -1 });
    res.json(complaints);
  } catch (error) {
    next(error);
  }
};

exports.getComplaintById = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    if (complaint.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not allowed to view this complaint' });
    }
    res.json(complaint);
  } catch (error) {
    next(error);
  }
};
