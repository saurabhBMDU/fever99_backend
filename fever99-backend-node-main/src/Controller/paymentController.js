import stripe from "stripe";
// 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

// sk_test_51NtpjXSB14q2spb2o1ZJ3qDxTWOStNEDtgg3e7X3yTgj4uJ9GVq5esVq3TuycFU7aPq6GLogXDQEAE1Xb0Ys64y200jD4m5iIE

const stripeInstance = new stripe('sk_test_51NtpjXSB14q2spb2o1ZJ3qDxTWOStNEDtgg3e7X3yTgj4uJ9GVq5esVq3TuycFU7aPq6GLogXDQEAE1Xb0Ys64y200jD4m5iIE');


export const createStripeSession = async (req, res) => {
  const { amount } = req.body;
  try {
    const session = await stripeInstance.checkout.sessions.create({
      // payment_method_types: ['card', 'upi', 'netbanking', 'wallet'], // Add the desired payment methods
      line_items: [{
        price_data: {
          currency: 'inr',
          product_data: {
            name: 'Add To Wallet',
          },
          unit_amount: amount * 100,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `https://www.fever99.com/success`,
      cancel_url: 'https://www.fever99.com/cancel',
    });

    const { id } = session;

    // Send the session object as a JSON response
    res.json({ sessionId: id, message: 'Payment Session Created', status: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create Stripe session' });
  }
};

export const StripeSetupIntent = async (req, res) => {
  // let customersList = await stripeInstance.customers.list();
  // console.log(customersList, "customersList");

  const customer = await stripeInstance.customers.create();
  const ephemeralKey = await stripeInstance.ephemeralKeys.create(
    { customer: customer.id },
    { apiVersion: '2022-08-01' }
  );
  const setupIntent = await stripeInstance.paymentIntents.create({
    amount: req.body.amount * 100,
    currency: 'inr',
    customer: customer.id,
    payment_method_types: ['card'],
  });
  const response = {
    setupIntent: setupIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customer.id
  }

  res.json(response)
}


export const receiveStatus = async (req, res) => {
  const { sessionId } = req.query;
  try {
    // Retrieve the session from Stripe using the session ID
    const session = await stripeInstance.checkout.sessions.retrieve(sessionId);

    // Access the payment status from the session object
    const paymentStatus = session.payment_status;

    const { payment_status, amount_total } = session

    // You can use paymentStatus to determine the payment outcome
    res.json({ status: true, message: 'Payment Status', data: { payment_status, amount_total } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving payment status' });
  }
}


export const makePayment = async (req, res) => {
  try {
    const paymentIntent = await stripeInstance.paymentIntents.create({
      amount: req.body.amount,
      currency: 'usd',
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};