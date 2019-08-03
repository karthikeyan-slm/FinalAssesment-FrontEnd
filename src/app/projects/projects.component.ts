import { Component, OnInit } from '@angular/core';
import { ProjectModel } from '../models/project-model';
import { UserModel } from '../models/user-model';
import { ApiService } from '../service/api-service';
import { DialogService } from "ng2-bootstrap-modal";
import { UserListModelComponent } from '../model-popup/user-list-model/user-list-model.component';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  projectId: number;
  project: string;
  startDate: string;
  endDate: string;
  priority: number;
  userId: number;
  ManagerName: string;
  NoofTasks: number;
  NoofCompletedTasks: number;
  StartEndDateSelected: boolean;
  object: ProjectModel;
  projectList: ProjectModel[];
  filteredList: ProjectModel[];
  projListCount: number;
  AddButtonText: string;
  ResetButtonText: string;
  startMinDate: string;
  endMinDate: string;
  UserList: UserModel[];
  searchText: string;
  projectNameError: boolean;
  StartEndDateError: boolean;
  managerError: boolean;
  userMsg: string;
  statusMessageColor: string;
  canShowStaus: boolean;

  constructor(private apiService: ApiService, private dialogService: DialogService) {
    this.projectNameError = false;
    this.StartEndDateError = false;
    this.managerError = false;
    this.StartEndDateSelected = false;
    this.priority = 0;
    this.startMinDate = new Date().toISOString().split('T')[0];
    let tmpDate = new Date();
    tmpDate.setDate(tmpDate.getDate() + 1);
    this.endMinDate = tmpDate.toISOString().split('T')[0];
  }

  ngOnInit() {
    this.AddButtonText = "Add Project";
    this.ResetButtonText = "Reset";
    this.canShowStaus = false;
    this.GetProjects();
  }

  GetProjects() {
    this.apiService.GetProjects().subscribe((data: ProjectModel[]) => {
      this.projectList = data;
      this.assignCopy();
    }, error => {
      console.log(error);
    });
  }

  AddUpdateProject() {
    this.actionStatusMessage('', 'none');
    if (this.projectId) {
      this.UpdateProject();
    }
    else {
      this.AddProject();
    }
  }

  AddProject() {
    var error = false;
    if (!this.project) {
      this.projectNameError = true;
      error = true;
    }
    else {
      this.projectNameError = false;
    }

    if (this.StartEndDateSelected && (!this.startDate || !this.endDate)) {
      this.StartEndDateError = true;
      error = true;
    }
    else {
      this.StartEndDateError = false;
    }

    if (!this.userId) {
      this.managerError = true;
      error = true;
    }
    else {
      this.managerError = false;
    }

    if (!error) {
      this.object = new ProjectModel();
      this.object.project = this.project;
      this.object.priority = this.priority;
      if (this.StartEndDateSelected) {
        this.object.startDate = new Date(this.startDate);
        this.object.endDate = new Date(this.endDate);
      }
      this.object.userId = this.userId;

      this.apiService.AddProject(this.object).subscribe((data: any) => {
        this.ResetData();
        this.GetProjects();
        this.actionStatusMessage('Project added successfully...', 'green');
      }, error => {
        this.actionStatusMessage('Error occurred. Please try again...', 'red');
      });
    }
  }

  UpdateProject() {
    var error = false;
    if (!this.project) {
      this.projectNameError = true;
      error = true;
    }
    else {
      this.projectNameError = false;
    }

    if (this.StartEndDateSelected && (!this.startDate || !this.endDate)) {
      this.StartEndDateError = true;
      error = true;
    }
    else {
      this.StartEndDateError = false;
    }

    if (!this.userId) {
      this.managerError = true;
      error = true;
    }
    else {
      this.managerError = false;
    }

    if (!error) {
      this.object = new ProjectModel();
      this.object.project = this.project;
      this.object.priority = this.priority;
      this.object.projectId = this.projectId;
      if (this.StartEndDateSelected) {
        this.object.startDate = new Date(this.startDate);
        this.object.endDate = new Date(this.endDate);
      }
      this.object.userId = this.userId;

      this.apiService.UpdateProject(this.object)
        .subscribe((data: any) => {
          this.ResetData();
          this.GetProjects();
          this.actionStatusMessage('Project updated successfully...', 'green');
        }, error => {
          this.actionStatusMessage('Error occurred. Please try again...', 'red');
        });
    }
  }

  SuspendProject(projectId) {
    this.actionStatusMessage('', 'none');

    this.apiService.SuspendProject(projectId)
      .subscribe((data: any) => {
        this.ResetData();
        this.GetProjects();
        this.actionStatusMessage('Project suspended successfully...', 'green');
      }, error => {
        this.actionStatusMessage('Error occurred. Please try again...', 'red');
      });
  }

  EditProject(project) {
    this.AddButtonText = "Update";
    this.ResetButtonText = "Cancel";
    this.projectId = project.projectId;
    this.project = project.project;
    this.priority = project.priority;
    if (project.startDate) {
      this.startDate = project.startDate.split('T')[0];
      this.endDate = project.endDate.split('T')[0];
      this.StartEndDateSelected = true;
    }
    else {
      this.StartEndDateSelected = false;
      this.startDate = undefined;
      this.endDate = undefined;
    }
    this.userId = project.userId;
    this.ManagerName = project.ManagerName;
  }

  filterItem() {
    if (!this.searchText) this.assignCopy();
    this.filteredList = Object.assign([], this.projectList).filter(
      item => (item.project != undefined ? item.project.toLowerCase().indexOf(this.searchText.toLowerCase()) > -1 : true)
    )
  }

  sortingProject(sort) {
    if (sort == 'SDate') {
      this.filteredList.sort((a, b) => {
        if (a.startDate < b.startDate) return -1;
        else if (a.startDate > b.startDate) return 1;
        else return 0;
      });
    }
    else if (sort == 'EDate') {
      this.filteredList.sort((a, b) => {
        if (a.endDate < b.endDate) return -1;
        else if (a.endDate > b.endDate) return 1;
        else return 0;
      });
    }
    else if (sort == 'Priority') {
      this.filteredList.sort((a, b) => {
        if (a.priority < b.priority) return -1;
        else if (a.priority > b.priority) return 1;
        else return 0;
      });
    }
    else if (sort == 'Completed') {
      this.filteredList.sort((a, b) => {
        if (a.NoofCompletedTasks < b.NoofCompletedTasks) return -1;
        else if (a.NoofCompletedTasks > b.NoofCompletedTasks) return 1;
        else return 0;
      });
    }
  }

  openDialog() {
    let disposable = this.dialogService.addDialog(UserListModelComponent, this.UserList)
      .subscribe((selectedUser) => {
        if (selectedUser) {
          this.userId = selectedUser.userId;
          this.ManagerName = selectedUser.firstName + ' ' + selectedUser.lastName;
        }
      });
    setTimeout(() => {
      disposable.unsubscribe();
    }, 10000);
  }

  assignCopy() {
    this.filteredList = Object.assign([], this.projectList);
    this.projListCount = this.filteredList.length;
  }

  ResetData() {
    this.object = new ProjectModel();
    this.project = undefined;
    this.priority = 0;
    this.StartEndDateSelected = false;
    this.startDate = undefined;
    this.endDate = undefined;
    this.userId = undefined;
    this.ManagerName = undefined;
    this.projectNameError = false;
    this.StartEndDateError = false;
    this.managerError = false;
    this.AddButtonText = "Add Project";
    this.ResetButtonText = "Reset";
    this.actionStatusMessage('', 'none');
  }

  DateCheckBoxChange() {
    if (this.StartEndDateSelected) {
      this.startDate = new Date().toISOString().split('T')[0];
      let tmpDate = new Date();
      tmpDate.setDate(tmpDate.getDate() + 1);
      this.endDate = tmpDate.toISOString().split('T')[0];
      this.StartEndDateError = false;
    }
    else {
      this.startDate = undefined;
      this.endDate = undefined;
      this.StartEndDateError = false;
    }
  }

  actionStatusMessage(message: string, style: string) {
    this.userMsg = message;
    this.statusMessageColor = style;
    this.canShowStaus = true;
    setTimeout(() => {
      this.canShowStaus = false;
    }, 2000);
  }

}
