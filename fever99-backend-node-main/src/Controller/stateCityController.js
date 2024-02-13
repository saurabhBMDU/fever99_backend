import StateCity from '../Model/StateCity.js';

// Create a new state and city entry
export const createStateCity = async (req, res) => {
  try {
    const { state, city } = req.body;
    const newStateCity = new StateCity({ state, city });
    await newStateCity.save();
    res.status(201).json(newStateCity);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all state and city entries
export const getAllStateCities = async (req, res) => {
  try {
    const stateCities = await StateCity.find();
    res.json({ data: stateCities, status: true, message: 'State List' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a state and city entry by ID
export const updateStateCity = async (req, res) => {
  try {
    const { state, city } = req.body;
    const updatedStateCity = await StateCity.findByIdAndUpdate(
      req.params.id,
      { state, city },
      { new: true }
    );
    res.json(updatedStateCity);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a state and city entry by ID
export const deleteStateCity = async (req, res) => {
  try {
    const deletedStateCity = await StateCity.findByIdAndRemove(req.params.id);
    res.json(deletedStateCity);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
