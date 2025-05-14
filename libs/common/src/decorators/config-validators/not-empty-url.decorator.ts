import { applyDecorators } from "@nestjs/common";
import { Expose } from "class-transformer";
import { IsNotEmpty, IsUrl } from "class-validator";

export function NotEmptyUrl() {
    return applyDecorators(Expose(), IsNotEmpty(), IsUrl());
}
