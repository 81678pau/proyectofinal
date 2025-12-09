import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface Category {
  categoryId: number;
  name: string;
  description: string;
  imageUrl: string;
  status: string;
  season: string;
  gender: string;
  createdAt: string;
}

@Component({
  selector: 'app-categories-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categories-list.html',
  styleUrls: ['./categories-list.scss']
})
export class CategoriesList implements OnInit {
  categories: Category[] = [];
  isLoading: boolean = true;
  mensaje: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.isLoading = true;
    this.http.get<Category[]>('http://localhost:3000/api/categories')
      .subscribe({
        next: (data) => {
          this.categories = data;
          this.isLoading = false;
          console.log('Categorías cargadas:', data);
          this.cd.detectChanges();
        },
        error: (err) => {
          console.error('Error al cargar categorías:', err);
          this.mensaje = 'Error: al cargar categorías';
          this.isLoading = false;
          this.cd.detectChanges();
        }
      });
  }

  goToCreate() {
    this.router.navigate(['/categoria-nueva']);
  }

  deleteCategory(id: number, name: string) {
    if (confirm(`¿Estás seguro de eliminar la categoría "${name}"?`)) {
      this.http.delete(`http://localhost:3000/api/categories/${id}`)
        .subscribe({
          next: () => {
            this.mensaje = 'Exito: Categoría eliminada exitosamente';
            this.loadCategories();
            this.cd.detectChanges();

            setTimeout(() => {
              this.mensaje = '';
              this.cd.detectChanges();
            }, 3000);
          },
          error: (err) => {
            console.error('Error al eliminar:', err);
            this.mensaje = 'Error: al eliminar categoría';
            this.cd.detectChanges();
          }
        });
    }
  }
}
