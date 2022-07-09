//sostituisce tutte i caratteri speciali che non contengono nel set lettere unicode,spazio,trattino (-) e slash(/)
export function stringSanitizer(text) {
    if (typeof text === 'string'){
        return text.replace(/[^\p{L}\s 0-9-/]+/ug,"");
    }
    else{
        return text;
    }
};