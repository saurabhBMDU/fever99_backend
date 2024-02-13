export const generateReferralCode = async () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const codeLength = 6;

  let referralCode = "";
  for (let i = 0; i < codeLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    referralCode += characters[randomIndex];
  }

  return referralCode;
};
