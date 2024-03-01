import { Injectable } from '@nestjs/common';
import { generateDeviceId, generateRandomCharacter, makeRefNo } from './utils';
import { HttpService } from '@nestjs/axios';
import { map, firstValueFrom, catchError } from 'rxjs';
import * as ac from '@antiadmin/anticaptchaofficial';
import { ConfigService } from '@nestjs/config';
import { TransactionRequest } from './dto/transaction.request';
import { UserService } from './user.service';

@Injectable()
export class MbbankService {
  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
    private userService: UserService,
  ) {
    console.log(this.configService.get('MBBANK_URL'));
    ac.setAPIKey(this.configService.get('KEY_CAPTCHA'));
  }

  getCaptcha(deviceId: string) {
    const body = {
      refNo: makeRefNo(),
      deviceIdCommon: deviceId,
      sessionId: '',
    };
    return firstValueFrom(
      this.httpService
        .post('/retail-web-internetbankingms/getCaptchaImage', body)
        .pipe(map((res) => res.data)),
    );
  }

  login(user, pass, captcha, deviceId) {
    const randomStr = generateRandomCharacter(32);
    const body = {
      userId: user,
      password: pass,
      captcha: captcha,
      sessionId: null,
      refNo: makeRefNo(randomStr),
      deviceIdCommon: deviceId,
    };
    return firstValueFrom(
      this.httpService.post('/retail_web/internetbanking/doLogin', body).pipe(
        map((res) => {
          return res.data;
        }),
        catchError((err) => {
          throw err;
        }),
      ),
    );
  }

  async loginCaptcha(user: string, pass: string) {
    try {
      const deviceId = generateDeviceId();
      const { imageString } = await this.getCaptcha(deviceId);
      const textSolve = await ac.solveImage(imageString, true);
      const { cust, sessionId } = await this.login(
        user,
        pass,
        textSolve,
        deviceId,
      );

      const data = {
        custId: cust?.spiUsrCd,
        deviceId: deviceId,
        state: true,
        deviceNo: cust.softTokenList[0].deviceNo,
        sessionId,
      };

      return this.userService.update(user, data);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  balance() {
    return firstValueFrom(
      this.httpService
        .post('/api/retail-web-accountms/getBalance', {})
        .pipe(map((res) => res.data)),
    );
  }

  transaction(payload: TransactionRequest) {
    const { accountNo, fromDate, toDate } = payload;

    const body = {
      accountNo,
      fromDate,
      toDate,
      historyType: 'DATE_RANGE',
      type: 'ACCOUNT',
    };

    return firstValueFrom(
      this.httpService
        .post(
          '/api/retail-transactionms/transactionms/get-account-transaction-history',
          body,
        )
        .pipe(
          map((res) => {
            return res.data;
          }),
        ),
    );
  }
}
