import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
// ⚠️ Importante: Necesitas el RouterModule para que funcionen los [routerLink]
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  // Importamos RouterModule para que Angular reconozca [routerLink]
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss']
})
export class Navbar {
    // No necesitamos el constructor ni la función goToProducts() si usamos solo routerLink
    // Pero la inyección del Router es necesaria para la solución de Productos (Opción B)

    // Dejamos el constructor con el Router para prevenir futuros problemas de inyección
    // o si necesitas navegar programáticamente después:
    constructor(private router: Router) { }
}
