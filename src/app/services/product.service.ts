import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../models/product.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  API_URL = 'http://localhost:3000';
  constructor(private httpClient: HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.httpClient.get<Product[]>(`${this.API_URL}/productos`);
  }

  addProduct(product: Product): Observable<any> {
    return this.httpClient.post(`${this.API_URL}/productos/`, product);
  }  
  
  updateProduct(id: number, product: Product): Observable<any> {
    return this.httpClient.put(`${this.API_URL}/productos/${id}`, product);
  }
  
}
