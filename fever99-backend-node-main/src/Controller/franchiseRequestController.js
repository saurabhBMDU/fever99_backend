import FranchiseRequest from '../Model/franchiseRequest.js'

// Create a new franchise request
export const createFranchiseRequest = async (req, res) => {
  try {
    const {
      name,
      email,
      mobile,
      gender,
      state,
      city,
      profession,
    } = req.body;

    const franchiseRequest = new FranchiseRequest({
      name,
      email,
      mobile,
      gender,
      state,
      city,
      profession,
    });

    const savedRequest = await franchiseRequest.save();

    res.status(200).json({ status: true, message: 'Your request has been submitted!', data: savedRequest });
  } catch (error) {
    res.status(500).json({ error: "Failed to create franchise request" });
  }
};

// Get all franchise requests
export const getAllFranchiseRequests = async (req, res) => {
  try {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;

    const startIndex = (page - 1) * limit;

    const totalRequests = await FranchiseRequest.countDocuments();

    const requests = await FranchiseRequest.find()
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit)
      .exec();

    res.json({
      status: true,
      message: 'List',
      data: requests,
      currentPage: page,
      totalRecord: totalRequests
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch franchise requests" });
  }
};

