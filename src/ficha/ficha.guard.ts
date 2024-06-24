import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
// import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/login/jwtConstants';

@Injectable()
export class FichaGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  async canActivate( context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if(context.getType() === 'http' && request.headers.authorization != undefined){
      // console.log(request.headers.authorization)
      if(request.headers.authorization){
        const token = request.headers.authorization.split(' ')[1];
        // console.log('O token é: '+token)
        // if(token !== 'shammel-token'){
        //   return false;
        // }
        try{
          const payload = await this.jwtService.verifyAsync(
            token,
            {
              secret: jwtConstants.secret
            }
          )
          console.log(payload)
          request['user'] = payload;
          return true;
        }catch(error){
          throw new UnauthorizedException();
          // return false;
        }
      }
    }
    return false;
  }
}
