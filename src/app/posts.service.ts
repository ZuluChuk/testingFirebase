import { Injectable } from '@angular/core';
import {PostModel} from './post.model';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {Subject, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  error = new Subject<string>();
  constructor(private http: HttpClient) {}

  createAndStorePost(title: string, content: string){
    const postData: PostModel = {title: title, content: content};
    return this.http
      .post<{ name: string }>(
        'https://ng-angular-8fd2e.firebaseio.com/posts.json',
        postData,

      )
      .subscribe(responseData => {
        console.log(responseData);
      }, error => {
        this.error.next(error.message);
      });
  }

  fetchPosts() {
    let searchParams = new HttpParams();
    searchParams = searchParams.append('print', 'pretty');
    searchParams = searchParams.append('custom', 'key');
    return this.http
      .get<{ [key: string]: PostModel }>(
        'https://ng-angular-8fd2e.firebaseio.com/posts.json',
        {
          headers: new HttpHeaders({'Custom-Header': 'Hello'}),
          params: searchParams
        }
      )
      .pipe(
        map(responseData => {
          const postsArray: PostModel[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              postsArray.push({ ...responseData[key], id: key });
            }
          }
          return postsArray;
        }),
        catchError(errorRes => {
          // send some data
          return throwError(errorRes);
        })
      );
  }

  deletePosts() {
    return this.http
      .delete('https://ng-angular-8fd2e.firebaseio.com/posts.json');
  }
}
