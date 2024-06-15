import express from "express";
import {
  createCategory,
  getCategories,
  getCategory,
} from "../controllers/category.controller.js";

import { Categories, Post } from "../models/post.model.js";

const router = express.Router();

router.route("/").get(getCategories).post(createCategory);

router.route("/:id").get(getCategory).post();

router.param("id", async (req, res, next, id) => {
  try {
    console.log(id);
    const category = await Categories.findOne({
      where: {
        id: id,
      },
      include: Post,
    });

    req.category = category;
    next();
  } catch (error) {
    return res.status(500).json({
      status: {
        text: "failure",
        code: 500,
      },
      data: null,
      error: {
        message: error.message,
      },
    });
  }
});
export default router;
