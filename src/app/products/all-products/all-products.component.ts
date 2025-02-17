import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Product } from 'src/app/interfaces/product';
import { ProductsService } from 'src/app/services/products.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.css']
})
export class AllProductsComponent implements OnInit{
productList:Product[]=[];
isAdmin!:boolean;

constructor(private productService:ProductsService, private router:Router,private userService: UserService,
  private fireStore: AngularFirestore){

}

async ngOnInit(): Promise<void> {
  this.productService.getProductsObservable().subscribe((products:Product[])=>{
    this.productList=products;
  })
  this.isAdmin = await this.userService.isAdmin(this.fireStore);
  console.log("Admin user", this.isAdmin);
}

view(id:string|undefined){
  this.router.navigate(['/product', id]);
}

delete(product:Product){
  if(product){
    this.productService.deleteProduct(product);
  } 
}

}
