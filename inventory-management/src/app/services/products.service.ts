import { Injectable } from '@angular/core';
import { Product } from '../interfaces/product';
import Products from '../products/products.data';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  products:Product[]=Products;
  private productsSubject = new BehaviorSubject<Product[]>(this.products);
  private cartProducts = new BehaviorSubject<Product[]>([]);
  private orders = new BehaviorSubject<Product[]>([]);

  constructor() { }

  getProductsObservable():Observable<Product[]>{
    return this.productsSubject.asObservable();
  }

  getCartProducts():Observable<Product[]>{
    return this.cartProducts.asObservable();
  }

  getOrders():Observable<Product[]>{
    return this.orders.asObservable();
  }
}
