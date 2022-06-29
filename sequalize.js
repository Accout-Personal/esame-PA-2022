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
var _a = require('sequelize'), Sequelize = _a.Sequelize, Model = _a.Model, DataTypes = _a.DataTypes;
var sequelize = new Sequelize({
    username: 'centrovax',
    host: '37.187.126.183',
    //port:'888',
    //logging: console.log,
    database: 'centrovax',
    password: 'pa2022',
    dialect: 'mysql'
});
// Option 3: Passing parameters separately (other dialects)
/*const sequelize = new Sequelize('centrovax', 'root', '', {
    host:'localhost',
    dialect: 'mysql'
    //logging: false
  });*/
var User = sequelize.define("user", {
    id: {
        type: DataTypes.BIGINT(20),
        autoIncrement: true,
        primaryKey: true
    },
    cf: { type: DataTypes.STRING },
    username: { type: DataTypes.STRING },
    password: { type: DataTypes.STRING },
    tipo: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'users',
    timestamps: false
});
var pren = sequelize.define("prenotazione", {
    id: {
        type: DataTypes.BIGINT(20),
        autoIncrement: true,
        primaryKey: true
    },
    data: { type: DataTypes.DATE },
    fascia: { type: DataTypes.INTEGER },
    slot: { type: DataTypes.INTEGER },
    centro_vac: { type: DataTypes.BIGINT(20) },
    vaccino: { type: DataTypes.BIGINT(20) },
    user: {
        type: DataTypes.BIGINT(20)
    },
    stato: { type: DataTypes.BIGINT(20) }
}, {
    tableName: 'prenotazione',
    timestamps: false
});
function prova() {
    return __awaiter(this, void 0, void 0, function () {
        var users;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log(typeof sequelize);
                    console.log('il tipo sta sopra');
                    return [4 /*yield*/, pren.findAll()];
                case 1:
                    users = _a.sent();
                    console.log(users.every(function (pre) { return pre instanceof pren; })); // true
                    console.log("All users:", JSON.stringify(users, null, 2));
                    return [2 /*return*/];
            }
        });
    });
}
function prova2() {
    return __awaiter(this, void 0, void 0, function () {
        var jane, pr;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, User.create({ id: "1", cf: "YCPNBF97P21D302R", username: "francesco", password: "francesco", tipo: "1" }, { fields: ['cf', 'username', 'password', 'tipo'] })];
                case 1:
                    jane = _a.sent();
                    return [4 /*yield*/, pren.create({ id: "0", data: '2022-07-06', fascia: 1, slot: 14, centro_vac: 8, vaccino: 1, user: 1, stato: 0 }, { fields: ['data', 'fascia', 'slot', 'centro_vac', 'vaccino', 'user', 'stato'] })];
                case 2:
                    pr = _a.sent();
                    console.log("Jane's auto-generated ID:", jane.id);
                    return [2 /*return*/];
            }
        });
    });
} //1
function prova3() {
    return __awaiter(this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, sequelize.authenticate()];
                case 1:
                    _a.sent();
                    console.log('Connection has been established successfully.');
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error('Unable to connect to the database:', error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
prova2();
//prova2();
//Metodo grezzo
/*

async function prova(){
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        prova2();
        prova3();
        //sequelize.close();
        //console.log('Ho chiuso la connessione');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
}

async function prova2(){
    try{
        const users = await sequelize.query("SELECT * FROM `users`", { type: Sequelize.SELECT });
        console.log(users)
    } catch(error){
        console.error('Abbiamo un problema:', error);
    }
}

async function prova3(){
    try{
        const users = await sequelize.query("INSERT INTO `users`(`cf`, `username`, `password`, `tipo`) VALUES ('LCULLL07B55F205T','luca','luca','0')", { type: Sequelize.INSERT });
        console.log(users);
        console.log("inserimento riuscito")
    } catch(error){
        console.error('Abbiamo un problema:', error);
    }
}

prova()*/ 
