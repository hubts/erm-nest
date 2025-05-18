import { Types } from "mongoose";

export function generateId(): string {
    return new Types.ObjectId().toString();
}
