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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGroupDashboardData = exports.getGroupById = exports.getGroupsByUser = exports.createGroup = void 0;
var db_1 = require("../db");
var createGroup = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, groupName, description, purpose, module, tags, supervisorId, creatorId, group, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, groupName = _a.groupName, description = _a.description, purpose = _a.purpose, module = _a.module, tags = _a.tags, supervisorId = _a.supervisorId;
                creatorId = req.userId;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, db_1.db.group.create({
                        data: {
                            groupName: groupName,
                            description: description,
                            purpose: purpose,
                            module: module,
                            tags: tags,
                            supervisorId: supervisorId,
                            members: {
                                create: [
                                    { userId: creatorId },
                                ],
                            },
                            groupRoles: {
                                create: [
                                    {
                                        title: "Group Lead",
                                        description: "Oversees the team, assigns tasks, and ensures project timelines are met.",
                                        userId: creatorId,
                                    },
                                ],
                            },
                        },
                        include: {
                            members: {
                                include: {
                                    user: {
                                        select: {
                                            id: true,
                                            fullName: true,
                                            email: true,
                                            profile_picture: true,
                                        },
                                    },
                                },
                            },
                            groupRoles: {
                                include: {
                                    user: {
                                        select: {
                                            id: true,
                                            fullName: true,
                                            email: true,
                                            profile_picture: true,
                                        },
                                    },
                                },
                            },
                            supervisor: {
                                select: {
                                    id: true,
                                    fullName: true,
                                    email: true,
                                    profile_picture: true,
                                },
                            },
                        },
                    })];
            case 2:
                group = _b.sent();
                res.status(201).json(group);
                return [3 /*break*/, 4];
            case 3:
                err_1 = _b.sent();
                console.error(err_1);
                res.status(500).json({ message: "Failed to create group", error: err_1 });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.createGroup = createGroup;
var getGroupsByUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, groups, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = req.userId;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, db_1.db.group.findMany({
                        where: {
                            members: {
                                some: { userId: userId },
                            },
                        },
                        include: {
                            supervisor: {
                                select: {
                                    id: true,
                                    fullName: true,
                                    email: true,
                                    profile_picture: true,
                                },
                            },
                            members: { include: { user: {
                                        select: {
                                            id: true,
                                            fullName: true,
                                            email: true,
                                            profile_picture: true,
                                        },
                                    }, } },
                        },
                    })];
            case 2:
                groups = _a.sent();
                res.status(200).json(groups);
                return [3 /*break*/, 4];
            case 3:
                err_2 = _a.sent();
                res.status(500).json({ message: "Failed to fetch groups", error: err_2 });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getGroupsByUser = getGroupsByUser;
var getGroupById = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var groupId, group, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                groupId = req.params.groupId;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, db_1.db.group.findUnique({
                        where: {
                            id: groupId,
                        },
                        include: {
                            supervisor: {
                                select: {
                                    id: true,
                                    fullName: true,
                                    email: true,
                                    profile_picture: true,
                                },
                            },
                            members: {
                                include: {
                                    user: {
                                        select: {
                                            id: true,
                                            fullName: true,
                                            email: true,
                                            role: true,
                                            profile_picture: true,
                                        },
                                    },
                                },
                            },
                            groupRoles: {
                                include: {
                                    user: {
                                        select: {
                                            id: true,
                                            fullName: true,
                                            email: true,
                                            profile_picture: true,
                                        },
                                    },
                                },
                            },
                            tasks: {
                                select: {
                                    id: true,
                                    title: true,
                                    description: true,
                                    dueDate: true,
                                    assignees: {
                                        select: {
                                            id: true,
                                            fullName: true,
                                            email: true,
                                            profile_picture: true,
                                        },
                                    },
                                },
                            },
                            projects: {
                                select: {
                                    id: true,
                                    title: true,
                                    description: true,
                                    dueDate: true,
                                    status: true,
                                },
                            },
                            sessions: {
                                select: {
                                    id: true,
                                    goal: true,
                                    date: true,
                                    time: true,
                                    duration: true,
                                },
                            },
                            notes: {
                                select: {
                                    id: true,
                                    title: true,
                                    content: true,
                                    created_at: true,
                                },
                            },
                        },
                    })];
            case 2:
                group = _a.sent();
                if (!group) {
                    return [2 /*return*/, res.status(404).json({ message: "Group not found" })];
                }
                res.status(200).json(group);
                return [3 /*break*/, 4];
            case 3:
                err_3 = _a.sent();
                console.error(err_3);
                res.status(500).json({ message: "Failed to fetch group details", error: err_3 });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getGroupById = getGroupById;
var getGroupDashboardData = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var groupId, group, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                groupId = req.params.groupId;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, db_1.db.group.findUnique({
                        where: { id: groupId },
                        select: {
                            id: true,
                            groupName: true,
                            description: true,
                            purpose: true,
                            module: true,
                            tags: true,
                            tasks: {
                                select: {
                                    id: true,
                                    title: true,
                                    description: true,
                                    dueDate: true,
                                    assignees: {
                                        select: {
                                            id: true,
                                            fullName: true,
                                            profile_picture: true,
                                        },
                                    },
                                },
                                orderBy: {
                                    dueDate: "asc",
                                },
                            },
                            members: {
                                include: {
                                    user: {
                                        select: {
                                            id: true,
                                            fullName: true,
                                            email: true,
                                            role: true,
                                            profile_picture: true,
                                        },
                                    },
                                },
                            },
                            sessions: {
                                select: {
                                    id: true,
                                    goal: true,
                                    date: true,
                                    time: true,
                                    duration: true,
                                },
                                orderBy: {
                                    date: "asc",
                                },
                            },
                            notes: {
                                select: {
                                    id: true,
                                    title: true,
                                    created_at: true,
                                },
                                orderBy: {
                                    created_at: "desc",
                                },
                            },
                            chat: {
                                select: {
                                    id: true,
                                    messages: {
                                        select: {
                                            id: true,
                                            message: true,
                                            created_at: true,
                                        },
                                        orderBy: {
                                            created_at: "desc",
                                        },
                                        take: 5,
                                    },
                                },
                            },
                        },
                    })];
            case 2:
                group = _a.sent();
                if (!group) {
                    return [2 /*return*/, res.status(404).json({ message: "Group not found" })];
                }
                res.status(200).json(group);
                return [3 /*break*/, 4];
            case 3:
                err_4 = _a.sent();
                console.error(err_4);
                res.status(500).json({ message: "Failed to fetch dashboard data", error: err_4 });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getGroupDashboardData = getGroupDashboardData;
//# sourceMappingURL=groupsController.js.map