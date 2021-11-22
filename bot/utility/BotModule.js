"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.GuildConfigurations = exports.UserModule = void 0;
var userschema = require('./schemas/user-schema');
var factorschema = require('./schemas/2fa-schema');
var guildschema = require('./schemas/guild-schema');
var Stream = require('stream');
var speakeasy = require('speakeasy');
var qrcode = require('qrcode');
var uuid = require('uuid');
var config = require('../config.json');
function UserObject(res, guildId) {
    var _this = this;
    this.modify = function (key, value, operation) { return __awaiter(_this, void 0, void 0, function () {
        var updatedresult, obj, guildobj;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, userschema.findOne({ userid: res.userid })];
                case 1:
                    updatedresult = _a.sent();
                    obj = JSON.parse(updatedresult.userdata);
                    guildobj = JSON.parse(updatedresult.guilds);
                    if (key == "warns") {
                        if (guildobj[this.guildId]["warns"]) {
                            guildobj[this.guildId]["warns"] += 1;
                        }
                        else {
                            guildobj[this.guildId]["warns"] = 1;
                        }
                    }
                    else if (key == "inventory" || key == "messages") {
                        throw new Error("The function user.modify does not support modifying the inventory or the messages. Use users.sendMail and user.addItem/removeItem instead.");
                    }
                    else if (key == "xp" || key == "money" || key == "level") {
                        if (operation == "ADD") {
                            obj[key] += value;
                        }
                        else if (operation == "REMOVE") {
                            obj[key] -= value;
                        }
                        else if (operation == "SET") {
                            obj[key] = value;
                        }
                    }
                    else if (key == "note") {
                        obj["note"] = value;
                    }
                    else if (key == "daily") {
                        obj["daily"] = value;
                    }
                    return [4 /*yield*/, userschema.updateOne({ userid: res.userid }, { userdata: JSON.stringify(obj) })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, userschema.updateOne({ userid: res.userid }, { guilds: JSON.stringify(guildobj) })];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    this.getkey = function (key) { return __awaiter(_this, void 0, void 0, function () {
        var updatedresult, obj, guildobj;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, userschema.findOne({ userid: res.userid })];
                case 1:
                    updatedresult = _a.sent();
                    obj = JSON.parse(updatedresult.userdata);
                    guildobj = JSON.parse(updatedresult.guilds);
                    if (key == "warns") {
                        return [2 /*return*/, guildobj[guildId]["warns"]];
                    }
                    else {
                        return [2 /*return*/, obj[key]];
                    }
                    return [2 /*return*/];
            }
        });
    }); };
    this.has2fa = function () { return __awaiter(_this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, userschema.findOne({ userid: res.userid })];
                case 1:
                    result = _a.sent();
                    if (result) {
                        return [2 /*return*/, !!result.uuid];
                    }
                    return [2 /*return*/];
            }
        });
    }); };
    this.validate2fa = function (token) { return __awaiter(_this, void 0, void 0, function () {
        var uuid_1, acu, secret, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, userschema.findOne({ userid: res.userid }).then(function (result) { return result.uuid; })];
                case 1:
                    uuid_1 = _a.sent();
                    return [4 /*yield*/, factorschema.findOne({ id: uuid_1 })];
                case 2:
                    acu = _a.sent();
                    secret = acu.secret;
                    return [2 /*return*/, speakeasy.totp.verify({
                            secret: secret,
                            encoding: "base32",
                            token: token,
                            window: 1
                        })];
                case 3:
                    err_1 = _a.sent();
                    console.error(err_1);
                    return [2 /*return*/, false];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    this.warn = function () { return __awaiter(_this, void 0, void 0, function () {
        var result, updatedresult, guildobj;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, userschema.findOne({ userid: res.userid })];
                case 1:
                    result = _a.sent();
                    if (!result) return [3 /*break*/, 4];
                    return [4 /*yield*/, userschema.findOne({ userid: res.userid })];
                case 2:
                    updatedresult = _a.sent();
                    guildobj = JSON.parse(updatedresult.guilds);
                    if (guildobj[this.guildId]["warns"]) {
                        guildobj[this.guildId]["warns"] += 1;
                    }
                    else {
                        guildobj[this.guildId]["warns"] = 1;
                    }
                    return [4 /*yield*/, userschema.updateOne({ userid: res.userid }, { guilds: JSON.stringify(guildobj) })];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    }); };
    this.checkDaily = function () { return __awaiter(_this, void 0, void 0, function () {
        var updatedresult, obj, then, now, diffTime;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, userschema.findOne({ userid: res.userid })];
                case 1:
                    updatedresult = _a.sent();
                    if (updatedresult) {
                        obj = JSON.parse(updatedresult.userdata);
                        then = new Date(obj.daily).getTime();
                        now = new Date().getTime();
                        diffTime = Math.abs(now - then);
                        return [2 /*return*/, Math.round(diffTime / (1000 * 60 * 60 * 24))];
                    }
                    return [2 /*return*/];
            }
        });
    }); };
    this.addItem = function (itemname, amnt) { return __awaiter(_this, void 0, void 0, function () {
        var updatedresult, items, hasItem, _i, _a, item, _b, _c, item;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, userschema.findOne({ userid: res.userid })];
                case 1:
                    updatedresult = _d.sent();
                    if (!updatedresult) return [3 /*break*/, 3];
                    items = JSON.parse(updatedresult.userdata);
                    hasItem = false;
                    for (_i = 0, _a = items.inventory; _i < _a.length; _i++) {
                        item = _a[_i];
                        if (item["name"] == itemname) {
                            hasItem = true;
                        }
                    }
                    if (hasItem) {
                        for (_b = 0, _c = items.inventory; _b < _c.length; _b++) {
                            item = _c[_b];
                            if (item["name"] == itemname) {
                                item["amount"] += 1;
                            }
                        }
                    }
                    else {
                        items.inventory.push({
                            name: itemname,
                            amount: amnt
                        });
                    }
                    return [4 /*yield*/, userschema.updateOne({ userid: res.userid }, { userdata: JSON.stringify(items) })];
                case 2:
                    _d.sent();
                    _d.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    }); };
    this.removeItem = function (itemname, amnt) { return __awaiter(_this, void 0, void 0, function () {
        var result, obj, hasItem;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, userschema.findOne({ userid: res.userid })];
                case 1:
                    result = _a.sent();
                    if (!result) return [3 /*break*/, 3];
                    obj = JSON.parse(result.userdata);
                    hasItem = obj["inventory"].includes(itemname);
                    if (!hasItem) return [3 /*break*/, 3];
                    if (obj["inventory"][itemname] <= amnt) {
                        delete obj["inventory"][itemname];
                    }
                    else {
                        obj["inventory"][itemname] -= amnt;
                    }
                    return [4 /*yield*/, userschema.updateOne({ userid: res.userid }, { userdata: JSON.stringify(obj) })];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    }); };
    this.findItem = function (itemname) { return __awaiter(_this, void 0, void 0, function () {
        var result, items, hasItem, _i, _a, item;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, userschema.findOne({ userid: res.userid })];
                case 1:
                    result = _b.sent();
                    if (result) {
                        items = JSON.parse(result.userdata);
                        hasItem = false;
                        for (_i = 0, _a = items.inventory; _i < _a.length; _i++) {
                            item = _a[_i];
                            if (item["name"] == itemname) {
                                hasItem = true;
                            }
                        }
                        return [2 /*return*/, hasItem];
                    }
                    return [2 /*return*/];
            }
        });
    }); };
}
var UserModule = /** @class */ (function () {
    function UserModule() {
        var _this = this;
        /**
         * Get a user that you can do functions on
         * @param userid - The id of the user you want to get
         * @param guildid - The guild id, used for warning and other guild-side stuff.
         * @returns UserObject - A user object that you can do functions on.
         */
        this.getUser = function (userid, guildid) { return __awaiter(_this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, userschema.findOne({ userid: userid })];
                    case 1:
                        result = _a.sent();
                        if (!result) return [3 /*break*/, 2];
                        return [2 /*return*/, new UserObject(result, guildid)];
                    case 2: return [4 /*yield*/, new userschema({ userid: userid, uuid: "", userdata: JSON.stringify({ money: 100, xp: 0, level: 1, inventory: [], note: "", messages: [], daily: 0 }), guilds: "{}" }).save()];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        /**
         * Get a user 2FA Auth qr code that they need to scan and register them. Use verify2FA to verify the user and complete the 2FA Setup.
         * @param user - A discord user, not an id, a whole user.
         * @returns any - It can return the user object with the qr code needed to be scanned, or it can return the error.
         */
        this.setup2fa = function (user) { return __awaiter(_this, void 0, void 0, function () {
            // @ts-ignore
            function createStream() {
                return __awaiter(this, void 0, void 0, function () {
                    var stream;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                stream = new Stream.Transform({
                                    transform: function (chunk, encoding, callback) {
                                        this.push(chunk);
                                        callback();
                                    }
                                });
                                return [4 /*yield*/, qrcode.toFileStream(stream, temp_secret_1.otpauth_url)];
                            case 1:
                                _a.sent();
                                return [2 /*return*/, stream];
                        }
                    });
                });
            }
            var aa, id, temp_secret_1, newUser, scan, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, userschema.findOne({ userid: user.id })];
                    case 1:
                        aa = _a.sent();
                        if (!(aa.uuid === "" || !aa.uuid)) return [3 /*break*/, 8];
                        id = uuid.v4();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 6, , 7]);
                        temp_secret_1 = speakeasy.generateSecret({
                            name: "Wolfie: " + user.username
                        });
                        return [4 /*yield*/, new factorschema({
                                id: id,
                                temp_secret: temp_secret_1.base32,
                                secret: "waiting"
                            }).save()];
                    case 3:
                        newUser = _a.sent();
                        return [4 /*yield*/, userschema.updateOne({ userid: user.id }, { uuid: id })
                            // @ts-ignore
                        ];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, createStream()];
                    case 5:
                        scan = _a.sent();
                        return [2 /*return*/, { userid: id, temp_secret: temp_secret_1, qrcode: scan }];
                    case 6:
                        err_2 = _a.sent();
                        return [2 /*return*/, "ERROR"];
                    case 7: return [3 /*break*/, 9];
                    case 8: return [2 /*return*/, "ALREADY_REGISTERED"];
                    case 9: return [2 /*return*/];
                }
            });
        }); };
        /**
         * Complete the 2fa setup with this
         * @param user - A discord user
         * @param token - The code
         * @returns boolean - Returns if the user is verified now or not
         */
        this.verify2fa = function (user, token) { return __awaiter(_this, void 0, void 0, function () {
            var uuid_2, acu, secret, verified, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, userschema.findOne({ userid: user.id }).then(function (result) { return result.uuid; })];
                    case 1:
                        uuid_2 = _a.sent();
                        return [4 /*yield*/, factorschema.findOne({ id: uuid_2 })];
                    case 2:
                        acu = _a.sent();
                        secret = acu.temp_secret;
                        verified = speakeasy.totp.verify({
                            secret: secret,
                            encoding: "base32",
                            token: token
                        });
                        if (!verified) return [3 /*break*/, 4];
                        return [4 /*yield*/, factorschema.updateOne({ id: uuid_2 }, { id: uuid_2, temp_secret: "invalidated", secret: secret })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/, verified];
                    case 5:
                        err_3 = _a.sent();
                        console.log(err_3);
                        return [2 /*return*/, "ERROR"];
                    case 6: return [2 /*return*/];
                }
            });
        }); };
        /**
         * Send a user a message!
         * @param receiver - The id of the message receiver
         * @param sender - The id of the message sender
         * @param message - The message content
         * @returns null
         */
        this.sendMail = function (receiver, sender, message) { return __awaiter(_this, void 0, void 0, function () {
            var result, obj, stringified;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, userschema.findOne({ userid: receiver })];
                    case 1:
                        result = _a.sent();
                        if (!result) return [3 /*break*/, 3];
                        obj = JSON.parse(result.userdata);
                        obj["messages"].push(sender, message);
                        stringified = JSON.stringify(obj);
                        return [4 /*yield*/, userschema.updateOne({ userid: receiver }, { userdata: stringified })];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        }); };
    }
    return UserModule;
}());
exports.UserModule = UserModule;
var GuildConfigurations = /** @class */ (function () {
    function GuildConfigurations() {
        var _this = this;
        /**
         * Get the guild configuration in a javascript array
         * @param guildId - The id of the guild you want to get the configuration of
         * @returns configuration - The guild config
         */
        this.configuration = function (guildId) { return __awaiter(_this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, guildschema.findOne({ guildId: guildId })];
                    case 1:
                        result = _a.sent();
                        if (result) {
                            return [2 /*return*/, JSON.parse(result.config)];
                        }
                        return [2 /*return*/];
                }
            });
        }); };
        /**
         * @deprecated Modify the guild data. (currently doesnt work)
         * @param guildId - The id of the guild you want to modify
         * @param name - The name of the key you want to modify
         * @param value - The value you want to set the key
         * @returns null
         */
        this.modify = function (guildId, name, value) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        }); };
        /**
         * Get the items from a guild, this will return all custom items added to the guild along with the default ones.
         * @param guildId - The id of the guild you want to get the items from
         * @constructor
         * @returns object - The guild items in a javascript object.
         */
        this.GetGuildItems = function (guildId) { return __awaiter(_this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, guildschema.findOne({ guildId: guildId })];
                    case 1:
                        result = _a.sent();
                        if (result) {
                            return [2 /*return*/, __assign(__assign({}, JSON.parse(result.customitems)), config.shopItems)];
                        }
                        else {
                            return [2 /*return*/, {}];
                        }
                        return [2 /*return*/];
                }
            });
        }); };
        /**
         * Create a custom guild item.
         * @param guildId - The id of the guild you want to create the item in
         * @param itemname - Item name
         * @param itemcost - Item price
         * @constructor
         * @returns array - Either returns an array or an object, if success: Object, if error: []
         */
        this.CreateGuildItem = function (guildId, itemname, itemcost) { return __awaiter(_this, void 0, void 0, function () {
            var result, jsonobj;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, guildschema.findOne()];
                    case 1:
                        result = _a.sent();
                        if (!result.customitems) return [3 /*break*/, 3];
                        jsonobj = JSON.parse(result.customitems);
                        jsonobj[itemname] = itemcost;
                        return [4 /*yield*/, guildschema.updateOne({ guildId: guildId }, { customitems: jsonobj })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, jsonobj];
                    case 3: return [2 /*return*/, []];
                }
            });
        }); };
    }
    return GuildConfigurations;
}());
exports.GuildConfigurations = GuildConfigurations;
