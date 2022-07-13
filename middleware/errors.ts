// Qui abbiamo definito dei metodi usati per gestire gli errori in fase di autenticazione

export function logErrors(err, req, res, next) {
    console.log(err);
    next(err);
  }

export function errorHandler(err, req, res, next) {
    if (res.headersSent) {
        return next(err)
    }
    res.status(400).send({"errore": err.message});
}

