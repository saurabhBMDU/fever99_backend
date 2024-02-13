import Testimonial from "../Model/Testimonial.js";

// Create a new testimonial
export const createTestimonial = async (req, res) => {
  const { name, role, message, status } = req.body;
  const userId = req.user;
  const image = req.filename;

  try {
    const testimonial = new Testimonial({
      userId,
      image,
      name,
      role,
      message,
      status,
    });
    const savedTestimonial = await testimonial.save();
    res.status(200).json({
      status: true,
      message: "list",
      data: savedTestimonial,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all testimonials
export const getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find();
    res.json({ status: true, message: 'list', data: testimonials });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get a single testimonial by ID
export const getTestimonialById = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ error: "Testimonial not found" });
    }
    res.json(testimonial);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Update a testimonial by ID
export const updateTestimonial = async (req, res) => {
  const { name, role, message, status } = req.body;
  const userId = req.user;
  const image = req.filename;

  try {
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      { name, role, message, status, image },
      { new: true }
    );
    if (!testimonial) {
      return res.status(404).json({ error: "Testimonial not found" });
    }
    res.json(testimonial);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Delete a testimonial by ID
export const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndRemove(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ error: "Testimonial not found" });
    }
    res.json({ message: "Testimonial deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
