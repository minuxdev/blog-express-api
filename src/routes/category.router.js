import express from "express";
import {
  createCategory,
  getCategories,
} from "../controllers/category.controller.js";

const router = express.Router();

router.route("/").get(getCategories).post(createCategory);

export default router;
