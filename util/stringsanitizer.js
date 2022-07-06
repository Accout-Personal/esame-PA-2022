"use strict";
exports.__esModule = true;
exports.stringSanitizer = void 0;
//sostituisce tutte i caratteri speciali che non contengono nel set lettere unicode,spazio,trattino (-) e slash(/)
function stringSanitizer(text) {
    return text.replace(/[^\p{L}\s 0-9-/]+/ug, "");
}
exports.stringSanitizer = stringSanitizer;
;
