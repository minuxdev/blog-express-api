export const errorHandler = (res, error) => {
  res.status(500).json({
    status: { code: 500, text: 'failure' },
    data: null,
    error: { message: error.message },
  });
};
