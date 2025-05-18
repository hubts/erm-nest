import { LoginInput } from "@app/sdk";
import { PickType } from "@nestjs/swagger";
import { RegisterInputDto } from "./register-input.dto";

export class LoginInputDto
    extends PickType(RegisterInputDto, ["email", "password"])
    implements LoginInput {}
