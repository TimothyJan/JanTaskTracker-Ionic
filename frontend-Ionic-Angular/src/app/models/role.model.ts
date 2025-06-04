export class Role {
  roleId: number = 0;
  roleName: string = "";
  departmentId: number = 0;

  constructor(roleId: number, roleName: string, departmentId: number = 0,) {
    this.roleId = roleId;
    this.roleName = roleName;
    this.departmentId = departmentId;
  }
}
