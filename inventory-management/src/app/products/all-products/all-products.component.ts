import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/interfaces/product';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.css']
})
export class AllProductsComponent implements OnInit{
productList:Product[]=[];

constructor(private productService:ProductsService){

}

ngOnInit(): void {
  this.productService.getProductsObservable().subscribe((products:Product[])=>{
    this.productList=products;
  })
}
}
