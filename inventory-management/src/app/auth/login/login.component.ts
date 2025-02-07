import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms'
import { Router } from '@angular/router';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
loginForm!:FormGroup;
isLoginmode!: boolean;
loggedInUser!:User;

constructor(private formBuilder:FormBuilder, private userService: UserService, private router:Router){};

ngOnInit(): void {
  this.loginForm=this.formBuilder.group({
    email:["", Validators.required],
    password:["", Validators.required]
  })
}

login(){
this.isLoginmode=true;
}

register(){
this.isLoginmode=false;
}

onSubmit(){
if(this.loginForm.invalid){return;}

const email=this.loginForm.value.email;
const password=this.loginForm.value.password;

if(this.isLoginmode){
  this.userService.login(email,password).subscribe(
    (response)=>console.log(response),
    (error)=>console.log(error)
  );

const user = JSON.parse(localStorage.getItem('user') || '{}'); 
if (user) {
    localStorage.setItem('user', JSON.stringify(user));
    this.router.navigate(['/home']);
  } 
else {
    alert('Invalid email or password'); 
  }
}
else{ //register
  this.userService.register(email,password).subscribe(
    (response)=>console.log(response),
    (error)=>console.log(error)
  );
}

this.loginForm.reset();
}
}
