const express = require("express");
const userRouter = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../config");
const zod = require("zod");
const Account = require("../models/Account");
const { authMiddleware } = require("../middleware");

// Zod signup Schema
const signupSchema = zod.object({
  userName: zod.string(),
  firstName: zod.string(),
  lastName: zod.string(),
  password: zod.string(),
});

// Zod signin Schema
const signinSchema = zod.object({
  userName: zod.string(),
  password: zod.string(),
});

//zod update Schema
const updateBody = zod.object({
  firstName: zod.string().optional(),
  lastName: zod.string().optional(),
  password: zod.string().optional(),
});

//SIGNUP ROUTE :-  for creating a new User
userRouter.post("/signup", async (req, res) => {
  try {
    // checking the inputs using zod by parsing it thorough the zod schema
    const body = req.body;
    const success = signupSchema.safeParse(body);
    if (!success) {
      return res.json({
        message: " Incorrect inputs ",
      });
    }

    // checking  into the database that  username/email is  already present or not
    const user = await User.find({
      userName: body.username,
    });

    if (user._id) {
      return res.json({
        message: "Email alreday taken / Incorrect inputs",
      });
    }

    // Creating a new User
    const dbUser = await User.create({
      firstName: body.firstName,
      lastName: body.lastName,
      password: body.password,
      userName: body.username,
    });
    console.log(dbUser);

    // Creating  account and initalizing it with some amount

    await Account.create({
      userId: dbUser._id,
      balance: 1 + Math.random() * 10000,
    });

    // Creating a JWT token for authentication and authorization

    const token = jwt.sign(
      {
        userId: dbUser._id,
      },
      JWT_SECRET
    );

    // Sending message and token back to the user  in the json format for  furthur authentiction or authorization
    return res.json({
      message: "User created successfully",
      token: token,
    });       
  } catch (error) {
    console.log(error, "error");
    res.status(400).send({ msg: "error in sign-up " });
  }
});

//SIGNIN ROUTE :-  for accessing the application and its features
userRouter.post("/signin", async (req, res) => {
  try {
    // checking the inputs using zod by parsing it thorough the zod schema
    const { success } = signinSchema.safeParse(body);

    if (!success) {
      return res
        .status(400)
        .json({ message: "Email already taken / Incorrect inputs" });
    }

    //Checking into the DB ,is this a existing user or a invalid user

    const user = await User.findOne({
      userName: req.body.userName,
      password: req.body.password,
    });

    if (!user) {
      return res.status(400).json({ message: "user doesn't exist" });
    }

    // Creating a JWT token for authentication and authorization

    const token = jwt.sign(
      {
        userId: user._id,
      },
      JWT_SECRET
    );

    //Sending token back to the user for authentication and authorization
    res.json({ token: token });
    return;
  } catch (error) {
    console.log("error", error);
    res.status(411).send({ msg: "Error while logging in" });
  }
});

//UPDATION ROUTE :- for updating the user Credentials
userRouter.put("/", authMiddleware, async (req, res) => {
  // checking the inputs using zod by parsing it thorough the zod schema
  const { success } = updateBody.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      message: "Error while updating information",
    });
  }

  try {
    //Updating the existing user credentials

    await User.findOneAndUpdate(
      {
        _id: req.userId,
      },
      req.body
    );

    const user = await User.findOne({ _id: req.userId });

    res.status(200).json({
      message: "Updated successfully",
    });
  } catch (error) {
    console.log(error, "error");
    res.status(411).json({
      message: "Error while updating information",
    });
  }
});

//BULK ROUTE :-  for getting all the users from the database on the basis of some filter value
userRouter.get("/bulk", async (req, res) => {
  try {
    //fetching name from query string using req.query
    const filter = req.query.filter || "";

    //getting all the users from the db using filter
    const user = await User.find({
      $or: [
        {
          firstName: {
            $regex: filter,
          },
        },
        {
          lastName: {
            $regex: filter,
          },
        },
      ],
    });

    //Sending all users fetched on the basis of the filter in json format
    res.status(200).json({
      user: user.map((user) => ({
        firstName: user.firstName,
        lastName: user.lastName,
        _id: user._id,
      })),
    });
  } catch (error) {
    console.log("erro", error);
    res.json({ message: "error while filtering users" });
  }
});

module.exports = userRouter;
