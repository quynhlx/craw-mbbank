import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { MbbankService } from './mbbank.service';
import { TransactionRequest } from './dto/transaction.request';
import { AddMBUser } from './dto/add-user.request';
import { UserService } from './user.service';

@Controller('mbbank')
export class MbbankController {
  constructor(
    private readonly mbService: MbbankService,
    private readonly userService: UserService,
  ) {}

  @Get('balance')
  async getBalance() {
    return await this.mbService.balance();
  }

  @Post('transactions')
  async getTransactions(@Body() body: TransactionRequest) {
    return await this.mbService.transaction(body);
  }

  @Post('users')
  async addUser(@Body() body: AddMBUser) {
    return await this.userService.add(body);
  }

  @Delete('users/:username')
  async removeUser(@Param('username') username: string) {
    return await this.userService.remove(username);
  }

  @Get('users')
  async getUser(@Query('username') username: string) {
    return await this.userService.get(username);
  }
}
