import { Schema, model, Document } from 'mongoose';

export interface PrefixInterface extends Document {
    // Guild ID
    _id: string;

    // Guild prefix
    prefix: string;
}

const Prefix: Schema = new Schema({
    _id: String,
    prefix: {
        required: true,
        type: String,
    },
});

export default model<PrefixInterface>('Prefix', Prefix);
