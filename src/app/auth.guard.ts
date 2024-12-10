import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem('token'); // Verifica si el token existe
  if (token) {
    return true; // Permite el acceso
  } else {
    // Redirige al inicio de sesión si no está autenticado
    window.location.href = '/login';
    return false;
  }
};
