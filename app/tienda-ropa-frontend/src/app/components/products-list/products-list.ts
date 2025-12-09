import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CarritoService } from '../../services/carrito.services';

interface Product {
    productId: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    size: string;
    color: string;
    imageUrl: string;
    categoryId: number;
    categoryName: string;
    createdAt: string;
}

@Component({
    selector: 'app-products-list',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './products-list.html',
    styleUrls: ['./products-list.scss']
})
export class ProductsList implements OnInit {
    products: Product[] = [];
    isLoading: boolean = true;
    mensaje: string = '';

    constructor(
        private http: HttpClient,
        private router: Router,
        private cd: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.loadProducts();
    }

    loadProducts() {
        this.isLoading = true;
        this.mensaje = '';
        console.log('➡️ INICIANDO Petición HTTP a productos...');

        // Agregamos timestamp para evitar caché del navegador
        const url = `http://localhost:3000/api/products?t=${Date.now()}`;

        this.http.get<Product[]>(url)
            .subscribe({
                next: (data) => {
                    console.log('📦 DATA RECEIVED FROM API:', data); // 👈 Debugging Log
                    this.products = data;
                    this.isLoading = false;
                    this.cd.detectChanges();
                },
                error: (err) => {
                    console.error('❌ Error al cargar productos:', err);
                    this.mensaje = 'Error: al cargar productos';
                    this.isLoading = false;
                    this.cd.detectChanges();
                }
            });
    }

    carrito = inject(CarritoService);

    addToCart(product: Product) {
        this.carrito.addToCart(product);
        this.mensaje = 'Exito: Agregado al carrito';
        setTimeout(() => this.mensaje = '', 2000);
    }

    goToCreate() {
        this.router.navigate(['/producto-nuevo']);
    }

    deleteProduct(id: number, name: string) {
        if (confirm(`¿Eliminar el producto "${name}"?`)) {
            this.http.delete(`http://localhost:3000/api/products/${id}`)
                .subscribe({
                    next: () => {
                        this.mensaje = 'Exito: Producto eliminado exitosamente';
                        this.loadProducts();
                        this.cd.detectChanges();

                        setTimeout(() => {
                            this.mensaje = '';
                            this.cd.detectChanges();
                        }, 3000);
                    },
                    error: (err) => {
                        console.error('Error al eliminar:', err);
                        this.mensaje = 'Error: al eliminar producto';
                        this.cd.detectChanges();
                    }
                });
        }
    }

    formatPrice(price: any): string {
        const value = Number(price);
        if (isNaN(value)) return '$0.00';
        return `$${value.toFixed(2)}`;
    }

    getStockClass(stock: number): string {
        if (stock === 0) return 'stock-out';
        if (stock < 10) return 'stock-low';
        return 'stock-good';
    }

    getStockText(stock: number): string {
        if (stock === 0) return 'Agotado';
        if (stock < 10) return `Quedan ${stock}`;
        return `Stock: ${stock}`;
    }
}
