import { Component, OnInit } from '@angular/core';
import { User } from '../shared/users.model';
import { UserService } from '../shared/users.service';

@Component({
  selector: 'app-user',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UserComponent implements OnInit {
  users: User[] = [];
  selectedUser: User | null = null;
  newUser: User = {} as User;

  isEditMode = false;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.userService.getUsers().subscribe(
      (users) => {
        this.users = users;
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  editUser(user: User) {
    this.isEditMode = true;
    this.selectedUser = { ...user };
  }

  selectUser(user: User) {
    this.selectedUser = { ...user };
    this.isEditMode = true;
  }

  createUser(user: User) {
    this.userService.createUser(user).subscribe(
      (newUser) => {
        this.users.push(newUser);
        this.clearSelectedUser();
      },
      (error) => {
        console.error('Error creating user:', error);
      }
    );
  }

  updateUser(user: User) {
    this.userService.updateUser(user).subscribe(
      (updatedUser) => {
        const index = this.users.findIndex((u) => u._id === updatedUser._id);
        if (index !== -1) {
          this.users[index] = updatedUser;
          this.clearSelectedUser();
        }
      },
      (error) => {
        console.error('Error updating user:', error);
      }
    );
  }

  deleteUser(userId: string) {
    this.userService.deleteUser(userId).subscribe(
      () => {
        this.users = this.users.filter((u) => u._id !== userId);
        this.clearSelectedUser();
      },
      (error) => {
        console.error('Error deleting user:', error);
      }
    );
  }

  clearSelectedUser() {
    this.selectedUser = null;
    this.isEditMode = false;
    this.newUser = {} as User;
  }
}
