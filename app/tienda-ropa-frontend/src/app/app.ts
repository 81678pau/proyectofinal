import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common';
import { Navbar } from './components/navbar/navbar';
import { Footer } from './components/footer/footer';
import { Home } from './components/home/home';
import { ProductsList } from './components/products-list/products-list';
import { ProductDetail } from './components/product-detail/product-detail';
import { ProductForm } from './components/product-form/product-form';
import { CategoriesList } from './components/categories-list/categories-list';
import { CategoryForm } from './components/category-form/category-form';
import { Login } from './components/login/login';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, Navbar, Footer, Home, ProductsList, ProductDetail, ProductForm, CategoriesList, CategoryForm, FormsModule, Login],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  protected readonly title = signal('tienda-ropa-frontend');
}
