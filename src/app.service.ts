import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): Object {
    return [
      {
        id: new Date().getMilliseconds(),
        first: "tom",
        favorite: true
      },
      {
        id: "2",
        favorite: false
      },
      {
        id: "3",
        last: "mimi",
        favorite: true
      }
    ];
  }
  login(params: any = {}): Object {
    if (params.username == "lileilei@ewell.cc" && params.password === "123456") {
      return {
        status: 1,
        uuid: "111",
        token: "3333",
        name: "超级管理员",
        username: params.username,
        password: "123456"
      }
    }
    return {
      status: 0,
      message: "密码错误"
    }
  }
}
