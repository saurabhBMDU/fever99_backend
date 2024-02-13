import RaiseComplaint from "../Model/ComplaintModel.js";

export const createRaiseComplaint = async (req, res) => {
  try {
    const { appointmentId, title, details } = req.body;
    const userId = req.user

    const raiseComplaint = new RaiseComplaint({
      userId,
      appointmentId,
      title,
      details,
    });

    const savedRaiseComplaint = await raiseComplaint.save();
    res.status(201).json({ status: true, message: 'Your Complent Raised', data: savedRaiseComplaint });
  } catch (error) {
    console.error('Error creating RaiseComplaint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAllRaiseComplaints = async (req, res) => {
  const role = req.role;
  const userId = req.user;

  try {
    let raiseComplaints;

    if (role === 'CORDINATOR') {
      // If the user's role is CORDINATOR, display all records
      raiseComplaints = await RaiseComplaint.find().populate('appointmentId').sort({ createdAt: -1 });
    } else {
      // For other roles, display only records matching the userId
      raiseComplaints = await RaiseComplaint.find({ userId: userId }).populate('appointmentId').sort({ createdAt: -1 });
    }

    res.status(200).json({ status: true, message: 'list', data: raiseComplaints });
  } catch (error) {
    console.error('Error fetching RaiseComplaints:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


export const updateComplent = async (req, res) => {
  try {
    const { id } = req.params;
    const { resolution } = req.body;

    // Find the complaint by ID
    const complaint = await RaiseComplaint.findById(id);

    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    // Update resolution and set status to "closed"
    complaint.resolution = resolution;
    complaint.status = 'Closed';

    const updatedComplaint = await complaint.save();

    res.status(200).json({ status: true, message: 'Complent Updated', data: updatedComplaint });

  } catch (error) {
    console.error('Error updating complaint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

