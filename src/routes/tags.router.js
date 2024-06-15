import express from "express";
import { createTag, getTags } from "../controllers/tag.controler.js";

const router = express.Router();

router.route("/").get(getTags).post(createTag);

export default router;
