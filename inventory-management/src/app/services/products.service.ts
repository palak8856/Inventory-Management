import { Injectable } from '@angular/core';
import { Product } from '../interfaces/product';
import Products from '../products/products.data';
import { BehaviorSubject, Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  product!: Product;
  products:Product[]=Products;
  private productsSubject = new BehaviorSubject<Product[]>(this.products);
  private cartProducts = new BehaviorSubject<Product[]>([]);
  private orders = new BehaviorSubject<Product[]>([]);

  constructor(private firestore: AngularFirestore, private http:HttpClient) { }

  getProductsObservable(): Observable<Product[]> {
    return this.firestore.collection<Product>('products').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Product;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }
  
  async addProduct(product: Product) {
    try {
      return await this.firestore.collection('products').add(product);
    } catch (error) {
      return console.log(error);
    }
  }
  
  getCartProducts(): Observable<Product[]> {
    return this.firestore.collection<Product>('cart').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Product;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }  

  getOrders(): Observable<Product[]> {
    return this.firestore.collection<Product>('orders').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Product;
        const id = a.payload.doc.id;
        return {...data,id };
      }))
    );
  }
  
  getProductById(id: string): Observable<Product | undefined> {
    return this.firestore.collection<Product>('products').doc(id).snapshotChanges().pipe(
      map(doc => {
        if (doc.payload.exists) {
          return { id: doc.payload.id, ...doc.payload.data() } as Product;
        }
        return undefined;
      })
    );
  }  
  
  addToCart(product: Product) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    product.userEmail = user.email; 
    product.userName = user.name;
  
    const cartRef = this.firestore.collection('cart').doc(product.id + '_' + user.email); // Unique ID for user-product
  
    cartRef.get().subscribe(docSnapshot => {
      if (docSnapshot.exists) {
        const cartProduct = docSnapshot.data() as Product;
        cartRef.update({
          quantity: (cartProduct.quantity || 0) + 1
        });
      } else {
        cartRef.set({ ...product, quantity: 1 });
      }
    });
  }
   

  checkout(product: Product) {
    const productRef = this.firestore.collection('products').doc(product.id);
  
  productRef.get().subscribe((doc) => {
    if (doc.exists) {
      const productData = doc.data() as Product;
      const newQuantity = Math.max(0, productData.quantity + product.quantity);

      // Update the product quantity in Firestore
      productRef.update({ quantity: newQuantity }).then(() => {

        this.firestore.collection('cart').doc(product.id).delete();
      });
    }
  });
  }


  buy(product: Product) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    product.status = "In-transit";
    product.timestamp = new Date().toLocaleString();
    product.userEmail = user.email;  
    product.userName = user.name;
    
    this.firestore.collection('orders').add(product)
    .then(() => {
      console.log("Order successfully placed with user details:", product);
      this.firestore.collection('cart').doc(product.id).delete(); 
    })
  }
  

  updateProduct(updatedProduct: Product) {
    return this.firestore.collection('products').doc(updatedProduct.id).update(updatedProduct);
  }  

  deleteProduct(deletedProduct: Product) {
    this.updateCartProductQuantity(deletedProduct,0);
    return this.firestore.collection('products').doc(deletedProduct.id).delete();
  }  


  updateCartProductQuantity(product: Product, change: number) {
    const cartRef = this.firestore.collection('cart').doc(product.id);
  
    cartRef.get().subscribe((doc) => {
      if (doc.exists) {
        const cartItem = doc.data() as Product;
        const newQuantity = Math.max(0, cartItem.quantity + change);
  
        if (newQuantity === 0 || change===0) {
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
    if (!updatedOrder.id) {
      console.error("Error: Order ID is missing");
      return;
    }
      console.log("Updated Order ID is ",updatedOrder.id);
      return this.firestore.collection('orders').doc(updatedOrder.id).update(updatedOrder);
}

getOrdersForUser(userEmail: string): Observable<Product[]> {
  return this.firestore
    .collection<Product>('orders', ref => ref.where('userEmail', '==', userEmail)) 
    .snapshotChanges()
    .pipe(
      map(actions => 
        actions.map(a => {
          const data = a.payload.doc.data() as Product;
          const id = a.payload.doc.id;
          return { ...data, id };
        })
      )
    );
}


getCartForUser(userEmail: string): Observable<Product[]> {
  return this.firestore
    .collection<Product>('cart', ref => ref.where('userEmail', '==', userEmail)) // Filter for user
    .snapshotChanges()
    .pipe(
      map(actions => 
        actions.map(a => {
          const data = a.payload.doc.data() as Product;
          const id = a.payload.doc.id;
          return { ...data, id };
        })
      )
    );
}

}
