import users from '../resources/users.js';

export const requestValidation = (req, res, next) => {
  // handle token validation
  const token = req.headers['authorization'].split(' ')[1];

  if (token !== 'admin')
    return res.status(401).json({
      status: { code: 401, text: 'failure' },
      data: null,
      error: { message: 'Unauthorized access!' },
    });
  next();
};
