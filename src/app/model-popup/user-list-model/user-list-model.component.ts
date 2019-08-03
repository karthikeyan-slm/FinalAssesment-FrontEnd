import { Component } from '@angular/core';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";
import { UserModel } from '../../models/user-model';
import { ApiService } from '../../service/api-service';

@Component({
  selector: 'app-user-list-model',
  templateUrl: './user-list-model.component.html',
  styleUrls: ['./user-list-model.component.css']
})
export class UserListModelComponent extends DialogComponent<UserModel[], UserModel> implements UserModel {
  firstName: string;
  lastName: string;
  employeeId: string;
  userId: number;
  UserList: UserModel[];
  filteredList: UserModel[];
  userListCount: number;
  searchText: string;

  constructor(dialogService: DialogService, private apiService: ApiService) {
    super(dialogService);
  }

  ngOnInit() {
    this.GetUsers();
    this.assignCopy();
  }

  GetUsers() {
    this.apiService.GetUsers()
      .subscribe((data: UserModel[]) => {
        console.log(data);
        this.UserList = data;
        this.assignCopy();
      },
        function (error) {
          console.log(error);
        });
  }

  SelectUser(user) {
    let userModel = new UserModel();
    userModel.firstName = user.firstName;
    userModel.lastName = user.lastName;
    userModel.employeeId = user.employeeId;
    userModel.userId = user.userId;
    this.result = userModel;
    this.close();
  }

  filterItem() {
    if (!this.searchText) this.assignCopy();
    this.filteredList = Object.assign([], this.UserList).filter(
      item => (item.firstName != undefined ? item.firstName.toLowerCase().indexOf(this.searchText.toLowerCase()) > -1 : true) ||
        (item.lastName != undefined ? item.lastName.toLowerCase().indexOf(this.searchText.toLowerCase()) > -1 : true) ||
        (item.employeeId != undefined ? item.employeeId.toLowerCase().indexOf(this.searchText.toLowerCase()) > -1 : true)
    )
  }

  assignCopy() {
    this.filteredList = Object.assign([], this.UserList);
    this.userListCount = this.filteredList.length;
  }
}
