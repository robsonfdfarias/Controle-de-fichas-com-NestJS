import { Injectable } from '@nestjs/common';
import { CreateLoginDto } from './dto/create-login.dto';

@Injectable()
export class LoginService {
  async create(createLoginDto: CreateLoginDto) {
    await fetch('', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user: createLoginDto.user,
        password: createLoginDto.password
      })
    })
    .then((response)=> response.json())
    .then((json)=>{
      console.log(json)
    })
    .catch((erro)=>{
      console.log('Ocorreu um erro: '+erro)
    });
    return 'This action adds a new login';
  }
}
