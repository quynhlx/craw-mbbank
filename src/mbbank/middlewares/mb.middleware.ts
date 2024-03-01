import { HttpService } from '@nestjs/axios';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { makeRefNo } from '../utils';
import { MbbankService } from '../mbbank.service';
import { UserService } from '../user.service';
import { MBUser } from '../types/mb-user';

@Injectable()
export class MBMiddleware implements NestMiddleware {
  constructor(
    private httpService: HttpService,
    private mbService: MbbankService,
    private userService: UserService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const user = req.headers['user'] as string;
    let mbUser = await this.userService.get(user);

    console.log(mbUser);
    
    const { pass } = mbUser;
  
    this.httpService.axiosRef.interceptors.request.clear();
    this.httpService.axiosRef.interceptors.response.clear();

    if (!mbUser.state) {
      mbUser = await this.mbService.loginCaptcha(user, pass);
    }

    req.headers = {
      ...req.headers,
      deviceId: mbUser.deviceId,
      sessionId: mbUser.sessionId,
    };

    const requestInterceptor = this.setInterceptorRequest(mbUser);

    this.httpService.axiosRef.interceptors.response.use(async (config) => {
      const {
        result: { responseCode },
      } = config.data;

      if (responseCode !== '00' && responseCode !== 'GW999') {
        (this.httpService.axiosRef?.interceptors?.request as any)?.clear();
        mbUser = await this.mbService.loginCaptcha(user, pass);
        this.setInterceptorRequest(mbUser);
        return this.httpService.axiosRef.request(config)
      }
      return config;
    });

    next();
  }

  setInterceptorRequest(mbUser: MBUser) {
    return this.httpService.axiosRef.interceptors.request.use((config) => {
        const refNo = makeRefNo(mbUser.user);
        config.headers.set('Deviceid', mbUser.deviceId);
        config.headers.set('X-Request-Id', refNo);
        config.headers.set('RefNo', refNo);

        config.data = {
          ...config.data,
          sessionId: mbUser.sessionId,
          deviceIdCommon: mbUser.deviceId,
          refNo,
        };
        return config;
      });
  }
}
