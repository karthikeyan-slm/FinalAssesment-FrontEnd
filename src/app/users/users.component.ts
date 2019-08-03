import { Component, OnInit } from '@angular/core';
import { UserModel } from '../models/user-model';
import { ApiService } from '../service/api-service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  firstName: string;
  lastName: string;
  employeeId: string;
  userId: number;
  AddButtonText: string;
  ResetButtonText: string;
  object: UserModel;
  UserList: UserModel[];
  filteredList: UserModel[];
  searchText: string;
  sortByFName: string;
  userListCount: number;
  firstNameError: boolean;
  lastNameError: boolean;
  employeeIdError: boolean;
  userMsg: string;
  statusMessageColor: string;
  canShowStaus: boolean;

  constructor(private apiService: ApiService) {
    this.firstNameError = false;
    this.lastNameError = false;
    this.employeeIdError = false;
  }

  ngOnInit() {
    this.AddButtonText = "Add User";
    this.ResetButtonText = "Reset";
    this.canShowStaus = false;
    this.GetUsers();
  }

  sortingUser(sort) {
    if (sort == 'FName') {
      this.filteredList.sort((a, b) => {
        if (a.firstName < b.firstName) return -1;
        else if (a.firstName > b.firstName) return 1;
        else return 0;
      });
    }
    else if (sort == 'LName') {
      this.filteredList.sort((a, b) => {
        if (a.lastName < b.lastName) return -1;
        else if (a.lastName > b.lastName) return 1;
        else return 0;
      });
    }
    else if (sort == 'EId') {
      this.filteredList.sort((a, b) => {
        if (a.employeeId < b.employeeId) return -1;
        else if (a.employeeId > b.employeeId) return 1;
        else return 0;
      });
    }

  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  assignCopy() {
    this.filteredList = Object.assign([], this.UserList);
    this.userListCount = this.filteredList.length;
  }

  filterItem() {
    if (!this.searchText) this.assignCopy();
    this.filteredList = Object.assign([], this.UserList).filter(
      item => (item.firstName != undefined ? item.firstName.toLowerCase().indexOf(this.searchText.toLowerCase()) > -1 : true) ||
        (item.lastName != undefined ? item.lastName.toLowerCase().indexOf(this.searchText.toLowerCase()) > -1 : true) ||
        (item.employeeId != undefined ? item.employeeId.toLowerCase().indexOf(this.searchText.toLowerCase()) > -1 : true)
    )
  }

  GetUsers() {
    this.apiService.GetUsers()
      .subscribe((data: UserModel[]) => {
        this.UserList = data;
        this.assignCopy();
      },
        function (error) {
          console.log(error);
        });
  }

  AddUpdateUser() {
    this.actionStatusMessage('', 'none');

    if (this.userId) {
      this.UpdateUser();
    }
    else {
      this.AddUser();
    }
  }

  AddUser() {

    if (!this.firstName) {
      this.firstNameError = true;
    }
    else {
      this.firstNameError = false;
    }

    if (!this.lastName) {
      this.lastNameError = true;
    }
    else {
      this.lastNameError = false;
    }

    if (!this.employeeId) {
      this.employeeIdError = true;
    }
    else {
      this.employeeIdError = false;
    }

    if (!this.firstNameError && !this.lastNameError && !this.employeeIdError) {
      this.object = new UserModel();
      this.object.firstName = this.firstName;
      this.object.lastName = this.lastName;
      this.object.employeeId = this.employeeId;

      this.apiService.AddUser(this.object)
        .subscribe((data: any) => {
          this.ResetData();
          this.GetUsers();
          this.actionStatusMessage('User added successfully...', 'green');
        }, error => {
          this.actionStatusMessage('Error occurred. Please try again...', 'red');
        });
    }
  }

  UpdateUser() {
    if (!this.firstName) {
      this.firstNameError = true;
    }
    else {
      this.firstNameError = false;
    }

    if (!this.lastName) {
      this.lastNameError = true;
    }
    else {
      this.lastNameError = false;
    }

    if (!this.employeeId) {
      this.employeeIdError = true;
    }
    else {
      this.employeeIdError = false;
    }

    if (!this.firstNameError && !this.lastNameError && !this.employeeIdError) {
      this.object = new UserModel();
      this.object.userId = this.userId;
      this.object.firstName = this.firstName;
      this.object.lastName = this.lastName;
      this.object.employeeId = this.employeeId;

      this.apiService.UpdateUser(this.object)
        .subscribe((data: any) => {
          this.ResetData();
          this.GetUsers();
          this.actionStatusMessage('User updated successfully...', 'green');
        }, error => {
          this.actionStatusMessage('Error occurred. Please try again...', 'red');
        });
    }
  }

  DeleteUser(user) {
    let obj = new UserModel();
    obj.userId = user.userId;
    obj.firstName = user.firstName;
    obj.lastName = user.lastName;
    obj.employeeId = user.employeeId;
    this.actionStatusMessage('', 'none');

    this.apiService.DeleteUser(obj)
      .subscribe((data: any) => {
        this.ResetData();
        this.GetUsers();
        this.actionStatusMessage('User deleted successfully...', 'green');
      }, error => {
        this.actionStatusMessage('Error occurred. Please try again...', 'red');
      });
  }

  EditUser(user) {
    this.AddButtonText = "Update";
    this.ResetButtonText = "Cancel";
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.employeeId = user.employeeId;
    this.userId = user.userId;
  }

  ResetData() {
    this.object = new UserModel();
    this.firstName = undefined;
    this.lastName = undefined;
    this.employeeId = undefined;
    this.userId = undefined;
    this.firstNameError = false;
    this.lastNameError = false;
    this.employeeIdError = false;
    this.AddButtonText = "Add User";
    this.ResetButtonText = "Reset";
    this.actionStatusMessage('', 'none');
  }

  private actionStatusMessage(message: string, style: string) {
    this.userMsg = message;
    this.statusMessageColor = style;
    this.canShowStaus = true;
    setTimeout(() => {
      this.canShowStaus = false;
    }, 2000);
  }
}
