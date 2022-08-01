import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios'
import { Observable, firstValueFrom,lastValueFrom } from 'rxjs';
@Injectable()
export class UserService {
  constructor(private readonly HttpService: HttpService) {}
  user = [
    {
      id: 1,
      email: 'karanschdev@gmail.com',
      username: 'karanschdev',
      full_name: 'Karanschdev',
      password: '$2b$10$oajEAQNfLrTrDqJtEUeTuuXvjRa/pP.2qfO6rtB9oxmq7weQowuwq',
    },
    {
      id: 2,
      email: 'karanschdev2@gmail.com',
      username: 'karanschdev2',
      full_name: 'Karanschdev',
      password: '$2b$10$oajEAQNfLrTrDqJtEUeTuuXvjRa/pP.2qfO6rtB9oxmq7weQowuwq',
    },
    {
      id: 3,
      email: 'karanschdev3@gmail.com',
      username: 'karanschdev3',
      full_name: 'Karanschdev',
      password: '$2b$10$oajEAQNfLrTrDqJtEUeTuuXvjRa/pP.2qfO6rtB9oxmq7weQowuwq',
    },
  ];

  async getByEmail(email: string): Promise<any> {
    let password = this.user.find((x) => {
      let res = x.email === email ? x.password : undefined;
      return res;
    });
    if (password) {
      return password['password'];
    }
    throw new HttpException(
      'User with this email does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async search(title: string): Promise<any> {
    const params = {
      t: title,
      apikey: process.env.API_KEY,
    };
    let x=await lastValueFrom(this.HttpService.get('https://www.omdbapi.com/', {params}));
    console.log(x.data);
    return x.data;
  }

  async getById(id: number): Promise<any> {
    let res = this.user.find((x) => (x.id === id ? x.id : null));
    if (res != undefined && res != null) {
      return res;
    }
    throw new HttpException(
      'User with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async getByBasicData(email_or_id: any): Promise<any> {
    let res =
      typeof email_or_id === 'string'
        ? this.user.find((x) => (x.email === email_or_id ? x : undefined))
        : this.user.find((x) => (x.id === email_or_id ? x : undefined));
    if (res) {
      return res;
    }
    throw new HttpException(
      'User with this email does not exist',
      HttpStatus.NOT_FOUND,
    );
  }
}
