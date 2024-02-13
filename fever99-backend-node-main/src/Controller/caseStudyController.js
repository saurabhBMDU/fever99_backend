import CaseStudy from "../Model/CaseStudy.js";
import slugify from "slugify";

export const createCaseStudy = async (req, res) => {
  const userId = req.user;
  const image = req.filename;

  const { name, title, description, status } = req.body;
  try {
    const caseStudy = new CaseStudy({
      userId,
      image,
      name,
      title,
      description,
      status,
      slug: slugify(title, { lower: true })
    });
    const savedCaseStudy = await caseStudy.save();
    res.json({ status: true, message: "List", data: savedCaseStudy });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all case studies
export const getAllCaseStudies = async (req, res) => {
  try {
    const caseStudies = await CaseStudy.find();

    res.json({ status: true, message: "List", data: caseStudies });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCaseStudiesById = async (req, res) => {
  try {
    const caseStudies = await CaseStudy.findById(req.params.id);

    res.json({ status: true, message: "one record", data: caseStudies });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const getCaseStudiesBySlug = async (req, res) => {
  try {
    const caseStudies = await CaseStudy.findOne({ slug: req.params.slug });
    if (!caseStudies) {
      res.json({ status: false, message: "Record not found" });
    }
    res.json({ status: true, message: "one record", data: caseStudies });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Update a case study by ID
export const updateCaseStudy = async (req, res) => {
  const image = req.filename;
  const { name, title, description, status } = req.body;
  try {
    const updatedCaseStudy = await CaseStudy.findByIdAndUpdate(
      req.params.id,
      { image, name, title, description, status, slug: slugify(title, { lower: true }) },
      // { new: true }
    );
    res.json({ status: true, message: "List", data: updatedCaseStudy });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a case study by ID
export const deleteCaseStudy = async (req, res) => {
  try {
    await CaseStudy.findByIdAndRemove(req.params.id);
    res.json({ message: "Case study deleted", status: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


