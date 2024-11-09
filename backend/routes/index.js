const express = require("express");
const router  = express.Router();
const userRouter = require("../routes/user")
const accountRouter = require("../routes/account")

router.use("/user", userRouter)
router.use("/account", accountRouter)

module.exports = router