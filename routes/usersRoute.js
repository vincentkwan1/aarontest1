import express from "express";
import {
    getRegister, 
    postRegister,
    getLogin,
    postLogin,
    getLogout,
} from "../controllers/userController.js"
const router = express.Router()

router.route("/register").get(getRegister).post(postRegister);
router.route("/login").get(getLogin).post(postLogin);
router.route("/logout").get(getLogout);
export default router;