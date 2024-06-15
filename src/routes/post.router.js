import express from "express";
import multer from "multer";
import { celebrate, errors, Segments } from "celebrate";
import { db } from "../firebase/firebaseConfigs.js";
import { requestValidation } from "../middlewares/user.middleware.js";
import {
  postSchema,
  paramSchema,
  tokenSchema,
} from "./celebrateSchemas/post.schemas.js";
import { errorHandler } from "../utils/responses.js";
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  commentPost,
} from "../controllers/post.controller.js";

import { Post, Categories, Tags, Comment } from "../models/post.model.js";

const router = express.Router();

// get and create post
router.route("/").get(getPosts).post(
  //celebrate(postSchema),
  requestValidation,
  createPost,
);

// create comment
router.post("/:postID/comments", commentPost);

// crud on post
router
  .route("/:postID")
  .get(getPostById)
  .put(requestValidation, updatePost)
  .delete(requestValidation, deletePost);

// router.use(errors());

// set postID to req object
router.param("postID", async (req, res, next, postID) => {
  try {
    const post = await Post.findOne({
      where: {
        slug: postID,
      },
      include: [Categories, Tags, Comment],
    });

    if (!post)
      return res.status(404).json({
        status: { code: 404, text: "failure" },
        data: null,
        error: { message: "Post not found!" },
      });
    req.postID = post.id;
    req.post = post;

    next();
  } catch (error) {
    errorHandler(res, error);
  }
});

export default router;
