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

constructor(private formBuilder:FormBuilder, private userService: UserService, private router:Router){};

ngOnInit(): void {
  this.loginForm=this.formBuilder.group({
    email:["", Validators.required],
    password:["", Validators.required]
  })
}

register(){
  this.router.navigate(["/register"]);
}

onSubmit(){
if(this.loginForm.invalid){
  alert('Enter valid credentials'); 
  return;
}

const email=this.loginForm.value.email;
const password=this.loginForm.value.password;
const name = email.split('@')[0];

  this.userService.login(email, password).then(
   (response) => console.log(response), 
  ).catch((error)=>{console.log(error)});

  const user={
    email:email,
    password:password,
    name:name,
    isAuthenticated:true
  }
  
    localStorage.setItem('user', JSON.stringify(user));
    this.router.navigate(['home'],{replaceUrl:true});

this.loginForm.reset();
}
}
