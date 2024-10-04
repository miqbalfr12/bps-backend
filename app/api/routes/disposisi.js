const express = require("express");
const router = express.Router();
const {isLoginUser} = require("../../middleware/auth");

const {createDisposisi, getDisposisi, tambahCatatan} = require("../controllers/disposisi");

router.post("/", isLoginUser, createDisposisi);

router.get("/", isLoginUser, getDisposisi);
router.post("/catatan", isLoginUser, tambahCatatan);

module.exports = router;
