import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Product } from '../../models/product.interface';
import { ProductService } from '../../services/product.service';
import { MatDialog } from '@angular/material/dialog';
import { ProductFormComponent } from '../product-form/product-form.component';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss'],
})
export class ProductosComponent implements OnInit {
  displayedColumns: string[] = ['id_producto', 'producto', 'categoria', 'precio', 'cantidad', 'descripcion','acciones'];
  dataSource = new MatTableDataSource<Product>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private productService: ProductService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.productService.getProducts().subscribe({
      next: (productos: Product[]) => {
        this.dataSource.data = productos;
        console.log('Productos recargados después de edición:', productos); 
      },
      error: (error) => {
        console.error('Error al cargar los productos:', error);
      },
    });
  }
  

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onAddProduct(): void {
    const dialogRef = this.dialog.open(ProductFormComponent, {
      width: '400px',
      data: null,  
    });
  
    dialogRef.afterClosed().subscribe((newProduct: Product) => {
      if (newProduct) {
        this.productService.addProduct(newProduct).subscribe({
          next: () => {
            this.cargarProductos(); 
          },
          error: (error) => {
            console.error('Error al añadir producto:', error);
          },
        });
      }
    });
  }
  
  onEditProduct(product: Product): void {
    const dialogRef = this.dialog.open(ProductFormComponent, {
      width: '400px',
      data: product, 
    });
  
    dialogRef.afterClosed().subscribe((updatedProduct: Product) => {
      if (updatedProduct) {
        console.log('Datos actualizados enviados:', updatedProduct);
  
        this.productService.updateProduct(product.id_producto, updatedProduct).subscribe({
          next: () => {
            this.cargarProductos(); 
          },
          error: (error) => {
            console.error('Error al actualizar producto:', error);
          },
        });
      }
    });
  }
    
}
