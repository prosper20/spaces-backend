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
exports.getProjectsByUser = exports.createProject = void 0;
var db_1 = require("../db");
var createProject = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, title, description, groupId, dueDate, module, assigneeIds, project, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, title = _a.title, description = _a.description, groupId = _a.groupId, dueDate = _a.dueDate, module = _a.module, assigneeIds = _a.assigneeIds;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, db_1.db.project.create({
                        data: {
                            title: title,
                            description: description,
                            groupId: groupId,
                            dueDate: dueDate,
                            status: "active",
                            module: module,
                            assignees: {
                                connect: assigneeIds.map(function (id) { return ({ id: id }); }),
                            },
                        },
                        include: {
                            assignees: {
                                select: {
                                    id: true,
                                    fullName: true,
                                    email: true,
                                    profile_picture: true,
                                    created_at: true,
                                    updated_at: true,
                                },
                            },
                            group: true,
                        },
                    })];
            case 2:
                project = _b.sent();
                res.status(201).json(project);
                return [3 /*break*/, 4];
            case 3:
                err_1 = _b.sent();
                res.status(500).json({ message: "Failed to create project", error: err_1 });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.createProject = createProject;
var getProjectsByUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, projects, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = req.userId;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, db_1.db.project.findMany({
                        where: {
                            assignees: {
                                some: { id: userId },
                            },
                        },
                        include: {
                            assignees: {
                                select: {
                                    id: true,
                                    fullName: true,
                                    email: true,
                                    profile_picture: true,
                                    created_at: true,
                                    updated_at: true,
                                },
                            },
                            group: true,
                        },
                    })];
            case 2:
                projects = _a.sent();
                res.status(200).json(projects);
                return [3 /*break*/, 4];
            case 3:
                err_2 = _a.sent();
                res.status(500).json({ message: "Failed to fetch projects", error: err_2 });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getProjectsByUser = getProjectsByUser;
// export const createProject = async (req: Request, res: Response) => {
//   const { title, description, groupId, dueDate, module, assigneeIds } = req.body;
//   try {
//     const project = await db.project.create({
//       data: {
//         title,
//         description,
//         groupId,
//         dueDate,
//         status: "active",
//         module,
//         assignees: {
//           connect: assigneeIds.map((id: string) => ({ id })),
//         },
//       },
//       include: { assignees: true },
//     });
//     res.status(201).json(project);
//   } catch (err) {
//     res.status(500).json({ message: "Failed to create project", error: err });
//   }
// };
//# sourceMappingURL=projectsController.js.map