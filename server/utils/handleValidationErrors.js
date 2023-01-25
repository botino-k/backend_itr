import { validationResult } from 'express-validator';

export default (req, res, next) => {
  const result = validationResult(req);
  console.log(result)
  const hasErrors = !result.isEmpty();

  if (hasErrors) {
    return res.status(400).json(errors.array());
  }

  next();
};
