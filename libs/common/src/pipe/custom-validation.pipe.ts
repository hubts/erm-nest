import {
    Injectable,
    ArgumentMetadata,
    ValidationPipe,
    BadRequestException,
} from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { validate, ValidationError } from "class-validator";

@Injectable()
export class CustomValidationPipe extends ValidationPipe {
    constructor() {
        super({
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
        });
    }

    async transform(value: any, { metatype, type }: ArgumentMetadata) {
        if (!metatype || !this.toValidate(metatype) || type === "custom") {
            return value;
        }

        const transformed = plainToClass(metatype, value);
        const errors = await validate(transformed, {
            skipNullProperties: false, // If property is null, would you let me in?
            skipMissingProperties: false, // If property is missed, would you let me in?
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        });

        if (errors.length > 0) {
            const records: {
                property: string;
                value: any;
                messages: string[];
            }[] = [];
            this.searchErrorConstraints(errors, records);
            throw new BadRequestException("Payload validation failed", {
                cause: records,
            });
        }

        return transformed;
    }

    searchErrorConstraints(
        errors: ValidationError[],
        records: {
            property: string;
            value: any;
            messages: string[];
        }[]
    ): void {
        for (const error of errors) {
            if (error.constraints) {
                records.push({
                    property: error.property,
                    value: error.value,
                    messages: Object.values(error.constraints),
                });
            } else if (error.children) {
                this.searchErrorConstraints(error.children, records);
            }
        }
    }

    toValidate(metatype: any): boolean {
        const types = [String, Boolean, Number, Array, Object];
        return !types.find(type => metatype === type);
    }
}
