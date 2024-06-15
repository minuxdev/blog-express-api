import { FieldValue } from "firebase-admin/firestore";
import { db } from "../firebase/firebaseConfigs.js";
import { errorHandler } from "../utils/responses.js";
import { Categories, Post, Tags, Comment } from "../models/post.model.js";
import slugify from "slugify";
import { Op } from "sequelize";

// Create
export const createPost = async (req, res) => {
  try {
    let file = null;
    if (req.files[0]) file = await req.files[0].linkUrl;
    const post = await Post.create({
      ...req.body,
      slug: slugify(req.body.title.trim(), { lower: true }),
      thumbnail: file,
    });

    let categories = [];
    let tags = [];

    if (Array.isArray(req.body.categories)) categories = req.body.categories;
    else if (req.body.categories !== undefined)
      categories = [req.body.categories];

    if (Array.isArray(req.body.tags)) tags = req.body.tags;
    else if (req.body.tags !== undefined) tags = [req.body.tags];

    const categoryIds = await Promise.all(
      categories.map(async (cat) =>
        Categories.findOne({ where: { description: cat } }),
      ),
    );

    const tagIds = await Promise.all(
      tags.map(async (tag) => Tags.findOne({ where: { description: tag } })),
    );

    post.addCategories(categoryIds);
    post.addTags(tagIds);

    res.status(201).json({
      status: { code: 201, text: "success" },
      data: post,
      error: null,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

export const commentPost = async (req, res) => {
  try {
    const postID = req.params.postID;
    const post = await Post.findOne({ where: { slug: postID } });
    const comment = await Comment.create({ ...req.body, postID: post.id });

    res.status(201).json({
      status: { code: 201, text: "success" },
      data: comment,
      error: null,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

// get collection of posts
export const getPosts = async (req, res) => {
  try {
    const { category, title, page } = req.query;
    let posts;

    function setPagination(query, page, limit = 6) {
      return {
        query,
        offset: (+page - 1) * limit,
        limit,
      };
    }

    if (category) {
      const categories = await Categories.findOne({
        where: { description: category },
        include: Post,
        order: [[Post, "id", "DESC"]],
      });
      posts = categories.posts;
    } else if (title) {
      posts = await Post.findAndCountAll({
        where: {
          title: {
            [Op.substring]: title,
          },
        },
        order: [["id", "DESC"]],
        distinct: true,
      });
    } else posts = await Post.findAndCountAll();

    const limit = 9;

    const paginator = (count, page, limit) => {
      return {
        prevPage: +page > 1 ? +page - 1 : null,
        currentPage: +page,
        nextPage: +page < Math.floor(count / limit) ? +page + 1 : null,
        totalPages: Math.floor(count / limit),
      };
    };

    return res.status(200).json({
      status: { code: 200, text: "success" },
      // paginator: posts.count ? paginator(posts.count, page, limit) : {},
      data: posts.rows ? posts.rows : posts,
      error: null,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

// get post from collection
export const getPostById = async (req, res) => {
  try {
    return res.status(200).json({
      status: { code: 200, text: "success" },
      data: req.post,
      error: null,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

// update post
export const updatePost = async (req, res) => {
  try {
    const postRef = db.collection("posts").doc(req.postID);
    await postRef.update(req.body);
    const post = await postRef.get();
    return res.status(200).json({
      status: { code: 200, text: "success" },
      data: { id: post.id, ...post.data() },
      error: null,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

// delete post from collection
export const deletePost = async (req, res) => {
  try {
    const postRef = db.collection("posts").doc(req.postID);
    const post = await postRef.delete();
    return res.status(200).json({
      status: { code: 200, text: "success" },
      data: "Post delete!",
      error: null,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};
