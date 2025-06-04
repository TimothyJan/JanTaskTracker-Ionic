namespace JanTaskTracker.Server.Models
{
    public class RoleDTO
    {
        public int RoleId { get; set; }
        public string RoleName { get; set; }
        public int DepartmentId { get; set; } // Optional: Include if you want to link it to a Department
    }
}
