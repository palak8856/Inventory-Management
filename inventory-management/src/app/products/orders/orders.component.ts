import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/interfaces/product';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit{

  orders: Product[]=[];

  constructor(private productService:ProductsService){

  }

  ngOnInit(): void {
    this.productService.getOrders().subscribe((products:Product[])=>{
      this.orders=products;
    })
  }

}
