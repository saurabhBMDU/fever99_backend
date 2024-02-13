import Service from '../Model/serviceModel.js';
import Insurence from '../Model/insurenceModel.js'
import slugify from "slugify";

// Create a new service
export const createService = async (req, res) => {
  const image = req.filename
  const userId = req.user

  try {
    const { name, description, price, pinCode, keyFeture, about,   } = req.body;
    const newService = new Service({ userId, name, description, price, image, pinCode, keyFeture: JSON.parse(keyFeture), about, slug: slugify(name, { lower: true }) });
    await newService.save();
    res.json({ message: 'Service created successfully', service: newService, status: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create service', status: false });
  }
};

// Create a new Insurence
export const createInsurence = async (req, res) => {
  const userId = req.user

  try {
    const {  mobile, name,age, gender, email, state, district, city, address, comment, famelymember } = req.body;
    const newInsurence = await Insurence.create({userId, mobile, name,age, gender, email, state, district, city, address, comment, famelymember });
    res.json({ message: 'Insurence created successfully', service: newInsurence, status: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create insurence', status: false });
  }
}; 

export const getAllInsurence = async (req, res) => {
  const { page = 1, limit = 24 } = req.query;
  const skip = (page - 1) * limit;

  try {
    const services = await Insurence.find()
      .skip(skip)
      .limit(parseInt(limit));

    const totalServices = await Insurence.countDocuments();

    res.json({
      data: services,
      message: 'All Insurence',
      status: true,
      currentPage: parseInt(page),
      totalRecord: totalServices,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Insurence', status: false });
  }
};

// Get all services
export const getAllServices = async (req, res) => {
  const { page = 1, limit = 24 } = req.query;
  const skip = (page - 1) * limit;

  try {
    const services = await Service.find()
      .skip(skip)
      .limit(parseInt(limit));

    const totalServices = await Service.countDocuments();

    res.json({
      data: services,
      message: 'All Services',
      status: true,
      currentPage: parseInt(page),
      totalRecord: totalServices,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch services', status: false });
  }
};


// Get a service by ID
export const getServiceById = async (req, res) => {
  try {
    const serviceId = req.params.id;
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ error: 'Service not found', status: false });
    }
    res.json({ data: service, status: true, message: 'Service Details' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch service' });
  }
};

export const getServiceBySlug = async (req, res) => {
  try {
    const slug = req.params.slug;
    const service = await Service.findOne({ slug: slug });
    if (!service) {
      return res.status(404).json({ error: 'Service not found', status: false });
    }
    res.json({ data: service, status: true, message: 'Service Details' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch service' });
  }
};

// Update a service by ID
export const updateServiceById = async (req, res) => {
  const image = req.filename
  const userId = req.user
  try {
    const serviceId = req.params.id;
    const { name, description, price, status, pinCode, keyFeture, about } = req.body;
    const [, jsonValue] = keyFeture;
    let updatedKeyFeture = JSON.parse(jsonValue)
    let updatePin = []

    if (pinCode) {
      updatePin = pinCode[0].split(',')
    }
    // const updatedPinCode = pinCode
    // console.log(updatedPinCode)
    // return false
    const updatedService = await Service.findByIdAndUpdate(
      serviceId,
      { name, description, price, image, status, pinCode: updatePin, keyFeture: updatedKeyFeture, about, slug: slugify(name, { lower: true }) },
      { new: true }
    );
    if (!updatedService) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json({ message: 'Service updated successfully', service: updatedService, status: true });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Failed to update service', status: false });
  }
};

// Delete a service by ID
export const deleteServiceById = async (req, res) => {
  try {
    const serviceId = req.params.id;
    const deletedService = await Service.findByIdAndDelete(serviceId);
    if (!deletedService) {
      return res.status(404).json({ error: 'Service not found', status: false });
    }
    res.json({ message: 'Service deleted successfully', status: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete service', status: false });
  }
};
