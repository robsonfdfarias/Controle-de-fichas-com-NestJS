import { IsNotEmpty, IsString, MinLength } from "class-validator"

export class CreateLoginDto {
    @IsString({message: 'O campo name precisa ser uma String.'})
    @IsNotEmpty({message: 'O campo name não pode ser vazio.'})
    user: string
    @IsString({message: 'O campo password precisa ser uma String.'})
    @IsNotEmpty({message: 'O campo password não pode ser vazio.'})
    @MinLength(8, {message: 'O campo password precisa conter 8 ou mais caracteres.'})
    password: string
}
