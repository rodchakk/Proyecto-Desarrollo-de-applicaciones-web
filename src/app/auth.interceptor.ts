import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Obtener el token del localStorage
  const token = localStorage.getItem('token');

  // Si el token existe, clonar la solicitud y agregar el encabezado Authorization
  const clonedRequest = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      })
    : req;

  // Pasar la solicitud (original o clonada) al siguiente manejador
  return next(clonedRequest);
};
