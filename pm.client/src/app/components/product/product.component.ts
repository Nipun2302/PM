import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/Models/Product';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/Auth/auth.service';       // 👈 add

declare var bootstrap: any;

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  products: Product[] = [];
  newProduct: Product = this.getEmptyProduct();
  isEditing = false;
  searchText = '';

  selectedFile: File | null = null;
  preview: string | null = null;

  private modal: any;

  constructor(
    private productService: ProductService,
    private toast: ToastrService,
    public auth: AuthService                             // 👈 public so template can use it
  ) { }

  /* ─────────────────────────────────────── lifecycle */

  ngOnInit(): void {
    this.getAllProducts();
    setTimeout(() => {
      const el = document.getElementById('productModal');
      if (el) this.modal = new bootstrap.Modal(el);
    }, 0);
  }

  /* ─────────────────────────────────────── role helpers */

  isAdmin(): boolean {
    return this.auth.hasRole('Admin');
  }

  /* ─────────────────────────────────────── CRUD */

  getAllProducts(): void {
    this.productService.getProducts().subscribe({
      next: data => (this.products = data),
      error: () => this.toast.error('Failed to load products')
    });
  }

  saveProduct(): void {
    if (!this.isAdmin()) return;                // safety guard

    const afterUpload = (url?: string) => {
      if (url) this.newProduct.imageUrl = url;

      const obs = this.isEditing
        ? this.productService.updateProduct(this.newProduct.id, this.newProduct)
        : this.productService.createProduct(this.newProduct);

      obs.subscribe({
        next: () => {
          this.toast.success(this.isEditing ? 'Product updated' : 'Product added');
          this.getAllProducts();
          this.closeModal();
        },
        error: () => this.toast.error('Save failed')
      });
    };

    if (this.selectedFile) {
      this.productService.uploadImage(this.selectedFile).subscribe({
        next: res => afterUpload(res.imageUrl),
        error: () => this.toast.error('Upload failed')
      });
    } else {
      afterUpload();
    }
  }

  deleteProduct(id: number): void {
    if (!this.isAdmin()) return;
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.toast.info('Product deleted');
          this.getAllProducts();
        },
        error: () => this.toast.error('Delete failed')
      });
    }
  }

  /* ─────────────────────────────────────── UI helpers */

  filteredProducts(): Product[] {
    return this.products.filter(p =>
      p.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
      p.category.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  openModal(): void {
    if (!this.isAdmin()) return;
    this.resetForm();
    this.modal?.show();
  }

  editProduct(p: Product): void {
    if (!this.isAdmin()) return;
    this.newProduct = { ...p };
    this.isEditing = true;
    this.preview = p.imageUrl || null;
    this.modal?.show();
  }

  onFileSelected(e: Event): void {
    const input = e.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => (this.preview = reader.result as string);
      reader.readAsDataURL(this.selectedFile);
    }
  }

  closeModal(): void {
    this.modal?.hide();
    this.resetForm();
  }

  resetForm(): void {
    this.newProduct = this.getEmptyProduct();
    this.isEditing = false;
    this.selectedFile = null;
    this.preview = null;
  }

  private getEmptyProduct(): Product {
    return { id: 0, name: '', category: '', price: 0, stockQuantity: 0, imageUrl: '' };
  }
}
