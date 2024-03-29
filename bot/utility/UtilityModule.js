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
exports.Modules = void 0;
var addReactions = function (message, reactions) {
    message.react(reactions[0])["catch"](function (e) {
        return;
    });
    reactions.shift();
    if (reactions.length > 0) {
        setTimeout(function () { return addReactions(message, reactions); }, 750);
    }
};
/**
 * Send a first message in a channel as the bot.
 * @param client
 * @param id
 * @param text
 * @param reactions
 */
function firstMessage(client, id, text, reactions) {
    var _this = this;
    if (reactions === void 0) { reactions = []; }
    this.send = function (client, id, text, reactions) {
        if (reactions === void 0) { reactions = []; }
        return __awaiter(_this, void 0, void 0, function () {
            var channel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client.channels.fetch(id)];
                    case 1:
                        channel = _a.sent();
                        channel.messages.fetch().then(function (messages) {
                            if (messages.size === 0) {
                                channel.send(text).then(function (message) {
                                    addReactions(message, reactions);
                                });
                            }
                            else {
                                for (var _i = 0, messages_1 = messages; _i < messages_1.length; _i++) {
                                    var message = messages_1[_i];
                                    message[1].edit(text);
                                    addReactions(message[1], reactions);
                                }
                            }
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
}
/** Shuffle things around in an array */
function shuffle(array) {
    return __awaiter(this, void 0, void 0, function () {
        var currentIndex, randomIndex;
        var _a;
        return __generator(this, function (_b) {
            currentIndex = array.length;
            while (currentIndex != 0) {
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex--;
                _a = [
                    array[randomIndex], array[currentIndex]
                ], array[currentIndex] = _a[0], array[randomIndex] = _a[1];
            }
            return [2 /*return*/, array];
        });
    });
}
var Modules = /** @class */ (function () {
    function Modules() {
        var _this = this;
        /**
         * Get the first message module
         * @param client
         * @param id
         * @param text
         * @param reactions
         */
        this.firstMessage = function (client, id, text, reactions) {
            if (reactions === void 0) { reactions = []; }
            return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, new firstMessage(client, id, text, reactions)];
                });
            });
        };
        /** Shuffle things around in an array */
        this.shuffle = function (array) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, shuffle(array)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); };
    }
    return Modules;
}());
exports.Modules = Modules;
