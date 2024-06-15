import { db, auth } from '../firebase/firebaseConfigs.js';
import { errorHandler } from '../utils/responses.js';

const formatUserObject = (user) => {
  return { uid: user.uid, email: user.email, username: user.displayName };
};

export const createUser = async (req, res) => {
  try {
    const user = req.body;
    if (user.password1 !== user.password2)
      return res.status(400).json({
        status: { code: 400, text: 'failure' },
        data: null,
        error: { message: "Passwords doesn't match" },
      });

    if (!user.email)
      return res.status(400).json({
        status: { code: 400, text: 'failure' },
        data: null,
        error: { message: 'Invalid email!' },
      });

    const newUser = await auth.createUser({
      ...user,
      password: user.password1,
      displayName: user.username,
    });

    await db.collection('profile').add({ uid: newUser.uid, ...req.body });

    res.status(201).json({
      status: { code: 201, text: 'success' },
      data: newUser,
      error: null,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

export const getUsers = async (req, res) => {
  try {
    // get user by query param
    const username = req.query.username;
    let user;

    if (username) {
      user = await auth.getUserByEmail(username);
      if (user)
        return res.json({
          status: { code: 200, text: 'success' },
          data: formatUserObject(user),
          error: null,
        });
    }

    // return all users
    const activeUsers = (await auth.listUsers(100)).users;
    const users = activeUsers.map((user) => formatUserObject(user));
    return res.status(200).json({
      status: { code: 200, text: 'success' },
      data: users,
      error: null,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

export const getUser = async (req, res) => {
  try {
    return res.status(200).json({
      status: { code: 200, text: 'success' },
      data: req.userInfo,
      error: null,
    });
  } catch (error) {}
};

export const updateUser = async (req, res) => {
  try {
    if (!req.userInfo) {
      return res.status(404).json({
        status: { code: 404, text: 'failure' },
        data: null,
        error: { message: 'User not found!' },
      });
    }
    const user = await auth.updateUser(req.userID, { ...req.body });

    return res.status(200).json({
      status: { code: 200, text: 'success' },
      data: formatUserObject(user),
      error: null,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

export const deleteUser = async (req, res) => {
  try {
    if (!req.userID) {
      return res.status(404).json({
        status: { code: 404, text: 'failure' },
        data: null,
        error: { message: 'User not found!' },
      });
    }
    await auth.deleteUser(req.userID);

    return res.status(200).json({
      status: { code: 200, text: 'success' },
      data: 'OK',
      error: null,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};
