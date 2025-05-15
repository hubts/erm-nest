import { Injectable } from "@nestjs/common";
import { User } from "../schemas/user.schema";
import { AbstractRepository } from "@app/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class UserRepository extends AbstractRepository<User> {
    constructor(@InjectModel(User.name) userModel: Model<User>) {
        super(userModel);
    }
}
