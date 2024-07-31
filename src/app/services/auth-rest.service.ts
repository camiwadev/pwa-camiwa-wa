import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders }  from '@angular/common/http';
import { Observable }  from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import { UserInterface } from '@app/interfaces/user-interface';
import { PocketAuthService } from '@services/pocket-auth.service'; // Importa el nuevo servicio

@Injectable({
  providedIn: 'root'
})
export class AuthRESTService {
  constructor(
	private http: HttpClient
	) { }
	headers : HttpHeaders = new HttpHeaders({
		"Content-Type":"application/json"
		});

	//registerUser( email: string, password: string,status :string,userType :string){
	registerUser( email: string, password: string,type:string){
		const url_api ='http://localhost:7777/api/Users';
		return this.http
		//.post<UserInterface>(url_api,{email,password,status,userType},{headers:this.headers})
		.post<UserInterface>(url_api,{email,password,type},{headers:this.headers})
		.pipe(map(data => data));
	}
	loginUser(email:string, password:string):Observable<any>{
		const url_api ='http://localhost:7777/api/Users/login?include=user';
		return this.http
		.post<UserInterface>(url_api,{email,password},{headers:this.headers})
		.pipe(map(data => data));
	}
  	setUser(user:UserInterface):void{
  		let user_string = JSON.stringify(user);
  		let type = JSON.stringify(user.type);
  		localStorage.setItem("currentUser",user_string);
		localStorage.setItem("type",type);
  	}
	setType(user:UserInterface):void{
		let user_string = JSON.stringify(user.type);
		localStorage.setItem("type",user_string);
	}	
	getType(): string | null {
		return localStorage.getItem("type");
	  }
  	setToken(token:any): void{
  		localStorage.setItem("accessToken",token);
  	}
	getToken(){
	 	return localStorage.getItem("accessToken");
	  }
	getStatus(){
		return localStorage.getItem("status");

	}
	isLogin(){
		return localStorage.getItem("isLoggedin");

	}
	getCurrentUser(): UserInterface {
    let user_string = localStorage.getItem("currentUser");
	    if (user_string ) {
		      let user: UserInterface = JSON.parse(user_string!);
		      return user;
		    } else { 
		      return null!;
			}
  		}
		  createBooking(bookingData: any): Observable<any> {
			const url = 'https://db.buckapi.com:8090/api/collections/camiwaBookings/records';
			return this.http.post<any>(url, bookingData, { headers: this.headers })
			  .pipe(map(response => response));
		  }
		

	 logoutUser(){
	  	let accessToken = localStorage.getItem('accessToken');
		  	const url_api = 'http://localhost:7777/api/users/logout?access_token=${accessToken}';
		   	localStorage.removeItem('accessToken');
		  	localStorage.removeItem('currentUser');
			  localStorage.removeItem('isLoggedin');
			  localStorage.removeItem('dist');
			  localStorage.removeItem('userId');
			  localStorage.removeItem('type');
			  localStorage.removeItem('clientCard');
			  localStorage.removeItem('clientFicha');
			  // this._butler.userActive={};
		  	return this.http.post<UserInterface>(url_api,{headers: this.headers});
	 	}
}