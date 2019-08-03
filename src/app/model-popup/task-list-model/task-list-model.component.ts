import { Component, OnInit } from '@angular/core';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";
import { ParentTaskModel } from '../../models/task-model';
import { ApiService } from '../../service/api-service';

@Component({
  selector: 'app-task-list-model',
  templateUrl: './task-list-model.component.html',
  styleUrls: ['./task-list-model.component.css']
})
export class TaskListModelComponent extends DialogComponent<ParentTaskModel[], ParentTaskModel> implements ParentTaskModel {
  parentTaskId: number;
  parentTask: string;
  parentTaskList: ParentTaskModel[];
  filteredList: ParentTaskModel[];
  searchText: string;
  parentTaskListCount: number;

  constructor(dialogService: DialogService, private apiService: ApiService) {
    super(dialogService);
  }

  ngOnInit() {
    this.GetParentTasks();
    this.assignCopy();
  }

  GetParentTasks() {
    this.apiService.GetParentTasks()
      .subscribe((data: ParentTaskModel[]) => {
        console.log(data);
        this.parentTaskList = data;
        this.assignCopy();
      },
        function (error) {
          console.log(error);
        });
  }

  SelectTask(task) {
    let taskModel = new ParentTaskModel();
    taskModel.parentTaskId = task.parentTaskId;
    taskModel.parentTask = task.parentTask;
    this.result = taskModel;
    this.close();
  }

  filterItem() {
    if (!this.searchText) this.assignCopy();
    this.filteredList = Object.assign([], this.parentTaskList).filter(
      item => (item.parentTask != undefined ? item.parentTask.toLowerCase().indexOf(this.searchText.toLowerCase()) > -1 : true)
    )
  }

  assignCopy() {
    this.filteredList = Object.assign([], this.parentTaskList);
    this.parentTaskListCount = this.filteredList.length;
  }

}
