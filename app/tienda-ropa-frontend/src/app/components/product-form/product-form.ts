import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

interface Category {
  categoryId: number;
  name: string;
}

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.html',
  styleUrls: ['./product-form.scss']
})
export class ProductForm implements OnInit {
  productForm!: FormGroup;
  isEditMode: boolean = false;
  productId: number | null = null;
  mensaje: string = '';
  isLoading: boolean = false;
  categories: Category[] = [];
  loadingCategories: boolean = true;

  // Para simular usuario logueado (después lo cambiarás por el real)
  currentUserId: number = 1; // 👈 Temporal

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    // Cargar categorías primero
    this.loadCategories();

    // Inicializar formulario
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      size: [''],
      color: [''],
      imageUrl: [''],
      categoryId: ['', Validators.required]
    });

    // Verificar si estamos en modo edición
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.productId = +params['id'];
        this.loadProduct(this.productId);
      }
    });
  }

  loadCategories() {
    this.loadingCategories = true;
    this.http.get<Category[]>('http://localhost:3000/api/categories')
      .subscribe({
        next: (data) => {
          this.categories = data;
          this.loadingCategories = false;
          console.log('Categorías cargadas:', data);
        },
        error: (err) => {
          console.error('Error al cargar categorías:', err);
          this.loadingCategories = false;
          this.mensaje = 'Error: al cargar categorías';
        }
      });
  }

  loadProduct(id: number) {
    this.isLoading = true;
    this.http.get(`http://localhost:3000/api/products/${id}`)
      .subscribe({
        next: (product: any) => {
          this.productForm.patchValue({
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            size: product.size,
            color: product.color,
            imageUrl: product.imageUrl,
            categoryId: product.categoryId
          });
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error al cargar producto:', err);
          this.mensaje = '❌ Error al cargar producto';
          this.isLoading = false;
        }
      });
  }

  onSubmit() {
    if (this.productForm.invalid) {
      this.mensaje = 'Error: Por favor completa todos los campos obligatorios';
      Object.keys(this.productForm.controls).forEach(key => {
        this.productForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isLoading = true;
    const datos = {
      ...this.productForm.value,
      createdByUserId: this.currentUserId // 👈 Agrega el usuario que lo crea
    };

    const request = this.isEditMode
      ? this.http.patch(`http://localhost:3000/api/products/${this.productId}`, datos)
      : this.http.post('http://localhost:3000/api/products', datos);

    request.subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.mensaje = `Exito: Producto ${this.isEditMode ? 'actualizado' : 'creado'} exitosamente`;

        setTimeout(() => {
          this.router.navigate(['/productos']);
        }, 1500);
      },
      error: (err) => {
        console.error('Error:', err);
        this.isLoading = false;

        if (err.error?.error) {
          this.mensaje = `Error: ${err.error.error}`;
        } else {
          this.mensaje = `Error: al ${this.isEditMode ? 'actualizar' : 'crear'} producto`;
        }
      }
    });
  }

  cancel() {
    this.router.navigate(['/productos']);
  }

  hasError(field: string, error: string): boolean {
    const control = this.productForm.get(field);
    return !!(control && control.hasError(error) && control.touched);
  }

  isFieldInvalid(field: string): boolean {
    const control = this.productForm.get(field);
    return !!(control && control.invalid && control.touched);
  }
}
