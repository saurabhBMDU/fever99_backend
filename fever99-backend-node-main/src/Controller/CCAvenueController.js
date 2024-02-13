import { encrypt, decrypt } from "../Services/CCAvenueService.js";
import CCavenueResponse from '../Model/CCavenueResponse.js';
import { getWalletByUserId, updateWalletByUserId } from "../Services/walletService.js";
import User from '../Model/UserModel.js'
import Appointment from "../Model/appointmentModel.js";
import { encryptCCAvenue } from "../utils/ccavenueutils.js";
import { config } from "../utils/config.js";
import QueryString from 'qs';

export const encryptData = async (req, res) => {
  const { payload, amount, name } = req.body;
  const userId = req.user;
  console.log('userId', userId)
  const REQUESTED_ORDER = {
    order_id: userId,
    merchant_param1: payload.appointmentId ? payload.appointmentId : '',
    currency: "INR",
    amount: amount,
    redirect_url: encodeURIComponent(
      payload.reidrect_url
    ),
    billing_name: name,
  };


  const data = {
    ...REQUESTED_ORDER,
    payload,
  };

  const encryptedData = await encrypt(data);
  if (encryptedData) {
    res.status(200).json({
      data: encryptedData,
      status: true,
    });
  } else {
    res.status(400).json({
      data: null,
      status: false,
    });
  }
};

export const DecryptData = async (req, res) => {
  const { encResp } = req.body;
  const paymentStatus = await decrypt(encResp);
  // console.log('paymentStatus', paymentStatus)
  const { responseCode, data, } = paymentStatus
  await saveCCavenueResponse(data)
  if (responseCode === "Success") {
    res.redirect(`https://www.fever99.com/payment-response?status=Success&amount=${data.amount}&tracking_id=${data.tracking_id}`);
  } else {
    res.redirect(`https://www.fever99.com/payment-response?status=Fail&amount=${data.amount}`);
  }
};

const saveCCavenueResponse = async (data) => {
  try {
    const ccavenueResponse = new CCavenueResponse(data);
    await ccavenueResponse.save();
    const user = await User.findOne({ _id: data.order_id });
    const { amount, order_status, merchant_param1 } = data

    if (user && user.role === 'FRANCHISE' && order_status === 'Success') {
      await updateWalletByUserId(data.order_id, parseInt(amount), 'credit', `Rs ${amount} added in your wallet!`)
    }

    if (user && user.role === 'PATIENT' && merchant_param1 && order_status === 'Success') {
      const appointment = await Appointment.findById(merchant_param1);
      if (appointment) {
        appointment.paymentStatus = 'Paid';
        await appointment.save()
      }
    }

    // console.log('data', parseInt(amount))
  } catch (error) {
    console.error('Error saving CCavenue response:', error);
  }
}



export const initiateWalletRecharge = async (req, res, next) => {
  try {

    // console.log(req.query)

    // const query = req.query

    console.log(req.body, "asds")

    // const orderObj = await WalletRechargeOrder.findById(req.query.orderId).lean().exec();
    // if (!orderObj)
    //   throw new Error("Order Not Found")






    console.log(req.query, "qweeq")

    const html = `
    
    <html>
    <head>
    
    </head>
    <body>
      <h1>Loading...</h1>
      <form method="POST" id="orderCheckout" name="orderCheckout" action="${config.CCAVENUE_REQUEST_HANDLER_URL}/ccavenueRequestHandler" style="opacity:0">
        <table width="40%" height="100" border='1' align="center">
          <caption>
            <font size="4" color="blue"><b>Integration Kit</b></font>
          </caption>
        </table>
        <table width="40%" height="100" border='1' align="center">
          <tr>
            <td>Parameter Name:</td>
            <td>Parameter Value:</td>
          </tr>
          <tr>
            <td colspan="2">Compulsory information</td>
          </tr>
          <tr>
            <td>Merchant Id</td>
            <td><input type="text" name="merchant_id" id="merchant_id" value="${config.merchantId}" /> </td>
          </tr>
          <tr>
            <td>Order Id</td>
            <td><input type="text" name="order_id" value="${new Date().getTime()}" /></td>
          </tr>
          <tr>
            <td>Currency</td>
            <td><input type="text" name="currency" value="INR" /></td>
          </tr>
          <tr>
            <td>Amount</td>
            <td><input type="text" name="amount" value="${req.query?.amount}" /></td>
          </tr>
          <tr>
            <td>Redirect URL</td>
            <td><input type="text" name="redirect_url"
              value="${config.CCAVENUE_RESPONSE_HANDLER_URL}/ccAvenueResponseHandler" />
            </td>
          </tr>
          <tr>
            <td>Cancel URL</td>
            <td><input type="text" name="cancel_url"
              value="${config.CCAVENUE_RESPONSE_HANDLER_URL}/ccAvenueResponseHandler" />
            </td>
          </tr>
          <tr>
            <td>Language</td>
            <td><input type="text" name="language" id="language" value="EN" /></td>
          </tr>
          <tr>
            <td colspan="2">Billing information(optional):</td>
          </tr>
          <tr>
            <td>Billing Name</td>
            <td><input type="text" name="billing_name" value="" /></td>
          </tr>
          <tr>
            <td>Billing Address:</td>
            <td><input type="text" name="billing_address"
              value="" /></td>
          </tr>
          <tr>
            <td>Billing City:</td>
            <td><input type="text" name="billing_city" value="" /></td>
          </tr>
          <tr>
            <td>Billing State:</td>
            <td><input type="text" name="billing_state" value="" /></td>
          </tr>
          <tr>
            <td>Billing Zip:</td>
            <td><input type="text" name="billing_zip" value="" /></td>
          </tr>
          <tr>
            <td>Billing Country:</td>
            <td><input type="text" name="billing_country" value="" />
            </td>
          </tr>
          <tr>
            <td>Billing Tel:</td>
            <td><input type="text" name="billing_tel" value="" />
            </td>
          </tr>
          <tr>
            <td>Billing Email:</td>
            <td><input type="text" name="billing_email"
              value="jnjasgreen@gmail.com" /></td>
          </tr>
          <tr>
            <td colspan="2">Shipping information(optional):</td>
          </tr>
          <tr>
            <td>Shipping Name</td>
            <td><input type="text" name="delivery_name" value="Sam" />
            </td>
          </tr>
          <tr>
            <td>Shipping Address:</td>
            <td><input type="text" name="delivery_address"
              value="Vile Parle" /></td>
          </tr>
          <tr>
            <td>Shipping City:</td>
            <td><input type="text" name="delivery_city" value="Mumbai" />
            </td>
          </tr>
          <tr>
            <td>Shipping State:</td>
            <td><input type="text" name="delivery_state" value="Maharashtra" />
            </td>
          </tr>
          <tr>
            <td>Shipping Zip:</td>
            <td><input type="text" name="delivery_zip" value="400038" /></td>
          </tr>
          <tr>
            <td>Shipping Country:</td>
            <td><input type="text" name="delivery_country" value="India" />
            </td>
          </tr>
          <tr>
            <td>Shipping Tel:</td>
            <td><input type="text" name="delivery_tel" value="0123456789" />
            </td>
          </tr>
          <tr>
            <td>Merchant Param1</td>
            <td><input type="text" name="merchant_param1"
              value="additional Info." /></td>
          </tr>
          <tr>
            <td>Merchant Param2</td>
            <td><input type="text" name="merchant_param2"
              value="additional Info." /></td>
          </tr>
          <tr>
            <td>Merchant Param3</td>
            <td><input type="text" name="merchant_param3"
              value="additional Info." /></td>
          </tr>
          <tr>
            <td>Merchant Param4</td>
            <td><input type="text" name="merchant_param4"
              value="additional Info." /></td>
          </tr>
          <tr>
            <td>Merchant Param5</td>
            <td><input type="text" name="merchant_param5"
              value="additional Info." /></td>
          </tr>
          <tr>
            <td>Promo Code:</td>
            <td><input type="text" name="promo_code" value=""/></td>
          </tr>
          <tr>
            <td>Customer Id:</td>
            <td><input type="text" name="customer_identifier" value=""/></td>
          </tr>
          <tr>
            <td></td>
            <td><input type="submit" id="submitForm" value="Checkout"></td>
          </tr>
        </table>
      </form>
      <script type="text/javascript">
    window.onload=function(){ 
      window.setTimeout(function() { document.orderCheckout.submit(); }, 5000);
    };
    </script>
    </body>
    </html>`

    console.log("WRUITING HEAD")
    res.writeHead(200, { "Content-Type": "text/html" });
    console.log("WRTING BODY")
    res.write(html);
    console.log("DONE")
    res.end();

  } catch (error) {
    console.error(error)
    next(error)
  }

}


export const ccAvenueRequestHandler = async (req, res, next) => {
  try {
    const workingKey = config.workingKey;//Put in the 32-Bit key shared by CCAvenues.
    const accessCode = config.accessCode;     //Put in the Access Code shared by CCAvenues.

    const body = QueryString.stringify(req.body);
    const encRequest = encryptCCAvenue(body, workingKey);
    const formbody = '<h1>Loading ... ...</h1> <form id="nonseamless" method="post" name="redirect" action="https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction"/> <input type="hidden" id="encRequest" name="encRequest" value="' + encRequest + '"><input type="hidden" name="access_code" id="access_code" value="' + accessCode + '"><script language="javascript">document.redirect.submit();</script></form>';
    // });

    // request.on('end', function () {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write(formbody);
    res.end();
    // });
    return;
  } catch (error) {
    next(error)
  }
}

export const ccAvenueResponseHandler = async (req, res, next) => {
  try {
    console.log("IN WALLET CONTROLLER")
    const workingKey = config.workingKey//Put in the 32-Bit key shared by CCAvenues.

    // request.on('data', function (data) {
    const ccavEncResponse = req.body;
    const ccavPOST = QueryString.parse(ccavEncResponse);
    console.log("PARSED????", ccavPOST)
    const encryption = req.body.encResp;
    console.log("ENC")
    console.log(encryption)
    const ccavResponse = decrypt(encryption, workingKey);
    console.log("CCAVENUE RES")
    console.log(ccavResponse, "CCAVENUE RESPONSE")

    const parsedValue = QueryString.parse(ccavResponse)
    console.log(parsedValue, "PARSED RESPONSE NOW")
    // });

    // let orderObj = await WalletRechargeOrder.findById(parsedValue?.order_id).exec();
    // if (!orderObj)
    //   throw new Error("Invalid Order")


    // let walletCheck = await Wallet.findOne({ userId: orderObj?.userId }).exec();
    // if (!walletCheck) {
    //   let tempObj = {
    //     userId: orderObj?.userId,
    //     lead_wallet_amount: 0,
    //     reserve_wallet_amount: 0
    //   }
    //   await new Wallet(tempObj).save()
    // }


    // await WalletRechargeOrder.findByIdAndUpdate(parsedValue?.order_id, { "paymentObj.paymentResponseObj": parsedValue, "paymentObj.payment_status": order_payment_status.complete }).exec();



    // request.on('end', function () {
    let pData = '';
    pData = '<table border=1 cellspacing=2 cellpadding=2><tr><td>'
    pData = pData + ccavResponse.replace(/=/gi, '</td><td>')
    pData = pData.replace(/&/gi, '</td></tr><tr><td>')
    pData = pData + '</td></tr></table>'
    const htmlcode = `<html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><title>Response Handler</title></head><body>
      <h1>Completing your transaction please wait...</h1>
      </body>
      <script type="text/javascript">
        window.onload=function(){ 
          window.location.href="${config.CCAVENUE_RESET_URL}";
        };
      </script>
    </html>`;
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write(htmlcode);
    res.end();
    return
  } catch (error) {
    next(error)
  }
}