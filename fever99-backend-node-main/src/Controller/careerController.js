import Career from '../Model/career.js'

const createCareerApplication = async (req, res) => {
  try {
    const career = new Career({
      name: req.body.name,
      email: req.body.email,
      mobile: req.body.mobile,
      applyAs: req.body.applyAs,
      gender: req.body.gender,
      dob: req.body.dob,
      higherQualification: req.body.higherQualification,
      address: req.body.address,
      experience: req.body.experience,
      resume: req.filename,
    });
    await career.save();
    res.status(200).json({ status: true, message: "Thank you/ our team will contact you shortly." });
  } catch (error) {
    res.status(400).json(error);
  }
};

// Read all career applications
const getAllCareerApplications = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Current page, default to 1 if not provided
  const limit = parseInt(req.query.limit) || 10; // Number of items per page, default to 10 if not provided

  try {
    const careers = await Career
      .find()
      .sort({ createdAt: -1 }) // Sort by 'createdAt' field in descending order (latest first)
      .skip((page - 1) * limit) // Skip items based on the current page
      .limit(limit); // Limit the number of items per page

    const totalCareers = await Career.countDocuments(); // Get the total count of career applications

    res.json({
      data: careers,
      status: true,
      message: 'Career List',
      totalRecord: totalCareers,
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};


// Read a single career application by ID
const getCareerApplicationById = async (req, res) => {
  try {
    const career = await Career.findById(req.params.id);
    if (!career) {
      return res.status(404).json();
    }
    res.json(career);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Delete a career application by ID
const deleteCareerApplicationById = async (req, res) => {
  try {
    const career = await Career.findByIdAndDelete(req.params.id);
    if (!career) {
      return res.status(404).json();
    }
    res.json({ status: true, message: 'Career Deleted!' });
  } catch (error) {
    res.status(500).json(error);
  }
};


export default {
  createCareerApplication,
  getAllCareerApplications,
  getCareerApplicationById,
  deleteCareerApplicationById,
};