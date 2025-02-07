import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/interfaces/product';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit{

  CartItems:Product[]=[];

  constructor(private productService:ProductsService){

  }

  ngOnInit(): void {
    this.productService.getCartProducts().subscribe((products:Product[])=>{
      this.CartItems=products;
    })
  }

  increaseQuantity(item:Product){

  }

  decreaseQuantity(item:Product){

  }

  checkout(item:Product){

  }
}
