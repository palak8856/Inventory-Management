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
  userName!: string;
  userRole!: string;

  constructor(private productService:ProductsService){};

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.userName = user?.name;
    this.userRole = user?.role;
    this.productService.getOrders().subscribe((products:Product[])=>{
      this.orders=products;
    })
  }

  updateOrderStatus(order: Product, event: Event) {
    const newStatus = (event.target as HTMLSelectElement).value;
    order.status = newStatus;
    this.productService.updateOrder(order);
  }
  
}
