import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeneralApiService {

  constructor(private http: HttpClient) { }

  searchByKeyword(apiUrl: string, searchKeyword: string): Observable<any> {
    const url = `${apiUrl}?q=${encodeURIComponent(searchKeyword)}`;
    return this.http.get(url);
  }
}
