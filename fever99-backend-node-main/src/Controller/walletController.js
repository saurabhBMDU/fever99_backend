import { getWalletByUserId, updateWalletByUserId } from "../Services/walletService.js";

// Get a wallet by ID
export const getWallet = async (req, res) => {
  try {

    const userId = req.user;
    const wallet = await getWalletByUserId(userId);
    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }
    res.json(wallet);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Failed to fetch wallet' });
  }
};

export const setWallet = async (req, res) => {
  const { amount } = req.body
  try {
    const userId = req.user;
    const wallet = await updateWalletByUserId(userId, amount, 'credit', `Rs ${amount} added in your wallet!`)
    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }
    res.json({ wallet: wallet, status: true, message: 'Amount added' });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Failed to add wallet amount' });
  }
}