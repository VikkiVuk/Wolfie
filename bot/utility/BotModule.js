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
    /**
     * Modify user's data using key and value pairs. Specify what function you want to do: ADD (+), REMOVE (-), SET (=)
     * @param key - What part of the user's data do you want to change?
     * @param value - What do you want to change it to?
     * @param operation - What do you want to do with the value?
     * @returns nothing
     */
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
                        if (guildobj[guildId]["warns"]) {
                            guildobj[guildId]["warns"] += 1;
                        }
                        else {
                            guildobj[guildId]["warns"] = 1;
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
    /**
     * Get the user's data
     * @param key - What value do you want to get?
     * @returns any - Returns the value
     */
    this.get = function (key) { return __awaiter(_this, void 0, void 0, function () {
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
    /**
     * Check if the user has 2fa enabled.
     * @returns boolean
     */
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
    /**
     * Validate a users authenticity for more secure interactions.
     * @param token - The code from the authenticator app
     * @returns boolean
     */
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
    /**
     * @deprecated Warn someone for misbehaving in a server or something like that. Warns are per-guild, bots cannot be warned. Warns the user in the guild the user object was requested.
     */
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
                    if (guildobj[guildId]["warns"]) {
                        guildobj[guildId]["warns"] += 1;
                    }
                    else {
                        guildobj[guildId]["warns"] = 1;
                    }
                    return [4 /*yield*/, userschema.updateOne({ userid: res.userid }, { guilds: JSON.stringify(guildobj) })];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    }); };
    /**
     * Check how many days have passed since the last time the user has claimed the daily reward.
     * @returns number - How many days have passed since the last daily reward.
     */
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
    /**
     * Add an item to a users inventory.
     * @param itemname - The name of the item
     * @param amnt - How many do you want to give?
     */
    this.addItem = function (itemname, amnt) { return __awaiter(_this, void 0, void 0, function () {
        var updatedresult, items, hasItem;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, userschema.findOne({ userid: res.userid })];
                case 1:
                    updatedresult = _a.sent();
                    if (!updatedresult) return [3 /*break*/, 3];
                    items = JSON.parse(updatedresult.userdata);
                    hasItem = items["inventory"].includes(itemname);
                    if (hasItem) {
                        items["inventory"][itemname] += amnt;
                    }
                    else {
                        items["inventory"][itemname] = amnt;
                    }
                    return [4 /*yield*/, userschema.updateOne({ userid: res.userid }, { userdata: JSON.stringify(items) })];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    }); };
    /**
     * Remove an item from a users inventory.
     * @param itemname - The name of the item
     * @param amnt - How many do you want to remove?
     */
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
    /**
     * Check if a user has a specific item in their inventory. Subject to deprecation.
     * @param itemname - The name of the item you want to check
     */
    this.hasItem = function (itemname) { return __awaiter(_this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, userschema.findOne({ userid: res.userid })];
                case 1:
                    result = _a.sent();
                    if (result) {
                        return [2 /*return*/, JSON.parse(result.userdata)["inventory"].includes(itemname)];
                    }
                    return [2 /*return*/];
            }
        });
    }); };
}
function UserModule() {
    var _this = this;
    /**
     * Get a user that you can do functions on
     * @param userid - The id of the user you want to get
     * @param guildid - The guild id, used for warning and other guild-side stuff.
     * @returns UserObject - A user object that you can do functions on.
     */
    this.user = function (userid, guildid) { return __awaiter(_this, void 0, void 0, function () {
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
function GuildConfigurations() {
    var _this = this;
    /**
     * Get the guild configuration
     * @param guildId - The id of the guild you want the configuration
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
     * @deprecated Currently does nothing.
     * @param guildId
     * @param name
     * @param value
     */
    this.modify = function (guildId, name, value) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/];
        });
    }); };
    /**
     * Get all the guild items from the specified guild, sends the default items too
     * @param guildId - The id of the guild you want to get the items from
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
     * Create a custom guild item in a specified guild.
     * @param guildId
     * @param itemname
     * @param itemcost
     * @constructor
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
module.exports.Users = UserModule;
module.exports.GuildConfig = GuildConfigurations;
