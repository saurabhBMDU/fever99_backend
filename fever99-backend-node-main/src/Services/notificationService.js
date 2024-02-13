import Notification from '../Model/notification.js'

export async function createNotification(notificationData) {
  const notification = new Notification(notificationData);
  return await notification.save();
}

export async function getNotificationsByUser(userId) {
  return await Notification.find({ userId })
    .sort({ timestamp: -1 })
    .exec();
}


export async function markNotificationAsRead(notificationId) {
  return await Notification.findByIdAndUpdate(notificationId, { read: true }, { new: true });
}
export default {
  createNotification,
  getNotificationsByUser,
  markNotificationAsRead,
};
