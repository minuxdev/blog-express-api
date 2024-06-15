import express from 'express';
import { celebrate, errors, Segments } from 'celebrate';
import { auth } from '../firebase/firebaseConfigs.js';
import { errorHandler } from '../utils/responses.js';

import {
  getUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
} from '../controllers/user.controller.js';
import {
  newUserSchema,
  updateUserSchema,
  paramSchema,
  tokenSchema,
} from './celebrateSchemas/user.schemas.js';

import { requestValidation } from '../middlewares/user.middleware.js';

const router = express.Router();

// create and retrieve all users
router.route('/').get(getUsers).post(celebrate(newUserSchema), createUser);

// token verification
router.get('/verify/token', (req, res) => {
  return res.json({
    status: { code: 200, text: 'success' },
    data: 'OK',
    error: null,
  });
});

// manage specific user
router
  .route('/:userID')
  .get(
    celebrate({
      [Segments.PARAMS]: paramSchema,
      [Segments.HEADERS]: tokenSchema,
    }),
    requestValidation,
    getUser,
  )
  .put(
    celebrate({
      [Segments.HEADERS]: tokenSchema,
      [Segments.PARAMS]: paramSchema,
      [Segments.BODY]: updateUserSchema,
    }),
    requestValidation,
    updateUser,
  )
  .delete(
    celebrate({
      [Segments.PARAMS]: paramSchema,
      [Segments.HEADERS]: tokenSchema,
    }),
    requestValidation,
    deleteUser,
  );

// get user by id
router.param('userID', async (req, res, next, userID) => {
  console.log(userID);
  try {
    // add userInfo to req object
    const user = await auth.getUser(userID);

    if (!user) {
      return res.status(404).json({
        status: { code: 404, text: 'failure' },
        data: null,
        error: { message: 'User not found!' },
      });
    }

    req.userID = userID;
    req.userInfo = {
      uid: user.uid,
      email: user.email,
      username: user.displayName,
    };
    next();
  } catch (error) {
    errorHandler(res, error);
  }
});

router.use(errors());

export default router;
