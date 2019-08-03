export class TaskModel {
    projectId: number;
    project: string;
    taskId: number;
    task: string;
    parentTaskId: number;
    parentTask: string;
    priority: number;
    startDate?: Date;
    endDate?: Date;
    userId: number;
    userName: string;
    Status: boolean;
    
}

export class ParentTaskModel {
    parentTaskId: number;
    parentTask: string;
}