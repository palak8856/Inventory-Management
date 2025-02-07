import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm!:FormGroup;
  // loggedInUser!:User;
  
  constructor(private formBuilder:FormBuilder, private userService: UserService, private router:Router){};
  
  ngOnInit(): void {
    this.registerForm=this.formBuilder.group({
      email:["", Validators.required],
      password:["", Validators.required]
    })
  }
  
  register(){
    this.router.navigate(["/home"]);
  }

  onSubmit(){
  if(this.registerForm.invalid){return;}
  
  const email=this.registerForm.value.email;
  const password=this.registerForm.value.password;
  
    this.userService.register(email,password).subscribe(
      (response)=>console.log(response),
      (error)=>console.log(error)
    );
  
  this.registerForm.reset();
  }
}
