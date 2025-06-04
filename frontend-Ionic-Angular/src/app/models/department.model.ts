export class Department {
  departmentId: number = 0;
  departmentName: string = "";

  constructor(departmentId: number, departmentName: string) {
    this.departmentId = departmentId;
    this.departmentName = departmentName;
  }
}
