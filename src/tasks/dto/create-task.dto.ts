import { strict } from "assert/strict";
import { IsDate, IsDateString, IsString } from "class-validator";

export class CreateTaskDto {
    @IsString({
        message: "Name must be a string."
    })
    name: string;

    @IsDateString({
        strict: true
    })
    start_date: Date;
}
