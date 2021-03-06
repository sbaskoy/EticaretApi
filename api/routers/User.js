
const express = require("express");

const { index, create, update, remove, login, resetPassword } = require("../controllers/User");

const validate = require("../middlewares/validate");
const autheticateToken = require("../middlewares/authenticate");
const idChecker = require("../middlewares/idChecker");
const { createValidation, updateValidation, loginValidation, resetValidation } = require("../validations/User");

const router = express.Router();

router.get("/", autheticateToken, index);
router.get("/:id", autheticateToken, idChecker, index);
router.post("/", autheticateToken, validate(createValidation), create);
router.patch("/:id", autheticateToken, idChecker, validate(updateValidation), update);
router.delete("/:id", autheticateToken, idChecker, remove);
router.post("/login", validate(loginValidation), login);
router.post("/reset-password", validate(resetValidation), resetPassword);


module.exports = router;