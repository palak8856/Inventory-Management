import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/interfaces/product';
import { User } from 'src/app/interfaces/user';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit{
  productId: string | null = null;
  product: Product | undefined;
  user: User | null = null;

  constructor(private route: ActivatedRoute, private productService:ProductsService) {};

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');

    if (this.productId) {
      this.product = this.productService.getProductById(this.productId);
    }

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if(user){
      this.user=user
    }
  }

  addToCart(product:Product){
    this.productService.addToCart(product);
  }

  increaseQuantity(product:Product){
    if (!this.user) return;

    if (this.user.role === 'admin') {
      product.quantity++;
      this.productService.updateProduct(product);
    } else {
      this.productService.updateCartProductQuantity(product, 1);
    }
  }

  decreaseQuantity(product:Product){
    if (!this.user) return;

    if (this.user.role === 'admin') {
      if (product.quantity > 0) {
        product.quantity--;
        this.productService.updateProduct(product);
      }
    } else {
      this.productService.updateCartProductQuantity(product, -1);
    }
  }
}
