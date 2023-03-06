import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { user, User } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { UserModel } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  user$: Observable<UserModel> | undefined;
  constructor(private httpCLient: HttpClient) {}

  post(user: UserModel) {
    console.log(user);
    return this.httpCLient.post('http://localhost:3000/v1/user/create', user);
  }

  getProfile(uid: string) {
    console.log(uid);
    return this.httpCLient.get<UserModel>(
      `http://localhost:3000/v1/user/${uid}`
    );
  }
}
