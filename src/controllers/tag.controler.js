import { Tags } from "../models/post.model.js";
import { errorHandler } from "../utils/responses.js";

export const createTag = async (req, res) => {
  try {
    const tag = await Tags.create(req.body);
    return res.status(201).json({
      status: {
        text: "success",
        status: 201,
      },
      data: "OK",
      error: null,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

export const getTags = async (req, res) => {
  try {
    const tags = await Tags.findAll({ attributes: ["description"] });

    res.status(200).json({
      status: { text: "success", code: 200 },
      data: tags,
      error: null,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};
