import { Component, OnInit } from '@angular/core';
import { TaskModel } from '../models/task-model';
import { ApiService } from '../service/api-service';
import { ProjectListModelComponent } from '../model-popup/project-list-model/project-list-model.component';
import { DialogService } from "ng2-bootstrap-modal";
import { ProjectModel } from '../models/project-model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-tasks',
  templateUrl: './view-tasks.component.html',
  styleUrls: ['./view-tasks.component.css']
})
export class ViewTasksComponent implements OnInit {
  projectId?: number;
  Project: string;
  TaskID: number;
  Task: string;
  ParentTaskID?: number;
  ParentTask: string;
  Priority: number;
  StartDate?: Date;
  EndDate?: Date;
  UserID: number;
  userName: string;
  taskList: TaskModel[];
  filteredList: TaskModel[];
  taskListCount: number;
  projectList: ProjectModel[];

  constructor(private apiService: ApiService, private dialogService: DialogService, private router: Router) {

  }

  ngOnInit() {
  }

  public EndTask(task: TaskModel) {
    this.apiService.EndTask(task).subscribe((data) => {
      this.GetTasks(this.projectId);
      document.getElementById('userMsg').innerText = "Task ended successfully...";
      document.getElementById('userMsg').style.color = "green";
    },
      function (error) {
        console.log(error);
        document.getElementById('userMsg').innerText = "Error occurred. Please try again...";
        document.getElementById('userMsg').style.color = "red";
      })
  }

  EditTask(task: TaskModel) {
    this.router.navigate(['/addTasks', { task: JSON.stringify(task) }], { skipLocationChange: true });
  }

  openProjectDialog() {
    let disposable = this.dialogService.addDialog(ProjectListModelComponent, this.projectList)
      .subscribe((selectedProject) => {
        if (selectedProject) {
          this.projectId = selectedProject.projectId;
          this.Project = selectedProject.project;
          this.GetTasks(this.projectId);
        }
      });
    setTimeout(() => {
      disposable.unsubscribe();
    }, 10000);
  }

  sortingTask(sort) {
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
        if (a.Status > b.Status) return -1;
        else if (a.Status < b.Status) return 1;
        else return 0;
      });
    }
  }

  GetTasks(projectId) {
    this.apiService.GetTasks(projectId)
      .subscribe((data: TaskModel[]) => {
        console.log(data);
        this.taskList = data;
        this.assignCopy();
      },
        function (error) {
          console.log(error);
        });
  }

  assignCopy() {
    this.filteredList = Object.assign([], this.taskList);
    this.taskListCount = this.filteredList.length;
  }

}
