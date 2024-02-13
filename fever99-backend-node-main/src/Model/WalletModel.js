import mongoose from "mongoose";

const { Schema } = mongoose;

// Create a wallet schema
const walletSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the User model (assuming you have a User model defined)
    balance: { type: Number, default: 0 }, // Wallet balance, default is 0
    transactions: [
      {
        type: { type: String, required: true }, // Transaction type, e.g., 'credit' or 'debit'
        amount: { type: Number, required: true }, // Transaction amount
        message: {type: String, default: null},
        timestamp: { type: Date, default: Date.now }, // Transaction timestamp
      },
    ],
  },
  { collection: "wallets" },
  {
    timestamps: true,
  }
);

walletSchema.methods.addTransaction = function (type, amount, message) {
  this.transactions.push({
    type: type,
    amount: amount,
    message: message
  });

  if (type === "credit") {
    this.balance += amount;
  } else if (type === "debit") {
    this.balance -= amount;
  }

  return this.save();
};

// Create a wallet model based on the walletSchema
const Wallet = mongoose.model("Wallet", walletSchema);

export default Wallet;
