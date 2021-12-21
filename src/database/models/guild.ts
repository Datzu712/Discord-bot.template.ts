import { Schema, model, Document } from 'mongoose';

export interface PrefixInterface extends Document {
    _id: string;
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
