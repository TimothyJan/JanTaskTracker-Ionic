namespace JanTaskTracker.Server.Models
{
    public class RoleDTO
    {
        public int RoleID { get; set; }
        public string RoleName { get; set; }
        public int DepartmentID { get; set; } // Optional: Include if you want to link it to a Department
    }
}
