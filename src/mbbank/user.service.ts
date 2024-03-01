import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { AddMBUser } from './dto/add-user.request';
import { md5 } from './utils';

@Injectable()
export class UserService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async get(username: string) {
    return ((await this.cacheManager.get(username)) as any) || {};
  }

  async add(payload: AddMBUser) {
    const { username, password } = payload;
    const data = {
      user: username,
      pass: md5(password),
      custId: '',
      sessionId: '',
      deviceNo: '',
      deviceId: '',
      state: false,
    };

    return await this.cacheManager.set(username, data, 0);
  }

  async remove(username: string) {
    return await this.cacheManager.del(username);
  }

  async update(username: string, data: any) {
    const oldData = ((await this.cacheManager.get(username)) as object) || {};
    await this.cacheManager.set(username, { ...oldData, ...data }, 0);
    return { ...oldData, ...data };
  }
}
