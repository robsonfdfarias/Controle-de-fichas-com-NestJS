import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateLoginDto } from './dto/create-login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class LoginService {
  constructor(private readonly jwtService: JwtService) {}

  async create(createLoginDto: CreateLoginDto) {
    const url_ldap = process.env.URL_LDAP
    const url_integracao = process.env.URL_INTEGRACAO
    var name = '';
    // console.log(url_ldap)
    await fetch(url_ldap, {
      method: 'POST',
      headers: {
        Accept: '*/*',
        'Content-Type': 'application/json',
        // authorization: 'Bearer '+process.env.TOKEN,
        Authorization: 'Bearer '+process.env.TOKEN,
        Connection: 'keep-alive'
      },
      body: JSON.stringify({
        matricula: createLoginDto.user,
        senha: createLoginDto.password
      })
    })
    .then((response)=> response.json())
    .then((json)=>{
      console.log(json)
      if(json.sucesso){
        // console.log('dentro do IF do primeiro FETCH')
        name = json.data.nome;
      }else{
        throw new UnauthorizedException();
      }
    })
    .catch((erro)=>{
      console.log('Ocorreu um erro: '+erro)
      throw new UnauthorizedException();
    });
    // this.getDataUser(json.data.nome, url_integracao+'/funcionarios/nome/'+json.data.nome+'/ativos?completo=true');
    const token = await this.getDataUser(name, url_integracao+'/funcionarios/nome/'+'Danilo Packer'+'/ativos?completo=true');
    console.log('Depois de consultar o 2 FETCH')
    return token;
  }

  async getDataUser(name: string, url: string){
    var payload;
    var localId;
    var matricula;
    await fetch(url, {
      method: 'GET',
      headers: {
        Accept: '*/*',
        'Content-Type': 'application/json',
        // authorization: 'Bearer '+process.env.TOKEN,
        Authorization: 'Bearer '+process.env.TOKEN,
        Connection: 'keep-alive'
      }
    })
    .then((response)=>response.json())
    .then((json)=>{
      console.log(json.sucesso)
      if(json.sucesso){
        // console.log(json.data[0].localDeTrabalho[0])
        payload={sub: json.data[0].matricula, username: json.data[0].nome}
        // localId = json.data[0].localDeTrabalho[0].local
        localId = json.data[0].id
        matricula= json.data[0].matricula
        console.log(localId)
      }else{
        throw new UnauthorizedException();
      }
    })
    .catch((erro)=>{
      console.log('Erro na segunda consulta: '+erro)
      throw new UnauthorizedException();
    })
    // console.log('Aqui gera o token...')
    const token = { access_token: await this.jwtService.signAsync(payload), localId: localId, matricula: matricula}
    // console.log('Aqui retorna o toke com os dados')
    console.log(token)
    return token;
  }



  // async create(createLoginDto: CreateLoginDto) {
  //   const url_ldap = process.env.URL_LDAP
  //   const url_integracao = process.env.URL_INTEGRACAO
  //   var payload = {sub: 1, username: 'Robson'};
  //   await fetch('', {
  //     method: 'POST',
  //     headers: {
  //       Accept: 'application/json',
  //       'Content-Type': 'application/json',
  //       authenticate: process.env.TOKEN,
  //       Authenticate: process.env.TOKEN
  //     },
  //     body: JSON.stringify({
  //       matricula: createLoginDto.user,
  //       senha: createLoginDto.password
  //     })
  //   })
  //   .then((response)=> response.json())
  //   .then((json)=>{
  //     console.log(json)
  //     if(json.id!=undefined){
  //       // payload = {sub: json.id, username: json.name};
  //       // this.getDataUser(json.data.nome, url_integracao+'/funcionarios/nome/'+json.data.nome+'/ativos?completo=true');
  //       // this.getDataUser(json.data.nome, url_integracao+'/funcionarios/nome/'+'Danilo Packer'+'/ativos?completo=true');
  //       payload = {sub: json.id, username: json.name};
  //     }else{
  //       payload = {sub: 1, username: 'Robson'}
  //     }
  //   })
  //   .catch((erro)=>{
  //     console.log('Ocorreu um erro: '+erro)
  //   });

  //   const token = { access_token: await this.jwtService.signAsync(payload), localId: 1, matricula: createLoginDto.user}
  //   return token;
  // }

}
