namespace JanTaskTracker.Server.Models
{
    public class EmployeeDTO
    {
        public int EmployeeId { get; set; }
        public string Name { get; set; }
        public decimal Salary { get; set; }
        public int DepartmentId { get; set; }
        public int RoleId { get; set; }
    }
}
