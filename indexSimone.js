"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var sequelize_1 = require("./config/sequelize");
var users_1 = require("./model/users");
var dotenv = require("dotenv");
var proxyCV_1 = require("./model/Proxymodel/proxyCV");
var proxyPR_1 = require("./model/Proxymodel/proxyPR");
var buildCV_1 = require("./presenter/builder/buildCV");
function querySemplice(connection) {
    return __awaiter(this, void 0, void 0, function () {
        var users;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    users = new users_1.Users(connection);
                    console.log(users);
                    return [4 /*yield*/, users.trovaTutto(connection)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
console.log("hello world");
dotenv.config();
var connection = sequelize_1.DBConnection.getInstance().getConnection();
/*querySemplice(connection).then(value=>{
    console.log(JSON.stringify(value));
});*/
/*async function stampa(prova:proxyPr){
    
    let result = await prova.insertNewPr('2020-02-02', 1, 14, 8, 1, 1, 0);
    switch(typeof result){
    case 'boolean': {
        console.log('è booleano');
        console.log(result);
        break;
    }
    case 'object': {
        console.log('non è bool');
        console.log(result)
        break;
}
    }
    
    console.log('mi dispiace, hai generato questa eccezione');
    //catch(error){console.log('mi dispiace, hai generato questa eccezione: ',error)}
    
}*/
function stampaAgain() {
    return __awaiter(this, void 0, void 0, function () {
        var prova;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    prova = new proxyPR_1.proxyPr();
                    return [4 /*yield*/, prova.setBadPrenotations('2022-07-01')];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
stampaAgain();
var prova = new proxyCV_1.proxyCV();
var pluto = new buildCV_1.buildCV(prova);
//pluto.producePartB(30.849635,-83.24559,8996783.546569308,'2022-07-01') //prova haversine
//pluto.producePartA(30.849635,-83.24559,8196783.546569308)
//pluto.getSlotFree(3,['2022-07-01','2022-06-30'],1)
//console.log(pippo.insertNewPr(20, 2,2000 , 1, 14, 8, 1, 1, 0));
//stampa(prova);
//console.log(isNaN(5))
/*prova.model.getModel().findAll()
console.log(prova.model.getModel().findAll({
    where: {
      id: 200
    }
  }).then( value =>{
    if(Object.keys(value).length != 0)console.log('è pieno')
    else console.log('è vuoto')
    console.log(JSON.stringify(value));
}));*/
