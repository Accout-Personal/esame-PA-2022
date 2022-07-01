export function logErrors(err, req, res, next) {
    console.error(err.stack);
    next(err);
  }

export function errorHandler(err, req, res, next) {
    if (res.headersSent) {
        return next(err)
    }
    console.log('error handling');
    console.log(err.message);
    res.status(403).send({"error": err.message});
}

