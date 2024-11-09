const express = require("express");
const mongoose = require("mongoose");
const { authMiddleware } = require("../middleware");
const Account = require("../models/Account");
const accountRouter = express.Router();

//BALANCE ROUTE :- for fetching the current users balance
accountRouter.get("/balance", authMiddleware, async (req, res) => {
  try {
    const account = await Account.findOne({
      userId: req.userId,
    });

    res.status(200).json({
      message: "your account balance is ",
      balance: account.balance,
    });
  } catch (error) {
    res.status(411).json({
      message: "something went wrong",
    });
  }
});

//TRANSFER ROUTE :- for transferring the amount
accountRouter.post("/transfer", authMiddleware, async (req, res) => {
  try {
    // Creating a session
    const session = await mongoose.startSession();

    //Starting the session
    session.startTransaction();

    const { amount , to } = req.body;

    //Fetch amounts within the transaction

    //fetching account of the sender
    const account = await Account.findOne({
      userId: req.userId,
    }).session(session);

    //Checking the account balance is sufficient for the transaction
    if (!account || account.balance < amount) {
      await session.abortTransaction();

      return res.status(400).json({ message: "Insufficient balance" });
    }

    //Checking receivers account is valid or not
    const toAccount = await Account.findOne({ userId: to });

    if (!toAccount) {
      await session.abortTransaction();
      return res.status(400).json({ message: " invalid account" });
    }

    //Perform the transfer
    await Account.updateOne(
      { userId: req.userId },
      { $inc: { balance: -amount } }
    ).session(session);
    await Account.updateOne(
      { userId: to },
      { $inc: { balance: amount } }
    ).session(session);

    //Commit the transaction
    await session.commitTransaction();
    res.status(200).json({ message: "Transfer Successfull" });
  } catch (error) {
    res.status(400).json({ message: " Something went wrong " });
  }
});

module.exports = accountRouter;
