export function logErrors(err, req, res, next) {
    console.error(err.stack);
    next(err);
  }

export function errorHandler(err, req, res, next) {
    console.log("error handling");
    if (res.headersSent) {
        return next(err)
    }
    res.status(403).send({"errore": err.message});
}

