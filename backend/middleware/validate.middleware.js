const AppError = require('../utils/app-error.util');



const validate = (schemas) => (req, res, next) => {
  const valid = {};
  const errors = [];

  for (const part of ['params', 'query', 'body']) {
    if (!schemas[part]) continue;

    const result = schemas[part].safeParse(req[part] ?? {});
    if (result.success) {
      valid[part] = result.data;
    } else {
      for (const issue of result.error.issues) {
        errors.push({ field: issue.path.join('.') || part, message: issue.message });
      }
    }
  }

  if (errors.length > 0) {
    return next(new AppError(400, 'Validation failed', errors));
  }

  req.valid = valid;
  return next();
};

module.exports = validate;
