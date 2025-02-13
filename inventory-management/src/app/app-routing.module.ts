import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './home/home/home.component';
import { AuthGuard } from './auth/auth.guard';
import { ProductComponent } from './products/product/product.component';
import { CartComponent } from './products/cart/cart.component';
import { OrdersComponent } from './products/orders/orders.component';

const routes: Routes = [
  {
    path:"", redirectTo:'login', pathMatch:'full',
  },
  {
    path:'login',
    component: LoginComponent
  },
  {
    path:'home',
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  { path: 'product/:id', 
    component: ProductComponent 
  },
  {
    path:'cart',
    component: CartComponent
  },
  {
    path:'orders',
    component: OrdersComponent
  }
  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
