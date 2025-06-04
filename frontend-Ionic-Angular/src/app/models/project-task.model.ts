export class ProjectTask {
  projectTaskId: number;
  projectId: number;
  title: string;
  description: string;
  status: "Not Started" | "Active" | "Completed";
  startDate?: Date;
  dueDate?: Date;
  assignedEmployeeIds?: number[] | null;

  constructor(
    projectTaskId: number,
    projectId: number,
    title: string,
    description: string,
    status: "Not Started" | "Active" | "Completed",
    startDate?: Date,
    dueDate?: Date,
    assignedEmployeeIds?: number[] | null,
  ) {
    this.projectTaskId = projectTaskId;
    this.projectId = projectId,
    this.title = title,
    this.description = description,
    this.status = status,
    this.startDate = startDate,
    this.dueDate = dueDate,
    this.assignedEmployeeIds = assignedEmployeeIds
  }
}
