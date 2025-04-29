using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace JanTaskTracker.Server.Models
{
    public class Employee
    {
        [Key]
        public int EmployeeID { get; set; }

        [Required]
        [StringLength(100, MinimumLength = 2, ErrorMessage = "Name must be between 2 and 100 characters.")]
        public string Name { get; set; }

        [Required]
        [DataType(DataType.Currency)]
        public decimal Salary { get; set; }

        [Required]
        [ForeignKey("Department")]
        public int DepartmentID { get; set; }

        [Required]
        [ForeignKey("Role")]
        public int RoleID { get; set; }

        public Department Department { get; set; } // Add navigation property
        public Role Role { get; set; } // Add navigation property
    }
}
