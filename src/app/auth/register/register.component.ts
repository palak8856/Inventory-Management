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
  
  constructor(private formBuilder:FormBuilder, private userService: UserService, private router:Router){};
  
  ngOnInit(): void {
    this.registerForm=this.formBuilder.group({
      name:["",Validators.required],
      email:["", Validators.required],
      password:["", Validators.required],
      phone:["",Validators.required],
      address:["",Validators.required],
      pincode:["",Validators.required]
    })
  }

  onSubmit(){
  if(this.registerForm.invalid){
    alert("Enter all the fields correctly.");  
    return;
  }
  
  const email=this.registerForm.value.email;
  const password=this.registerForm.value.password;
  const name=this.registerForm.value.name;
  
    this.userService.register(email,password).subscribe({
      next: (response)=>console.log(response),
      error: (error)=>console.log(error)
  });
  
  const user={
    email:email,
    password:password,
    name:name
  }
  
  localStorage.setItem('registeredUser', JSON.stringify(user));
  this.router.navigate(['home'],{replaceUrl:true});
  this.registerForm.reset();
  }
}
