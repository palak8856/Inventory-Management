import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Product } from 'src/app/interfaces/product';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit{
productForm!: FormGroup;

constructor(private formBuilder:FormBuilder, private router:Router, private productService: ProductsService){};

ngOnInit(): void {
  this.productForm=this.formBuilder.group({
    productName:["", Validators.required],
    productDescription:["", Validators.required],
    quantity:["", [Validators.required, Validators.min(0)]]
  })
}

submit(){
  if(this.productForm.invalid){
      return;
  }

  const product: Product = {
    name: this.productForm.value.productName,
    description: this.productForm.value.productDescription,
    quantity: this.productForm.value.quantity,
    status: "available", 
  };

  this.productService.addProduct(product);
  this.router.navigate(["/home"]);
  this.productForm.reset();
}
}
