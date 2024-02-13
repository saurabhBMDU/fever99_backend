import Team from '../Model/team.js'


// Create a new team member
export const createTeamMember = async (req, res) => {
  const { name, role, twitter, about, facebook, linkedin, instagram, type, status } = req.body;
  const userId = req.user;
  const image = req.filename
  try {
    const teamMember = new Team({
      userId,
      image,
      name,
      role,
      twitter,
      facebook,
      linkedin,
      instagram,
      about,
      type,
      status
    });
    await teamMember.save();
    res.status(200).json({ status: true, messag: 'team list', data: teamMember });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all team members
export const getAllTeamMembers = async (req, res) => {
  try {
    const teamMembers = await Team.find();
    res.status(200).json({ status: true, message: 'list', data: teamMembers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a specific team member by ID
export const getTeamMemberById = async (req, res) => {
  try {
    const teamMember = await Team.findById(req.params.id);
    if (!teamMember) {
      return res.status(404).json({ error: 'Team member not found' });
    }
    res.status(200).json(teamMember);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a team member by ID
export const updateTeamMember = async (req, res) => {
  const { name, role, twitter, facebook, linkedin, instagram, about, type, status } = req.body;
  const userId = req.user;
  const image = req.filename
  try {
    const teamMember = await Team.findByIdAndUpdate(req.params.id, { name, role, twitter, facebook, linkedin, about, instagram, type, status, image }, {
      new: true,
    });
    if (!teamMember) {
      return res.status(404).json({ error: 'Team member not found' });
    }
    res.status(200).json(teamMember);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a team member by ID
export const deleteTeamMember = async (req, res) => {
  try {
    const teamMember = await Team.findByIdAndRemove(req.params.id);
    if (!teamMember) {
      return res.status(404).json({ error: 'Team member not found' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
