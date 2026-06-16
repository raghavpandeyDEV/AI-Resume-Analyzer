import ApiError from "../utils/ApiError.js";

const validate =
  (schema, source = "body") =>
  (req, res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      return next(
        ApiError.badRequest(
          "Validation failed",
          result.error.issues
        )
      );
    }

    if (source === "query") {
      Object.assign(req.query, result.data);
    } else if (source === "params") {
      Object.assign(req.params, result.data);
    } else {
      req.body = result.data;
    }

    next();
  };

export { validate };