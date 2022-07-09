"use strict";
exports.__esModule = true;
exports.slotToTime = void 0;
var luxon_1 = require("luxon");
//converte slot 1-36 al tempistica (ora e minuti)
function slotToTime(slot) {
    if (slot >= 1 && slot <= 36) {
        if (slot <= 16) {
            return luxon_1.DateTime.fromObject({ hour: 9 }).plus({ Minutes: (slot - 1) * 15 }).toFormat("HH:mm").toString();
        }
        else {
            return luxon_1.DateTime.fromObject({ hour: 14 }).plus({ Minutes: (slot - 17) * 15 }).toFormat("HH:mm").toString();
        }
    }
    else {
        throw Error("not valid timeslot");
    }
}
exports.slotToTime = slotToTime;
;
