import { Schema, model } from "mongoose";

const connectionsSchema: Schema<any> = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    connections: {
        users: [{ type: Schema.Types.ObjectId, ref: 'user' }],
        employers: [{ type: Schema.Types.ObjectId, ref: 'employer' }]
    }
})

const connectionsModel = model<any>('connection', connectionsSchema);

export default connectionsModel