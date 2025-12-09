import { Routes } from '@angular/router';

// 🔑 Importa tus componentes standalone
// Asegúrate de que las rutas a los archivos .ts sean correctas
import { Home } from './components/home/home';
import { ProductsList } from './components/products-list/products-list';
import { ProductForm } from './components/product-form/product-form';
import { CategoriesList } from './components/categories-list/categories-list';
import { CategoryForm } from './components/category-form/category-form';
import { Login } from './components/login/login';
import { Cart } from './components/cart/cart';
import { Contact } from './components/contact/contact';
// Asumiendo que tienes un componente Contacto, Carrito, etc., añádelos aquí


export const routes: Routes = [
  { path: '', component: Home },
  { path: 'productos', component: ProductsList },
  { path: 'producto-nuevo', component: ProductForm },
  { path: 'categorias', component: CategoriesList },
  { path: 'categoria-nueva', component: CategoryForm },
  { path: 'login', component: Login },
  { path: 'carrito', component: Cart },
  { path: 'contacto', component: Contact },
];
