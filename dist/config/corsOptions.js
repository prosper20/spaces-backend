"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsOptions = void 0;
var allowedOrigins_1 = require("./allowedOrigins");
exports.corsOptions = {
    origin: function (origin, callback) {
        if (allowedOrigins_1.allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, origin);
        }
        else {
            callback(new Error("Not allowed by CORS"), false);
        }
    },
    optionsSuccessStatus: 200,
};
//# sourceMappingURL=corsOptions.js.map