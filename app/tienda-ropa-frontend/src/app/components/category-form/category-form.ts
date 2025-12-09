import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './category-form.html',
  styleUrls: ['./category-form.scss']
})
export class CategoryForm implements OnInit {
  categoryForm!: FormGroup;
  isEditMode: boolean = false;
  categoryId: number | null = null;
  mensaje: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Inicializar formulario
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      imageUrl: [''],
      status: ['active', Validators.required],
      season: ['All Seasons', Validators.required],
      gender: ['Unisex', Validators.required]
    });

    // Verificar si estamos en modo edición
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.categoryId = +params['id'];
        this.loadCategory(this.categoryId);
      }
    });
  }

  loadCategory(id: number) {
    this.isLoading = true;
    this.http.get(`http://localhost:3000/api/categories/${id}`)
      .subscribe({
        next: (category: any) => {
          this.categoryForm.patchValue({
            name: category.name,
            description: category.description,
            imageUrl: category.imageUrl,
            status: category.status,
            season: category.season,
            gender: category.gender
          });
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error al cargar categoría:', err);
          this.mensaje = '❌ Error al cargar categoría';
          this.isLoading = false;
        }
      });
  }

  onSubmit() {
    if (this.categoryForm.invalid) {
      this.mensaje = '❌ Por favor completa todos los campos obligatorios';
      Object.keys(this.categoryForm.controls).forEach(key => {
        this.categoryForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isLoading = true;
    const datos = this.categoryForm.value;

    const request = this.isEditMode
      ? this.http.patch(`http://localhost:3000/api/categories/${this.categoryId}`, datos)
      : this.http.post('http://localhost:3000/api/categories', datos);

    request.subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.mensaje = `✅ Categoría ${this.isEditMode ? 'actualizada' : 'creada'} exitosamente`;

        setTimeout(() => {
          this.router.navigate(['/categorias']);
        }, 1500);
      },
      error: (err) => {
        console.error('Error:', err);
        this.isLoading = false;

        if (err.error?.error) {
          this.mensaje = `❌ ${err.error.error}`;
        } else {
          this.mensaje = `❌ Error al ${this.isEditMode ? 'actualizar' : 'crear'} categoría`;
        }
      }
    });
  }

  cancel() {
    this.router.navigate(['/categorias']);
  }

  hasError(field: string, error: string): boolean {
    const control = this.categoryForm.get(field);
    return !!(control && control.hasError(error) && control.touched);
  }

  isFieldInvalid(field: string): boolean {
    const control = this.categoryForm.get(field);
    return !!(control && control.invalid && control.touched);
  }
}
