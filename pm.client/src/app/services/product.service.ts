import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../Models/Product';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = 'https://localhost:7003/api/Product';

  constructor(private http: HttpClient) { }

  /** GET /api/Product */
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl);
  }

  /** GET /api/Product/{id} */
  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }

  /** POST /api/Product/AddProduct */
  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(`${this.baseUrl}/AddProduct`, product);
  }

  /** PUT /api/Product/{id} */
  updateProduct(id: number, product: Product): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, product);
  }

  /** DELETE /api/Product/{id} */
  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
  /** Image  */
  uploadImage(file: File) {
    const form = new FormData();
    form.append('file', file);
    return this.http.post<{ imageUrl: string }>(`${this.baseUrl}/UploadImage`, form);
  }

}
