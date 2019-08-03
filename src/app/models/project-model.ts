export class ProjectModel {
    projectId: number;
    project: string;
    startDate?: Date;
    endDate?: Date;
    priority: number;
    userId: number;
    ManagerName: string;
    NoofTasks: number;
    NoofCompletedTasks: number;
}
