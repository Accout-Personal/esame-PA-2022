// Qui abbiamo definito dei metodi usati per gestire gli errori in fase di autenticazione

export function logErrors(err, req, res, next) {
    next(err);
  }

export function errorHandler(err, req, res, next) {
    if (res.headersSent) {
        return next(err)
    }
    res.status(403).send({"errore": err.message});
}

