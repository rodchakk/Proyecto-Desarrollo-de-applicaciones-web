import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Product } from '../../models/product.interface';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent {
  productForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ProductFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Product
  ) {
    this.productForm = this.fb.group({
      id_producto: [this.data?.id_producto || '', Validators.required],
      producto: [this.data?.producto || '', Validators.required],
      categoria: [this.data?.categoria || '', Validators.required],
      precio: [this.data?.precio || '', [Validators.required, Validators.min(0)]],
      cantidad: [this.data?.cantidad || '', [Validators.required, Validators.min(0)]],
      descripcion: [this.data?.descripcion || '', Validators.required]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.productForm.valid) {
      console.log('Datos del formulario:', this.productForm.value);
      this.dialogRef.close(this.productForm.value);
    } else {
      console.error('Formulario no válido');
    }
  }
  
}

