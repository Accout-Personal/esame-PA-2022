"use strict";
exports.__esModule = true;
exports.startJob = void 0;
var schedule = require("node-schedule");
var luxon_1 = require("luxon");
var proxyPR_1 = require("../model/Proxymodel/proxyPR");
function startJob() {
    var proxy = new proxyPR_1.proxyPr();
    var job = schedule.scheduleJob({ hour: 21, minutes: 0, second: 0 }, function () {
        proxy.setBadPrenotations(luxon_1.DateTime.now().toISODate());
    });
}
exports.startJob = startJob;
