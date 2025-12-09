import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface CartItem {
  product: any;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  cart = signal<CartItem[]>([]);

  constructor(private http: HttpClient) {
    this.loadFromStorage();
  }

  addToCart(product: any) {
    const items = this.cart();
    // Use productId matching the backend model
    const existing = items.find(i => i.product.productId === product.productId);

    if (existing) {
      existing.quantity++;
      this.cart.set([...items]);
    } else {
      this.cart.set([...items, { product, quantity: 1 }]);
    }
    this.saveToStorage();
  }

  updateQuantity(productId: number, change: number) {
    const items = this.cart();
    const item = items.find(i => i.product.productId === productId);

    if (item) {
      const newQuantity = item.quantity + change;
      if (newQuantity > 0) {
        item.quantity = newQuantity;
        this.cart.set([...items]); // Trigger signal update
        this.saveToStorage();
      }
    }
  }

  removeFromCart(productId: number) {
    this.cart.set(this.cart().filter(i => i.product.productId !== productId));
    this.saveToStorage();
  }

  clearCart() {
    this.cart.set([]);
    this.saveToStorage();
  }

  getTotal(): number {
    return this.cart().reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );
  }

  checkout() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('Debes iniciar sesión (o registrarte) primero para comprar.');
      return;
    }

    const orderData = {
      userId: parseInt(userId),
      total: this.getTotal(),
      items: this.cart().map(item => ({
        productId: item.product.productId,
        quantity: item.quantity,
        price: item.product.price
      }))
    };

    return this.http.post('http://localhost:3000/api/orders', orderData);
  }

  private saveToStorage() {
    localStorage.setItem('cart', JSON.stringify(this.cart()));
  }

  loadFromStorage() {
    const stored = localStorage.getItem('cart');
    if (stored) {
      this.cart.set(JSON.parse(stored));
    }
  }
}
