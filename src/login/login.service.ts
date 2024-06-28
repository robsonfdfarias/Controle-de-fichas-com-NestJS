import { Injectable } from '@nestjs/common';
import { CreateLoginDto } from './dto/create-login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class LoginService {
  constructor(private readonly jwtService: JwtService) {}
  async create(createLoginDto: CreateLoginDto) {
    var payload = {sub: 1, username: 'Robson'};
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
      if(json.id!=undefined){
        payload = {sub: json.id, username: json.name};
      }else{
        payload = {sub: 1, username: 'Robson'}
      }
    })
    .catch((erro)=>{
      console.log('Ocorreu um erro: '+erro)
    });

    const token = { access_token: await this.jwtService.signAsync(payload), localId: 1}
    return token;
  }

}
