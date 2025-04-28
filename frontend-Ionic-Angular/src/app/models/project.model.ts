export class Project {
  projectID: number;
  projectName: string;
  description: string;
  status: "Not Started" | "Active" | "Completed";
  startDate?: Date;
  dueDate?: Date;

  constructor(
    projectID: number,
    projectName: string,
    description: string,
    status: "Not Started" | "Active" | "Completed",
    startDate?: Date,
    dueDate?: Date,
  ) {
    this.projectID = projectID;
    this.projectName = projectName;
    this.description = description;
    this.status = status;
    this.startDate = startDate;
    this.dueDate = dueDate;
  }
}
