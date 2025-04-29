using System.ComponentModel.DataAnnotations;

namespace JanTaskTracker.Server.Models
{
    public class Role
    {
        [Key]
        public int RoleID { get; set; }

        [Required]
        [StringLength(50, ErrorMessage = "Role name cannot exceed 50 characters.")]
        public string RoleName { get; set; }

        public int DepartmentID { get; set; } // Ensure this property exists

        // Navigation property for the associated department
        public Department Department { get; set; }

        // Navigation property for related employees
        public ICollection<Employee> Employees { get; set; } = new List<Employee>();
    }

}
