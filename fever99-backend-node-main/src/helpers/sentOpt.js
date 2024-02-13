import fetch  from 'node-fetch'

const url = 'https://tocom.cloud/Tocom/sms';

export const sendForgotPassword = async (req, otp) => {
    const data = {
        msisdn: req.mobile,
        campaignId: '90018519',
        vendorKey: 'dr.mukesh_jain',
        dynamicAttributes: [
          {
            attributeName: 'OTP',
            attributeValue: otp,
          },
        ],
      };
      
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const response = res.json()

      return response
}

export const registerOtp = async (mobile, otp) => {
    const data = {
        msisdn: mobile,
        campaignId: '90018537',
        vendorKey: 'dr.mukesh_jain',
        dynamicAttributes: [
          {
            attributeName: 'OTP',
            attributeValue: otp,
          },
        ],
      };
      
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const response = res.json()

      return response
}

export const generateSixDigitotp = async () => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp.toString();
}
