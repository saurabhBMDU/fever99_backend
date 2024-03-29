// models/CCavenueResponse.js
import mongoose from 'mongoose';

const ccavenueResponseSchema = new mongoose.Schema({
  order_id: String,
  tracking_id: String,
  bank_ref_no: String,
  order_status: String,
  failure_message: String,
  payment_mode: String,
  card_name: String,
  status_code: String,
  status_message: String,
  currency: String,
  amount: String,
  billing_name: String,
  billing_address: String,
  billing_city: String,
  billing_state: String,
  billing_zip: String,
  billing_country: String,
  billing_tel: String,
  billing_email: String,
  delivery_name: String,
  delivery_address: String,
  delivery_city: String,
  delivery_state: String,
  delivery_zip: String,
  delivery_country: String,
  delivery_tel: String,
  merchant_param1: String,
  merchant_param2: String,
  merchant_param3: String,
  merchant_param4: String,
  merchant_param5: String,
  vault: String,
  offer_type: String,
  offer_code: String,
  discount_value: String,
  mer_amount: String,
  eci_value: String,
  retry: String,
  response_code: String,
  billing_notes: String,
  trans_date: String,
  bin_country: String,
});

const CCavenueResponse = mongoose.model('CCavenueResponse', ccavenueResponseSchema);

export default CCavenueResponse;
