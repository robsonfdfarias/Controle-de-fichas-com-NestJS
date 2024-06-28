import { IsInt, IsNotEmpty, IsString } from "class-validator"

export class CreateFichaDto {
    @IsInt()
    @IsNotEmpty()
    localId: number
    defaultRecord: number
    priorityRecord: number
    @IsString()
    @IsNotEmpty()
    token: string
}
