import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/interfaces/product';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.css']
})
export class AllProductsComponent implements OnInit{
productList:Product[]=[];

constructor(private productService:ProductsService, private router:Router){

}

ngOnInit(): void {
  this.productService.getProductsObservable().subscribe((products:Product[])=>{
    this.productList=products;
  })
}

view(id:string){
  this.router.navigate(['/product', id]);
}
}
