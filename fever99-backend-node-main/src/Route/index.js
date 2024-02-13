import express from "express";
import { Register as DoctorRegister } from "../Controller/AuthController/DoctorAuth.js";
import { Register as ExpertRegister, getFranchiseById, updateFranchise } from "../Controller/AuthController/ExpertAuth.js";
import { login } from "../Controller/AuthController/LoginController.js";
import { UserRequest, UserLoginRequest } from "../RequestValidator/UserRequest.js";
import authMiddleware from "../RequestValidator/authMiddleware.js";
import { getWallet, setWallet } from "../Controller/walletController.js";
import { usersList, userActivateDeactivateById, ChangePassword, updatePinStatsStatus, DeleteUserDatas } from '../Controller/masterController.js'
import { getDoctor, updateDoctorProfile, getDoctorprofile, updateDoctorProfileByAdmin, getDoctorByIdReport, getDoctorsForApp } from "../Controller/doctorController.js";
import { createTeamMember, getAllTeamMembers, getTeamMemberById, updateTeamMember, deleteTeamMember } from '../Controller/teamController.js';
import {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  deleteAppointmentById,
  getAppointmentByDoctorId,
  getAppointmentByUserId,
  updateAppointmentHistory,
  updateAppointmentCallStatus,
  createFlowwUp
} from "../Controller/appointmentController.js";
import { encryptData, DecryptData, initiateWalletRecharge, ccAvenueRequestHandler, ccAvenueResponseHandler } from "../Controller/CCAvenueController.js"

import {
  createInsurence,
  getAllInsurence,
  createService,
  getAllServices,
  getServiceById,
  updateServiceById,
  deleteServiceById,
  getServiceBySlug
} from "../Controller/serviceController.js";

import {
  createServiceOrder,
  getServiceOrder,
  updateServiceOrder,
  deleteServiceOrder,
  getServiceOrdersByUserId
} from "../Controller/serviceOrderController.js";

import { createRaiseComplaint, getAllRaiseComplaints, updateComplent } from '../Controller/ComplaintController.js'

import medicineController from '../Controller/medicineController.js'

import { createCaseStudy, getAllCaseStudies, updateCaseStudy, deleteCaseStudy, getCaseStudiesById, getCaseStudiesBySlug } from '../Controller/caseStudyController.js'

import { register, cordinatorRegister, editCordinator } from "../Controller/AuthController/UserAuth.js";
import { getReferalUser } from "../Controller/referalController.js"
import { makePayment, createStripeSession, receiveStatus, StripeSetupIntent } from '../Controller/paymentController.js'

import multer from "multer";
import { storage, storeFiles } from '../Services/fileUpload.js'
import { createTestimonial, getAllTestimonials, getTestimonialById, updateTestimonial, deleteTestimonial } from '../Controller/testimonialController.js'

import { dashboard, uploadFiles, updateUser, getEarnings, getAdminEarnings } from '../Controller/masterController.js'
import { createPrescription, getAllPrescriptions, getPrescriptionById, updatePrescription, deletePrescription } from '../Controller/prescriptionController.js'

import { generatePrescriptin } from '../Controller/generatePrescription.js'
import { generatePrescriptinById } from '../Controller/GeneratePrescriptionById.js'
import { getAllStateCities, createStateCity } from '../Controller/stateCityController.js';
import { createFranchiseRequest, getAllFranchiseRequests } from '../Controller/franchiseRequestController.js'
import careerController from '../Controller/careerController.js'
import notificationController from '../Controller/notificationController.js'
import { updateUserAvaliableStatus, notifyUsersForMeetingCreation } from "../Controller/masterController.js"
import { checkAndRegisterFcmToken, notifyUsers } from "../Controller/userController.js";
import { GenerateToken } from "../Controller/AgoraController.js";
import { requestForgotPassword, resetPassword, verifyAndUpdatePassword, tempempmobile } from "../Controller/AuthController/ForgotPassword.js";
const router = express.Router();

const upload = multer({ storage: storage, limits: { fileSize: 1024 * 1024 * 10 } });
const extraUpls = multer({ storage: storeFiles, limits: { fileSize: 1024 * 1024 * 10 } });

router.put('/update-user-status/:id', authMiddleware, userActivateDeactivateById)
router.put('/update-user-avaliable/:id', authMiddleware, updateUserAvaliableStatus)
router.put('/password-change', authMiddleware, ChangePassword);
router.put('/doctor-pin/:id', authMiddleware, updatePinStatsStatus)

router.post("/e-clinic-request", createFranchiseRequest);

// Get all franchise requests
router.get("/e-clinic-request", getAllFranchiseRequests);

router.post('/forgotpassword', requestForgotPassword);
router.post('/validate-otp', verifyAndUpdatePassword);
router.post('/reset-forgotpassword', resetPassword);
router.post('/temp-register', tempempmobile)

router.post('/cc-encript', authMiddleware, encryptData)
// router.post('/handle-response', DecryptData)

router.post("/agora-token-generate",authMiddleware, GenerateToken)

router.get('/prescription/:id', generatePrescriptin);
router.get('/prescription-by-id/:id', generatePrescriptinById);

router.post("/file-upload", authMiddleware, upload.single('file'), uploadFiles)
// router.post("/test-file-upload", extraUpls.fields([{ name: 'image', maxCount: 1 }, { name: 'mou', maxCount: 1 }]), uploadFiles)

router.post('/raise-complaints', authMiddleware, createRaiseComplaint);
router.get('/raise-complaints', authMiddleware, getAllRaiseComplaints);
router.put('/raise-complaints/:id', authMiddleware, updateComplent);

router.post("/login", UserLoginRequest, login);
router.post("/doctor/register", UserRequest, authMiddleware, extraUpls.fields([{ name: 'image', maxCount: 1 }, { name: 'mou', maxCount: 1 }]), DoctorRegister);
router.put('/doctor/update-by-admin/:id', authMiddleware, extraUpls.fields([{ name: 'image', maxCount: 1 }, { name: 'mou', maxCount: 1 }]), updateDoctorProfileByAdmin)
router.get('/doctor/report/:id', authMiddleware, getDoctorByIdReport)
router.get('/franchise/report/:id', authMiddleware, getDoctorByIdReport)
router.get("/doctor", authMiddleware, getDoctor);
router.get("/doctorForApp", authMiddleware, getDoctorsForApp);
router.put("/doctor/update", authMiddleware, upload.single('image'), updateDoctorProfile)
router.get('/doctor/profile', authMiddleware, getDoctorprofile)
router.post("/expert/register", authMiddleware, extraUpls.fields([{ name: 'image', maxCount: 1 }, { name: 'licence', maxCount: 1 }, { name: 'aadhar_card', maxCount: 1 }, { name: 'pan', maxCount: 1 }]), ExpertRegister);
router.put("/expert/update/:id", authMiddleware, extraUpls.fields([{ name: 'image', maxCount: 1 }, { name: 'licence', maxCount: 1 }, { name: 'aadhar_card', maxCount: 1 }, { name: 'pan', maxCount: 1 }]), updateFranchise);
router.get('/expert/getbyid/:id', authMiddleware, getFranchiseById);
router.put('/profile/update', authMiddleware, updateUser);
router.get('/earnings', authMiddleware, getEarnings);
router.get('/admin-earning', authMiddleware, getAdminEarnings)


// Create a new prescription
router.post('/prescriptions', authMiddleware, createPrescription);

// Get all prescriptions
router.get('/prescriptions', authMiddleware, getAllPrescriptions);

// Get a specific prescription by ID
router.get('/prescriptions/:id', authMiddleware, getPrescriptionById);

// Update a prescription by ID
router.put('/prescriptions/:id', authMiddleware, updatePrescription);

// Delete a prescription by ID
router.delete('/prescriptions/:id', authMiddleware, deletePrescription);

router.get('/dashbord', authMiddleware, dashboard)

router.post("/user/register", UserRequest, register);
router.post("/cordinator/register", UserRequest, cordinatorRegister)
router.put('/user/update/:id', authMiddleware, editCordinator)

router.post('/checkout/payment', makePayment);
router.post('/stripe/session-id', createStripeSession);
router.get('/stripe/payment-status', receiveStatus)
router.post('/stripe-setup-intent', StripeSetupIntent);

router.get("/get/wallet", authMiddleware, getWallet);

router.post("/add/wallet", authMiddleware, setWallet);

router.get('/users/:role', authMiddleware, usersList);

router.post("/notifyUsersForMeetingCreation", authMiddleware, notifyUsersForMeetingCreation);

// Create a new appointment
router.post("/appointments", authMiddleware, createAppointment);

// Get all appointments
// router.get('/appointments',authMiddleware, getAllAppointments);
router.get("/appointments", authMiddleware, getAppointmentByUserId);

router.put("/add-appointment-history/:id", authMiddleware, updateAppointmentHistory)

// Get an appointment by ID
router.get("/appointments/:id", authMiddleware, getAppointmentById);
// Update an appointment status by ID
router.put("/appointments/:id", authMiddleware, updateAppointmentStatus);
router.put("/appointments-call-status/:id", authMiddleware, updateAppointmentCallStatus);
router.put("/appointments-floow-up/:id", authMiddleware, createFlowwUp)

// Delete an appointment by ID
router.delete("/appointments/:id", authMiddleware, deleteAppointmentById);

router.get('/expert/referal-used-user', authMiddleware, getReferalUser);

// Create a new insurence
router.post('/add-insurence-service', authMiddleware, createInsurence);
router.get('/add-insurence-service', authMiddleware, getAllInsurence);


// Create a new service
router.post('/services', authMiddleware, upload.single('image'), createService);

// Get all services
router.get('/services', getAllServices);

// Get a service by ID
router.get('/services/:id', getServiceById);
router.get('/service/:slug', getServiceBySlug);

// Update a service by ID
router.put('/services/:id', authMiddleware, upload.single('image'), updateServiceById);

// Delete a service by ID
router.delete('/services/:id', authMiddleware, deleteServiceById);

router.post("/service-order", authMiddleware, createServiceOrder);
router.get("/service-order/:id", authMiddleware, getServiceOrder);
router.get("/service-order", authMiddleware, getServiceOrdersByUserId);
router.put("/service-order/:id", authMiddleware, updateServiceOrder);
// router.delete("/service-order/:id", authMiddleware, deleteServiceOrder);

// Create a new team member
router.post('/team', authMiddleware, upload.single('image'), createTeamMember);

// Get all team members
router.get('/team', getAllTeamMembers);

// Get a specific team member by ID
router.get('/team/:id', authMiddleware, getTeamMemberById);

// Update a team member by ID
router.put('/team/:id', authMiddleware, upload.single('image'), updateTeamMember);

// Delete a team member by ID
router.delete('/team/:id', authMiddleware, deleteTeamMember);

// Create a new testimonial
router.post('/testimonial', authMiddleware, upload.single('image'), createTestimonial);

// Get all testimonials
router.get('/testimonial', getAllTestimonials);

// Get a single testimonial by ID
router.get('/testimonial/:id', authMiddleware, getTestimonialById);

// Update a testimonial by ID
router.put('/testimonial/:id', authMiddleware, upload.single('image'), updateTestimonial);

// Delete a testimonial by ID
router.delete('/testimonial/:id', authMiddleware, deleteTestimonial);

// Create a new case study
router.post('/case-study', authMiddleware, upload.single('image'), createCaseStudy);

// Get all case studies
router.get('/case-study', getAllCaseStudies);

router.get('/case-study/:id', getCaseStudiesById);
router.get('/blog/:slug', getCaseStudiesBySlug);

// Update a case study by ID
router.put('/case-study/:id', authMiddleware, upload.single('image'), updateCaseStudy);

// Delete a case study by ID
router.delete('/case-study/:id', authMiddleware, deleteCaseStudy);


// router.post('/state-city', createStateCity);

// Get all state and city entries
router.get('/state-city', getAllStateCities);

router.post('/career', upload.single('file'), careerController.createCareerApplication);
router.get('/career', careerController.getAllCareerApplications);
router.get('/career:id', careerController.getCareerApplicationById);
router.delete('/career:id', careerController.deleteCareerApplicationById);

router.post('/medicines', medicineController.createMedicine);

// Get all medicine records
router.get('/medicines', medicineController.getAllMedicines);

// Get a specific medicine record by ID
router.get('/medicines/:id', medicineController.getMedicineById);

// Update a medicine record by ID
router.put('/medicines/:id', medicineController.updateMedicine);

// Delete a medicine record by ID
router.delete('/medicines/:id', medicineController.deleteMedicine);

router.post('/notifications', authMiddleware, notificationController.createNotification);

// Get notifications for a specific user
router.get('/notifications', authMiddleware, notificationController.getNotificationsByUser);

// Mark a notification as read
router.put('/notifications/read/:id', authMiddleware, notificationController.markNotificationAsRead);


router.post("/users/checkAndRegisterFcmToken", authMiddleware, checkAndRegisterFcmToken);
router.post("/notifyMeetingUsers", authMiddleware, notifyUsers);



router.post("/users/checkAndRegisterFcmToken", authMiddleware, checkAndRegisterFcmToken);

router.post("/delete/user-datas",authMiddleware, DeleteUserDatas);


export default router;
