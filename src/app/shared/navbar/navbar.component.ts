import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
constructor(private authService:UserService, private router:Router){};

logout(){
  this.authService.logout();
}

goToCart(){
  this.router.navigate(["/cart"]);
}

addProduct(){
  this.router.navigate(["/add-product"]);
}

goToOrders(){
  this.router.navigate(["/orders"]);
}
}
