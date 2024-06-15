import { Joi, Segments } from 'celebrate';

export const newUserSchema = {
  [Segments.BODY]: Joi.object().keys({
    username: Joi.string().max(30).required(),
    email: Joi.string().email().required(),
    password1: Joi.string().min(4).required(),
    password2: Joi.string().min(4).required(),
  }),
};

export const updateUserSchema = Joi.object()
  .keys({
    username: Joi.string().max(10),
    email: Joi.string().email(),
  })
  .unknown();

export const paramSchema = Joi.object()
  .keys({
    userID: Joi.string().required(),
  })
  .unknown();

export const tokenSchema = Joi.object()
  .keys({
    authorization: Joi.string().required(),
  })
  .unknown();
