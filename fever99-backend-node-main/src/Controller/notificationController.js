
import notificationService from '../Services/notificationService.js'

async function createNotification(req, res) {
  try {
    const userId = req.user
    const { title, message } = req.body;
    const notification = await notificationService.createNotification({ title, message, userId });
    res.json({ status: true, message: 'Notification Created' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function getNotificationsByUser(req, res) {
  try {
    const userId = req.user;
    const notifications = await notificationService.getNotificationsByUser(userId);
    res.json({ data: notifications, status: true, message: 'Notification List' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function markNotificationAsRead(req, res) {
  try {
    const notificationId = req.params.id;
    const notification = await notificationService.markNotificationAsRead(notificationId);
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    res.json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export default {
  createNotification,
  getNotificationsByUser,
  markNotificationAsRead
}