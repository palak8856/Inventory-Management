import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/interfaces/product';
import { User } from 'src/app/interfaces/user';
import { ProductsService } from 'src/app/services/products.service';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit{
  productId: string | null = null;
  product: Product | undefined;
  user: User | null = null;

  constructor(private route: ActivatedRoute, private productService:ProductsService, private userService: UserService, private fireStore:AngularFirestore) {};

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');

    if (this.productId) {
      this.productService.getProductById(this.productId).subscribe((product)=>{
        this.product=product;
      });
    }

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if(user){
      this.user=user;
      console.log(user);
    }
  }

 async increaseQuantity(product:Product){
    if (!this.user) return;

    this.userService.isAdmin(this.fireStore).then(isAdmin => {
      if (isAdmin) {
      console.log("admin role");
      product.quantity++;
      this.productService.updateProduct(product);
      } else {
        if(product.quantity>0){
          product.quantity--;
          this.productService.updateProduct(product); 
          this.productService.addToCart(product);
          this.productService.updateCartProductQuantity(product, 1);
          } 
      }
    });
    
  }

 async decreaseQuantity(product:Product){
    if (!this.user) return;

      this.userService.isAdmin(this.fireStore).then(isAdmin => {
        if(isAdmin){
          if (product.quantity > 0) {
            product.quantity--;
            if (product.quantity === 0) {
              this.productService.deleteProduct(product);
            } else {
              this.productService.updateProduct(product);
            }
          }
        }
    else {
      this.productService.updateCartProductQuantity(product, -1);
    }
  });
}
}
