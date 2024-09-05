const express = require("express");
const router = express.Router();
const {isLoginUser} = require("../../middleware/auth");

const {createDisposisi, getDisposisi} = require("../controllers/disposisi");

router.post("/", isLoginUser, createDisposisi);

router.get("/", isLoginUser, getDisposisi);

module.exports = router;
