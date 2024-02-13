import Prescription from '../Model/Prescription.js'

// Create a new prescription
export const createPrescription = async (req, res) => {
  try {
    const doctorId = req.user;
    const { appointmentId, patientId, symptoms, diagnosis, medicine, investigation, notes, pastHistory, surgicalHistory, personalHistory, drugAllergy } = req.body
    const prescription = new Prescription({ doctorId, patientId, appointmentId, symptoms, diagnosis, medicine, investigation, notes, pastHistory, surgicalHistory, personalHistory, drugAllergy });
    await prescription.save();
    res.status(200).json({ status: true, message: 'Prescription Added', data: prescription });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal Server Error', status: false });
  }
};

// Get all prescriptions
export const getAllPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find();
    res.status(200).json(prescriptions);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get a specific prescription by ID
export const getPrescriptionById = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);
    if (!prescription) {
      return res.status(404).json({ error: 'Prescription not found' });
    }
    res.status(200).json(prescription);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update a prescription by ID
export const updatePrescription = async (req, res) => {
  try {
    const { symptoms, diagnosis, medicine, investigation, notes, pastHistory, surgicalHistory, personalHistory, drugAllergy } = req.body
    const prescription = await Prescription.findByIdAndUpdate(
      req.params.id,
      { symptoms, diagnosis, medicine, investigation, notes, pastHistory, surgicalHistory, personalHistory, drugAllergy },
      { new: true }
    );
    if (!prescription) {
      return res.status(404).json({ error: 'Prescription not found' });
    }
    res.status(200).json({ data: prescription, status: true, message: 'Prescription Updated' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete a prescription by ID
export const deletePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findByIdAndRemove(req.params.id);
    if (!prescription) {
      return res.status(404).json({ error: 'Prescription not found' });
    }
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
