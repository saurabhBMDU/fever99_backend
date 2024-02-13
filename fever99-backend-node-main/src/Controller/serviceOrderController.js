import ServiceOrder from "../Model/ServiceOrder.js";
import Service from "../Model/serviceModel.js"

export const createServiceOrder = async (req, res) => {
  const { serviceId, customerName, serviceName, amount, date, time, mobile, age, gender, medicalProblem, state, city, pin_code } = req.body;
  const userId = req.user;


  try {
    const newServiceOrder = await ServiceOrder.create({
      userId: userId,
      serviceId: serviceId,
      customerName: customerName,
      serviceName: serviceName,
      amount: amount,
      requestDate: date,
      age: age,
      gender: gender,
      medicalProblem: medicalProblem,
      mobile: mobile,
      requestTime: time,
      status: "pending",
      state: state,
      city: city, 
      pin_code: pin_code
    });

    const service = await Service.findById(serviceId);

    if(service && service.pinCode && !service.pinCode.includes(pin_code)) {
      return res.status(201).json({ data: newServiceOrder,status: true, message: 'The service is currently unavailable in your selected location. We will be available there soon.' });
    }

    res.status(201).json({ data: newServiceOrder, status: true, message: 'We will call you shortly. Thank you for trusting on us with your health.' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to create service order" });
  }
};

export const getServiceOrdersByUserId = async (req, res) => {
  const userId = req.user;
  const role = req.role;
  const page = parseInt(req.query.page) || 1;
  const perPage = 10;

  try {
    let serviceOrders;

    const query = role === 'CORDINATOR' ? {} : { userId };

    const totalServiceOrders = await ServiceOrder.countDocuments(query);

    // Calculate the number of pages
    const totalPages = Math.ceil(totalServiceOrders / perPage);

    // Calculate the number of records to skip
    const skip = (page - 1) * perPage;

    serviceOrders = await ServiceOrder.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(perPage);

    res.json({
      data: serviceOrders,
      page,
      totalPages,
      totalRecords: totalServiceOrders,
      status: true,
      message: 'Order List',
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch service orders' });
  }
};



export const getServiceOrder = async (req, res) => {
  try {
    const serviceOrder = await ServiceOrder.findById(req.params.id);
    res.json(serviceOrder);
  } catch (error) {
    res.status(404).json({ error: "Service order not found" });
  }
};

export const updateServiceOrder = async (req, res) => {
  try {
    const updatedServiceOrder = await ServiceOrder.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    res.json({ status: true, message: 'Status updated successfully!' });
  } catch (error) {
    res.status(500).json({ error: "Failed to update service order" });
  }
};

export const deleteServiceOrder = async (req, res) => {
  try {
    await ServiceOrder.findByIdAndDelete(req.params.id);
    res.json({ message: "Service order deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete service order" });
  }
};
