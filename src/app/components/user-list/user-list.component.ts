import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.interface';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { UserFormComponent } from '../user-form/user-form.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit {
  users!: User[];

  constructor(
    private userService: UserService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe((usersR: User[]) => {
      this.users = usersR;
    });
  }

  llevameAlDetalle(userId: number) {
    this.router.navigate(['user-detail/', userId]);
  }

  onAddUser() {
    const dialogRef = this.dialog.open(UserFormComponent);

    dialogRef.afterClosed().subscribe((result: User) => {
      if (result) {
        this.userService.addUser(result).subscribe({
          next: () => {
            console.log('Usuario agregado con éxito');
            this.loadUsers(); 
          },
          error: (err) => console.error('Error al agregar usuario:', err)
        });
      }
    });
  }

  onEditUser(user: User) {
    const dialogRef = this.dialog.open(UserFormComponent, { data: user });
  
    dialogRef.afterClosed().subscribe((result: User) => {
      if (result) {
        this.userService.updateUser(result).subscribe({
          next: (response) => {
            console.log('Usuario actualizado con éxito:', response);
            this.loadUsers(); 
          },
          error: (err) => console.error('Error al actualizar usuario:', err)
        });
      }
    });
  }
  


  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
