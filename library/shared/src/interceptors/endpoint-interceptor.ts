import { HttpInterceptorFn } from '@angular/common/http';

export const endpointInterceptor: HttpInterceptorFn = (req, next) => {
  // Eğer istek 'api/' ile başlıyorsa
  if (req.url.startsWith('api/')) {
    const clone = req.clone({
      url: req.url.replace(/^api\//, 'http://localhost:3000/')
    });
    return next(clone);
  }
  return next(req);
};
