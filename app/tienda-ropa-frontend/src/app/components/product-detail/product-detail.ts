import { Component, inject } from '@angular/core';
import { CarritoService } from '../../services/carrito.services';

@Component({
  selector: 'product-detail',
  standalone: true,
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.scss'],
  imports: []
})
export class ProductDetail {
  carrito = inject(CarritoService);

  product: any;

  addToCart(product: any) {
    this.carrito.addToCart(product);
  }
}
