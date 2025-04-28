export class Department {
  departmentID: number = 0;
  departmentName: string = "";

  constructor(departmentID: number, departmentName: string) {
    this.departmentID = departmentID;
    this.departmentName = departmentName;
  }
}
