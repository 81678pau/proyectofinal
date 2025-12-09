import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CarritoService } from '../../services/carrito.services';

@Component({
  selector: 'cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.html',
  styleUrls: ['./cart.scss']
})
export class Cart {
  carrito = inject(CarritoService);
  router = inject(Router);
  mensaje: string = '';

  onCheckout() {
    if (this.carrito.cart().length === 0) return;

    this.carrito.checkout()?.subscribe({
      next: (res: any) => {
        this.mensaje = `Exito: ${res.mensaje}`;
        this.carrito.clearCart();

        setTimeout(() => {
          this.router.navigate(['/productos']);
        }, 2000);
      },
      error: (err) => {
        console.error(err);
        this.mensaje = 'Error: al procesar la compra. Intenta de nuevo.';
      }
    });

    if (!this.carrito.checkout()) {
      this.router.navigate(['/login']);
    }
  }
}
