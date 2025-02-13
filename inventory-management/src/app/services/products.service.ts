import { Injectable } from '@angular/core';
import { Product } from '../interfaces/product';
import Products from '../products/products.data';
import { BehaviorSubject, Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  product!: Product;
  products:Product[]=Products;
  private productsSubject = new BehaviorSubject<Product[]>(this.products);
  private cartProducts = new BehaviorSubject<Product[]>([]);
  private orders = new BehaviorSubject<Product[]>([]);

  constructor(private firestore: AngularFirestore) { }

  getProductsObservable(): Observable<Product[]> {
    return this.firestore.collection<Product>('products').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const { id, ...dataWithoutId } = a.payload.doc.data() as Product; 
        return { ...dataWithoutId, id: a.payload.doc.id };
      }))
    );
  }

  addProduct(product: Product) {
    return this.firestore.collection('products').add(product);
  }
  
  getCartProducts(): Observable<Product[]> {
    return this.firestore.collection<Product>('cart').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const { id, ...dataWithoutId } = a.payload.doc.data() as Product; 
        return { ...dataWithoutId, id: a.payload.doc.id };
      }))
    );
  }
  

  getOrders(): Observable<Product[]> {
    return this.firestore.collection<Product>('orders').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const { id, ...dataWithoutId } = a.payload.doc.data() as Product; 
        return { ...dataWithoutId, id: a.payload.doc.id };
      }))
    );
  }
  
  getProductById(id: string): Observable<Product | undefined> {
    return this.firestore.collection<Product>('products').doc(id).snapshotChanges().pipe(
      map(doc => {
        if (doc.payload.exists) {
        const data = doc.payload.data() as Product;
        const { id: existingId, ...dataWithoutId } = data; 
        return { ...dataWithoutId, id: doc.payload.id } as Product;
        }
        return undefined;
      })
    );
  }
  

  addToCart(product: Product) {
    return this.firestore.collection('cart').doc(product.id).set(product);
  }  

  checkout(product: Product) {
    return this.firestore.collection('cart').doc(product.id).delete();
  }


  buy(product: Product) {
    product.status = "In-transit";
    product.timestamp = new Date().toLocaleString();
    
    this.firestore.collection('orders').add(product);
    this.firestore.collection('cart').doc(product.id).delete();
  }


  updateProduct(updatedProduct: Product) {
    return this.firestore.collection('products').doc(updatedProduct.id).update(updatedProduct);
  }  

  deleteProduct(id: string) {
    return this.firestore.collection('products').doc(id).delete();
  }  


  updateCartProductQuantity(product: Product, change: number) {
    const cartRef = this.firestore.collection('cart').doc(product.id);
  
    cartRef.get().subscribe((doc) => {
      if (doc.exists) {
        const cartItem = doc.data() as Product;
        const newQuantity = Math.max(0, cartItem.quantity + change);
  
        if (newQuantity === 0) {
          cartRef.delete(); // Remove item from cart if quantity is 0
        } else {
          cartRef.update({ quantity: newQuantity });
        }
      } else if (change > 0) {
        cartRef.set({ ...product, quantity: change }); // Add new item to cart
      }
    });
  }
  

  updateOrder(updatedOrder: Product) {
    return this.firestore.collection('orders').doc(updatedOrder.id).update(updatedOrder);
  }
  
}
