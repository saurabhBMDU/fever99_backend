import Medicine from '../Model/medicine.js'

// Create a new medicine record
const createMedicine = async (req, res) => {
  try {
    const medicine = new Medicine(req.body);
    const result = await medicine.save();
    res.status(200).json({ status: true, message: 'Medicine Added' });
  } catch (error) {
    res.status(500).json({ error: 'Error creating medicine record' });
  }
};

// Get all medicine records
const getAllMedicines = async (req, res) => {
  const { page = 1, limit = 10, filter = '' } = req.query;
  const skip = (page - 1) * limit;

  try {
    const query = { name: { $regex: filter, $options: 'i' } };

    const medicines = await Medicine.find(query)
      .sort({ createdAt: -1 }) 
      .skip(skip)
      .limit(parseInt(limit));

    const totalMedicines = await Medicine.countDocuments(query);

    res.json({
      data: medicines,
      status: true,
      message: 'Medicine List',
      totalRecord: totalMedicines,
      currentPage: parseInt(page),
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching medicine records' });
  }
};


// Get a specific medicine record by ID
const getMedicineById = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    res.json(medicine);
  } catch (error) {
    res.status(404).json({ error: 'Medicine record not found' });
  }
};

// Update a medicine record by ID
const updateMedicine = async (req, res) => {
  try {
    const result = await Medicine.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ status: true, message: 'Medicine Updated' });
  } catch (error) {
    res.status(404).json({ error: 'Medicine record not found' });
  }
};

// Delete a medicine record by ID
const deleteMedicine = async (req, res) => {
  try {
    await Medicine.findByIdAndRemove(req.params.id);
    res.status(200).json({ status: true, message: 'Medicine Deleted!' });
  } catch (error) {
    res.status(404).json({ error: 'Medicine record not found' });
  }
};


export default {
  deleteMedicine,
  updateMedicine,
  getMedicineById,
  getAllMedicines,
  createMedicine
}