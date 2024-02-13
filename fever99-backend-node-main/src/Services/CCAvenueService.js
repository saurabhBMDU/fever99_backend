import { Configure } from "node-ccavenue";

const ccav = new Configure({
  merchant_id: '3065516',
  working_key: '390C33E417CA22F6F177108F455633C2',
});

export const encrypt = async (order) => {
  return await ccav.getEncryptedOrder(order);
};

export const decrypt = async (encodedData) => {
  const decryptedData = await ccav.redirectResponseToJson(encodedData);

  return {
    data: decryptedData,
    responseCode: decryptedData.order_status,
  };
};