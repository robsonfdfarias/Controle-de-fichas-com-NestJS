import { PartialType } from '@nestjs/mapped-types';
import { CreateFichaDto } from './create-ficha.dto';
import { IsInt, IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateFichaDto extends PartialType(CreateFichaDto) {
    id?: number
    date?: number
    @IsInt({message: 'Precisa ser um inteiro'})
    @IsNotEmpty({message: 'O campo localId não pode ser vazio'})
    localId: number
    userRegistration?: string
}
