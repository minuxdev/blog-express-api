import { Categories } from "../models/post.model.js";
import { errorHandler } from "../utils/responses.js";

export const createCategory = async (req, res) => {
  try {
    const category = await Categories.create({ ...req.body });

    return res.status(201).json({
      status: {
        code: 201,
        text: "success",
      },
      data: "OK",
      error: null,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Categories.findAll({
      order: [["id", "DESC"]],
    });

    return res.status(200).json({
      status: {
        code: 200,
        text: "success",
      },
      data: categories,
      error: null,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};
