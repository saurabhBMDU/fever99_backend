import Wallet from "../Model/WalletModel.js";

// Create a new wallet
export const createWallet = async (user, balance) => {
  try {
    const newWallet = new Wallet({ user, balance });
    const savedWallet = await newWallet.save();
    return savedWallet;
  } catch (error) {
    throw new Error("Failed to create wallet");
  }
};

// Get all wallets
export const getAllWallets = async () => {
  try {
    const wallets = await Wallet.find();
    return wallets;
  } catch (error) {
    throw new Error("Failed to fetch wallets");
  }
};

// Get a wallet by ID
export const getWalletById = async (walletId) => {
  try {
    const wallet = await Wallet.findById(walletId);
    if (!wallet) {
      throw new Error("Wallet not found");
    }
    return wallet;
  } catch (error) {
    throw new Error("Failed to fetch wallet");
  }
};

export const getWalletByUserId = async (userId) => {
  try {
    const wallet = await Wallet.findOne({ user: userId });
    if (!wallet) {
      throw new Error("Wallet not found");
    }
    return wallet;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch wallet");
  }
};

export const getLatestTransaction = async (userId) => {
  try {
    const wallet = await Wallet.findOne({ user: userId });

    if (!wallet) {
      throw new Error('Wallet not found');
    }

    // Sort the transactions array in descending order based on timestamp
    wallet.transactions.sort((a, b) => b.timestamp - a.timestamp);

    // Get the latest transaction (first element in the sorted array)
    const latestTransaction = wallet.transactions;
    // console.log(wallet)
    return latestTransaction;
  } catch (error) {
    console.error('Error getting latest transaction:');
    throw error;
  }
};

// Update a wallet by ID
export const updateWalletByUserId = async (userId, amount, creditType, message) => {
  try {
    // Find the user's wallet
    const wallet = await Wallet.findOne({ user: userId });
    if (wallet) {
      wallet.addTransaction(creditType, amount, message);
      // throw new Error("Wallet not found");
    }
    // Add the new amount to the old balance
    // wallet.balance += parseInt(amountToAdd);




    // Save the updated wallet
    // const updatedWallet = await wallet.save();

    return wallet;
  } catch (error) {
    console.log(error)
    throw new Error("Failed to update wallet");
  }
};

// Update a wallet by ID
export const subtractWalletByUserId = async (userId, amountToAdd) => {
  try {
    // Find the user's wallet
    const wallet = await Wallet.findOne({ user: userId });
    if (!wallet) {
      throw new Error("Wallet not found");
    }
    // Add the new amount to the old balance
    wallet.balance -= parseInt(amountToAdd);
    // wallet.transactions = 

    // Save the updated wallet
    const updatedWallet = await wallet.save();

    return updatedWallet;
  } catch (error) {
    throw new Error("Failed to update wallet");
  }
};

// Delete a wallet by ID
export const deleteWalletById = async (walletId) => {
  try {
    const wallet = await Wallet.findByIdAndDelete(walletId);
    if (!wallet) {
      throw new Error("Wallet not found");
    }
  } catch (error) {
    throw new Error("Failed to delete wallet");
  }
};
