"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const connectionsSchema = new mongoose_1.Schema({
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true
    },
    connections: {
        users: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'user' }],
        employers: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'employer' }]
    }
});
const connectionsModel = (0, mongoose_1.model)('connection', connectionsSchema);
exports.default = connectionsModel;
