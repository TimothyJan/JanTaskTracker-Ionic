export class Role {
  roleID: number = 0;
  roleName: string = "";
  departmentID: number = 0;

  constructor(roleID: number, roleName: string, departmentID: number = 0,) {
    this.roleID = roleID;
    this.roleName = roleName;
    this.departmentID = departmentID;
  }
}
