import { Injectable } from '@angular/core';
import { Http, HttpModule, Response, Headers, RequestOptions } from '@angular/http'
import 'rxjs/Rx'
import { Observable } from 'rxjs';
import { UserModel } from '../models/user-model';
import { ProjectModel } from '../models/project-model';
import { TaskModel } from '../models/task-model';
import { ParentTaskModel } from '../models/task-model';
import { environment } from '../../environments/environment';

import { map } from 'rxjs/operators';
import 'rxjs/add/operator/map';

@Injectable()
export class ApiService {
    constructor(private _http: Http) {

    }
    private baseUrl = 'http://localhost:8181';

    userServiceUrl: string = this.baseUrl + "/pmapp/userAction";
    projectServiceUrl: string = this.baseUrl + "/pmapp/projectAction";
    taskServiceUrl: string = this.baseUrl + "/pmapp/taskAction";
    parentTaskServiceUrl: string = this.baseUrl + "/pmapp/parentAction";

    GetUsers(): Observable<UserModel[]> {
        let getUrl = this.userServiceUrl + '/getAllUsers';
        return this._http.get(getUrl)
            .pipe(map(response => { return response.json() }))
            .catch(this.handleError);
    }

    
    AddUser(user) {
        let body = JSON.stringify(user);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let addUrl = this.userServiceUrl + '/addUser'

        return this._http.post(addUrl, body, options)
            .catch(this.handleError);
    }

    UpdateUser(user) {
        let body = JSON.stringify(user);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let updateUrl = this.userServiceUrl + '/updateUser'

        return this._http.post(updateUrl, body, options)
            .catch(this.handleError);
    }

    DeleteUser(user) {
        let body = JSON.stringify(user);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let updateUrl = this.userServiceUrl + '/deleteUser'

        return this._http.post(updateUrl, body, options)
            .catch(this.handleError);
    }

    GetProjects(): Observable<ProjectModel[]> {
        let getUrl = this.projectServiceUrl + '/getAllProjects';
        return this._http.get(getUrl)
            .pipe(map(response => { return response.json() }))
            .catch(this.handleError)
    }

    AddProject(project) {
        let body = JSON.stringify(project);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let addUrl = this.projectServiceUrl + '/addProject'

        return this._http.post(addUrl, body, options)
            .catch(this.handleError);
    }

    UpdateProject(project) {
        let body = JSON.stringify(project);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let updateUrl = this.projectServiceUrl + '/updateProject'

        return this._http.post(updateUrl, body, options)
            .catch(this.handleError);
    }

    SuspendProject(projectId) {
        let body = JSON.stringify(projectId);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let deleteUrl = this.projectServiceUrl + '/deleteProject'

        return this._http.post(deleteUrl, body, options)
            .catch(this.handleError);
    }

    AddTask(task) {
        let body = JSON.stringify(task);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let addUrl = this.taskServiceUrl + '/addTask'

        return this._http.post(addUrl, body, options)
            .catch(this.handleError);
    }

    UpdateTask(task) {
        let body = JSON.stringify(task);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let updateUrl = this.taskServiceUrl + '/updateTask'

        return this._http.post(updateUrl, body, options)
            .catch(this.handleError);
    }

    AddParentTask(task) {
        let body = JSON.stringify(task);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let addUrl = this.parentTaskServiceUrl + '/addParentTask'

        return this._http.post(addUrl, body, options)
            .catch(this.handleError);
    }

    GetParentTasks(): Observable<ParentTaskModel[]> {
        let getUrl = this.parentTaskServiceUrl + '/getAllParentTasks';
        return this._http.get(getUrl)
            .pipe(map(response => { return response.json() }))
            .catch(this.handleError)
    }

    GetTasks(taskID): Observable<TaskModel[]> {
        let getUrl = this.taskServiceUrl + '/getTaskById/' + taskID;
        return this._http.get(getUrl)
            .pipe(map(response => { return response.json() }))
            .catch(this.handleError)
    }

    EndTask(task) {
        let body = JSON.stringify(task);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let endUrl = this.taskServiceUrl + '/EndTask'

        return this._http.post(endUrl, body, options)
            .catch(this.handleError);
    }

    private handleError(error: Response | any) {
        console.error('ApiService:handleError', error);
        return Observable.throw(error);
    }
}

