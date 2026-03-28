import AppError from '../errors/AppError.js';

export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params
    });
    next();
  } catch (err) {
    const message = err.errors.map(e => e.message).join(', ');
    next(new AppError(`Validation Error: ${message}`, 400));
  }
};
