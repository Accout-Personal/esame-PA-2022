export function logErrors(err, req, res, next) {
    console.error(err.stack);
    next(err);
  }

export function errorHandler(code,err, req, res, next) {   
    res.status(code).send({"error": err.message});
}

