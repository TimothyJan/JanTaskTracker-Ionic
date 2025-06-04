export class ProjectTask {
  projectTaskID: number;
  projectID: number;
  title: string;
  description: string;
  status: "Not Started" | "Active" | "Completed";
  startDate?: Date;
  dueDate?: Date;
  assignedEmployeeIds?: number[] | null;

  constructor(
    projectTaskID: number,
    projectID: number,
    title: string,
    description: string,
    status: "Not Started" | "Active" | "Completed",
    startDate?: Date,
    dueDate?: Date,
    assignedEmployeeIds?: number[] | null,
  ) {
    this.projectTaskID = projectTaskID;
    this.projectID = projectID,
    this.title = title,
    this.description = description,
    this.status = status,
    this.startDate = startDate,
    this.dueDate = dueDate,
    this.assignedEmployeeIds = assignedEmployeeIds
  }
}
