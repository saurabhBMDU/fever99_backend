import UserExtraDetails from '../Model/userDetailsModel.js'

// Create user extra details
export const createUserExtraDetails = async (userExtraDetailsData) => {
  try {
    const userExtraDetails = new UserExtraDetails(userExtraDetailsData);
    const savedUserExtraDetails = await userExtraDetails.save();
    return savedUserExtraDetails;
  } catch (error) {
    throw error;
  }
};

// Get user extra details by user ID
export const getUserExtraDetailsByUserId = async (userId) => {
  try {
    const userExtraDetails = await UserExtraDetails.findOne({ userId });
    return userExtraDetails;
  } catch (error) {
    throw error;
  }
};

// Update user extra details by user ID
export const updateUserExtraDetailsByUserId = async (userId, updatedData) => {
  try {
    const record = await UserExtraDetails.findOne({ userId });

    if (!record) {
      await createUserExtraDetails({ ...updatedData, userId: userId })
      return 'record created'
    }
    const updatedUserExtraDetails = await UserExtraDetails.findOneAndUpdate(
      { userId },
      updatedData,
      { new: true }
    );
    return updatedUserExtraDetails;
  } catch (error) {
    throw error;
  }
};

// Delete user extra details by user ID
export const deleteUserExtraDetailsByUserId = async (userId) => {
  try {
    const deletedUserExtraDetails = await UserExtraDetails.findOneAndDelete({ userId });
    return deletedUserExtraDetails;
  } catch (error) {
    throw error;
  }
};

// module.exports = {
//   createUserExtraDetails,
//   getUserExtraDetailsByUserId,
//   updateUserExtraDetailsByUserId,
//   deleteUserExtraDetailsByUserId,
// };
