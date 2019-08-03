import { Component, OnInit } from '@angular/core';
import { TaskModel } from '../models/task-model';
import { ProjectModel } from '../models/project-model';
import { UserModel } from '../models/user-model';
import { ParentTaskModel } from '../models/task-model';
import { ApiService } from '../service/api-service';
import { DialogService } from "ng2-bootstrap-modal";
import { UserListModelComponent } from '../model-popup/user-list-model/user-list-model.component';
import { ProjectListModelComponent } from '../model-popup/project-list-model/project-list-model.component';
import { TaskListModelComponent } from '../model-popup/task-list-model/task-list-model.component';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-add-tasks',
  templateUrl: './add-tasks.component.html',
  styleUrls: ['./add-tasks.component.css']
})
export class AddTasksComponent implements OnInit {
  IsParentTask: boolean;
  startDate: string;
  endDate: string;
  priority: number;
  parentTask: string;
  parentTaskId: number;
  userId: number;
  userName: string;
  project: string;
  projectId: number;
  task: string;
  taskId: number;
  taskModel: TaskModel;
  parentTaskModel: ParentTaskModel;
  projectList: ProjectModel[];
  UserList: UserModel[];
  parentTaskList: ParentTaskModel[];
  startMinDate: string;
  endMinDate: string;
  addButtonText: string;
  taskError: boolean;
  projectError: boolean;
  startEndDateError: boolean;
  userError: boolean;
  userMsg: string;
  statusMessageColor: string;
  canShowStaus: boolean;

  constructor(private apiService: ApiService, private dialogService: DialogService, private route: ActivatedRoute, private location: Location) {

    this.startMinDate = new Date().toISOString().split('T')[0];
    let tmpDate = new Date();
    tmpDate.setDate(tmpDate.getDate() + 1);
    this.endMinDate = tmpDate.toISOString().split('T')[0];
    this.taskError = false;
    this.projectError = false;
    this.startEndDateError = false;
    this.userError = false;

    if (route.snapshot.params['task']) {
      let tModel = JSON.parse(route.snapshot.params['task']);
      this.taskId = tModel.taskId;
      this.task = tModel.task;
      this.projectId = tModel.projectId;
      this.parentTaskId = tModel.parentTaskId;
      this.project = tModel.project;
      this.priority = tModel.priority;
      this.startDate = tModel.startDate.split('T')[0];
      this.endDate = tModel.endDate.split('T')[0];
      this.userId = tModel.userId;
      this.parentTask = tModel.parentTask;
      this.userName = tModel.userName;
      this.addButtonText = "Update Task";
    }
    else {
      this.priority = 0;
      this.startDate = new Date().toISOString().split('T')[0];
      let tmpDate = new Date();
      tmpDate.setDate(tmpDate.getDate() + 1);
      this.endDate = tmpDate.toISOString().split('T')[0];
      this.addButtonText = "Add Task";
    }
  }

  ngOnInit() {
  }

  TaskCheckBoxChange() {
    if (this.IsParentTask) {

      document.getElementById('projDialogButton').style.display = 'none';
      document.getElementById('parentTaskDialogButton').style.display = 'none';
      document.getElementById('openUserDialogButton').style.display = 'none';
      this.startDate = undefined;
      this.endDate = undefined;
      this.projectId = undefined;
      this.priority = 0;
      this.parentTaskId = undefined;
      this.userId = undefined;
      this.projectError = false;
      this.startEndDateError = false;
      this.userError = false;
    }
    else {
      document.getElementById('projDialogButton').style.display = 'block';
      document.getElementById('parentTaskDialogButton').style.display = 'block';
      document.getElementById('openUserDialogButton').style.display = 'block';
      this.startDate = new Date().toISOString().split('T')[0];
      let tmpDate = new Date();
      tmpDate.setDate(tmpDate.getDate() + 1);
      this.endDate = tmpDate.toISOString().split('T')[0];
    }
  }

  AddUpdateTask() {
    this.actionStatusMessage('', 'none');
    if (this.taskId) {
      this.UpdateTask();
    }
    else {
      this.AddTask();
    }
  }

  UpdateTask() {
    var error = false;
    if (!this.task) {
      this.taskError = true;
      error = true;
    }
    else {
      this.taskError = false;
    }

    if (!this.projectId) {
      this.projectError = true;
      error = true;
    }
    else {
      this.projectError = false;
    }

    if (!this.userId) {
      this.userError = true;
      error = true;
    }
    else {
      this.userError = false;
    }

    if (!this.startDate || !this.endDate) {
      this.startEndDateError = true;
      error = true;
    }
    else {
      this.startEndDateError = false;
    }

    if (!error) {
      this.taskModel = new TaskModel();
      this.taskModel.taskId = this.taskId;
      this.taskModel.task = this.task;
      this.taskModel.projectId = this.projectId;
      this.taskModel.parentTaskId = this.parentTaskId;
      this.taskModel.project = this.project;
      this.taskModel.priority = this.priority;
      this.taskModel.startDate = new Date(this.startDate);
      this.taskModel.endDate = new Date(this.endDate);
      this.taskModel.userId = this.userId;
      this.apiService.UpdateTask(this.taskModel)
        .subscribe((data: any) => {
          this.ResetTask();
          this.actionStatusMessage('Task updated successfully...', 'green');
        }, error => {
          this.actionStatusMessage('Error occurred. Please try again...', 'red');
        });
    }
  }

  AddTask() {
    if (this.IsParentTask) {
      this.projectError = false;
      this.startEndDateError = false;
      this.userError = false;
      if (!this.task) {
        this.taskError = true;
      }
      else {
        this.taskError = false;
      }

      if (!this.taskError) {
        this.parentTaskModel = new ParentTaskModel();
        this.parentTaskModel.parentTask = this.task;

        this.apiService.AddParentTask(this.parentTaskModel).subscribe((data: any) => {
            this.ResetTask();
            this.actionStatusMessage('Task updated successfully...', 'green');
          }, error => {
            this.actionStatusMessage('Error occurred. Please try again...', 'red');
          });
      }
    }
    else {
      var error = false;
      if (!this.task) {
        this.taskError = true;
        error = true;
      }
      else {
        this.taskError = false;
      }

      if (!this.projectId) {
        this.projectError = true;
        error = true;
      }
      else {
        this.projectError = false;
      }

      if (!this.userId) {
        this.userError = true;
        error = true;
      }
      else {
        this.userError = false;
      }

      if (!this.startDate || !this.endDate) {
        this.startEndDateError = true;
        error = true;
      }
      else {
        this.startEndDateError = false;
      }

      if (!error) {
        this.taskModel = new TaskModel();
        this.taskModel.task = this.task;
        this.taskModel.projectId = this.projectId;
        this.taskModel.parentTaskId = this.parentTaskId;
        this.taskModel.project = this.project;
        this.taskModel.priority = this.priority;
        this.taskModel.startDate = new Date(this.startDate);
        this.taskModel.endDate = new Date(this.endDate);
        this.taskModel.userId = this.userId;
        this.apiService.AddTask(this.taskModel)
          .subscribe((data: any) => {
            this.actionStatusMessage('Task added successfully...', 'green');
          }, error => {
            this.actionStatusMessage('Error occurred. Please try again...', 'red');
          });
      }
    }
  }

  ResetTask() {
    this.priority = 0;
    this.startDate = new Date().toISOString().split('T')[0];
    let tmpDate = new Date();
    tmpDate.setDate(tmpDate.getDate() + 1);
    this.endDate = tmpDate.toISOString().split('T')[0];
    this.addButtonText = "Add Task";

    this.taskId = undefined;
    this.task = undefined;
    this.projectId = undefined;
    this.parentTaskId = undefined;
    this.project = undefined;
    this.userId = undefined;
    this.parentTask = undefined;
    this.userName = undefined;
    this.taskError = false;
    this.projectError = false;
    this.startEndDateError = false;
    this.userError = false;
    this.actionStatusMessage('', 'none');
  }

  openProjectDialog() {
    let disposable = this.dialogService.addDialog(ProjectListModelComponent, this.projectList)
      .subscribe((selectedProject) => {
        if (selectedProject) {
          this.projectId = selectedProject.projectId;
          this.project = selectedProject.project;
        }
      });
    setTimeout(() => {
      disposable.unsubscribe();
    }, 10000);
  }

  openParentTaskDialog() {
    let disposable = this.dialogService.addDialog(TaskListModelComponent, this.parentTaskList)
      .subscribe((selectedTask) => {
        if (selectedTask) {
          this.parentTaskId = selectedTask.parentTaskId;
          this.parentTask = selectedTask.parentTask;
        }
      });
    setTimeout(() => {
      disposable.unsubscribe();
    }, 10000);
  }

  openUserDialog() {
    let disposable = this.dialogService.addDialog(UserListModelComponent, this.UserList)
      .subscribe((selectedUser) => {
        if (selectedUser) {
          this.userId = selectedUser.userId;
          this.userName = selectedUser.firstName + ' ' + selectedUser.lastName;
        }
      });
    setTimeout(() => {
      disposable.unsubscribe();
    }, 10000);
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
