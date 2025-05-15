import { Injectable } from "@nestjs/common";
import { AbstractRepository } from "@app/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Token } from "../schemas/token.schema";

@Injectable()
export class TokenRepository extends AbstractRepository<Token> {
    constructor(@InjectModel(Token.name) tokenModel: Model<Token>) {
        super(tokenModel);
    }
}
