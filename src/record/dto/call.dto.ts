import { IsInt, IsNotEmpty, IsString } from "class-validator"
import { UpdateFichaDto } from "./update-ficha.dto"

export class CallDto {
    @IsInt()
    @IsNotEmpty()
    record: number
    @IsString()
    @IsNotEmpty()
    table: string
    @IsString()
    @IsNotEmpty()
    type: string
    // @IsNotEmpty()
    // updateFichaDto: UpdateFichaDto
}
