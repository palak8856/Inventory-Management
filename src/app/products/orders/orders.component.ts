import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/interfaces/product';
import { User } from 'src/app/interfaces/user';
import { ProductsService } from 'src/app/services/products.service';
import { UserService } from 'src/app/services/user.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit{

  orders: Product[]=[];
  user!:User;
  userName!: string;
  isAdminRole!:boolean;

  constructor(private productService:ProductsService, private userService:UserService, private fireStore:AngularFirestore){};

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    this.userName = this.user?.name;
    console.log(this.userName);
    this.verifyAdminRole();
  }

  async verifyAdminRole() {
    try {
      this.isAdminRole = await this.userService.isAdmin(this.fireStore);
      if (this.isAdminRole) {
        this.productService.getOrders().subscribe((products: Product[]) => {
          this.orders = products;
        });
      } 
      else if (this.user.email) {
        this.productService.getOrdersForUser(this.user.email).subscribe((products: Product[]) => {
          this.orders = products;
        });
      } 
    } catch (error) {
      console.error("Error verifying admin role:", error);
    }
  }
  
  updateOrderStatus(order: Product, event: Event) {
    console.log("Updated event", event);
    const newStatus = (event.target as HTMLSelectElement).value;
    console.log("New Status is", newStatus);
    order.status = newStatus;
    this.productService.updateOrder(order);
  }
  
}
