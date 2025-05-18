import { UpdateEventInput } from "@app/sdk";
import { PartialType } from "@nestjs/swagger";
import { CreateEventInputDto } from "./create-event-input.dto";

export class UpdateEventInputDto
    extends PartialType(CreateEventInputDto)
    implements UpdateEventInput {}
