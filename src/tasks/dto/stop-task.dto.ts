import {IsDateString} from "class-validator";

export class StopTaskDto {

    @IsDateString({
        strict: true
    })
    end_date: Date;
}
