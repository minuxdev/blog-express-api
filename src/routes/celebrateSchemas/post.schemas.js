import { Joi, Segments } from 'celebrate';

export const postSchema = {
  [Segments.BODY]: Joi.object()
    .keys({
      title: Joi.string().required(),
      summary: Joi.string().required(),
      content: Joi.string().required(),
      categories: Joi.array(),
      tags: Joi.array(),
      posted: Joi.boolean(),
    }),
};

export const updatePostSchema = {
  [Segments.BODY]: Joi.object().keys({
      title: Joi.string().required(),
      summary: Joi.string().required(),
      content: Joi.string().required(),
      categories: Joi.array(),
      tags: Joi.array(),
      posted: Joi.boolean(),
      comment: Joi.object().keys({
        postID: Joi.string(),
        visitor: Joi.string(),
        message: Joi.string()
    })
  })
}

export const paramSchema = Joi.object()
  .keys({
    postID: Joi.string().required(),
  })

export const tokenSchema = Joi.object()
  .keys({
    authorization: Joi.string().required(),
  })
