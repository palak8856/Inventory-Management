import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/interfaces/product';
import { User } from 'src/app/interfaces/user';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit{

  CartItems:Product[]=[];
  user!:User;

  constructor(private productService:ProductsService){

  }

  ngOnInit(): void {
  this.user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (this.user.email) {
    this.productService.getCartForUser(this.user.email).subscribe((products: Product[]) => {
      this.CartItems = products;
    });
  } else {
    console.error("User email not found!");
  }
  }

  checkout(item:Product){
    this.productService.checkout(item);
  }

  buy(item:Product){
    this.productService.buy(item);
  }
}
