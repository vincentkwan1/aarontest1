import express from "express";
import {
    getIdeas,
    getAddIdeas,
    postAddIdeas,
    deleteIdeas,
    getEditIdeas,
    putEditIdeas,
} from "../controllers/ideasController.js";
const router = express.Router();

router.route("/").get(getIdeas);
router.route("/:id").delete(deleteIdeas);
router.route("/edit/:id").get(getEditIdeas).put(putEditIdeas);
router.route("/add").get(getAddIdeas).post(postAddIdeas);
export default router;