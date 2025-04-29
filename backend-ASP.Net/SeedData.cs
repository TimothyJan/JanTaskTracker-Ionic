using Microsoft.EntityFrameworkCore;
using JanTaskTracker.Server.Models;

namespace JanTaskTracker.Server
{
    public static class SeedData
    {
        public static void ApplySeedData(ModelBuilder modelBuilder)
        {
            // Seed Departments
            modelBuilder.Entity<Department>().HasData(
                new Department { DepartmentID = 1, DepartmentName = "Finance" },
                new Department { DepartmentID = 2, DepartmentName = "Human Resources" },
                new Department { DepartmentID = 3, DepartmentName = "Information Technology" }
                );

            // Seed Roles
            modelBuilder.Entity<Role>().HasData(
                new Role { RoleID = 1, RoleName = "Accountant", DepartmentID = 1 },
                new Role { RoleID = 2, RoleName = "Financial Analyst", DepartmentID = 1 },
                new Role { RoleID = 3, RoleName = "Finance Manager", DepartmentID = 1 },
                new Role { RoleID = 4, RoleName = "HR Assistant", DepartmentID = 2 },
                new Role { RoleID = 5, RoleName = "HR Specialist", DepartmentID = 2 },
                new Role { RoleID = 6, RoleName = "HR Director", DepartmentID = 2 },
                new Role { RoleID = 7, RoleName = "Software Engineer", DepartmentID = 3 },
                new Role { RoleID = 8, RoleName = "Front-End Developer", DepartmentID = 3 },
                new Role { RoleID = 9, RoleName = "Back-End Developer", DepartmentID = 3 },
                new Role { RoleID = 10, RoleName = "Full-Stack Developer", DepartmentID = 3 }
                );

            // Seed Roles
            modelBuilder.Entity<Employee>().HasData(
                new Employee { EmployeeID = 1, Name = "Bob Smith", Salary = 70000, DepartmentID = 1, RoleID = 2 },
                new Employee { EmployeeID = 2, Name = "Catherine Green", Salary = 65000, DepartmentID = 2, RoleID = 5 },
                new Employee { EmployeeID = 3, Name = "David Brown", Salary = 90000, DepartmentID = 3, RoleID = 7 }
                );

            // Seed Projects
            modelBuilder.Entity<Project>().HasData(
                    new Project {
                        ProjectId = 1,
                        ProjectName = "Project Alpha",
                        Description = "First project",
                        Status = "Active",
                    },
                    new Project {
                        ProjectId = 2,
                        ProjectName = "Project Beta",
                        Description = "Second project",
                        Status = "Active",
                        StartDate = new DateTime(2024, 11, 13),
                        DueDate = new DateTime(2025, 1, 13)
                    }
                );

            // Seed ProjectTasks
            modelBuilder.Entity<ProjectTask>().HasData(
                    new ProjectTask {
                        ProjectTaskId = 1,
                        ProjectId = 1,
                        Title = "Task 1",
                        Description = "Task for Project Alpha",
                        Status = "Completed",
                        AssignedEmployeeIds = new int[] { 1, 3}, 
                        StartDate = new DateTime(2024, 11, 13), 
                        DueDate = new DateTime(2024, 12, 13) 
                    },
                    new ProjectTask {
                        ProjectTaskId = 2,
                        ProjectId = 1,
                        Title = "Task 2",
                        Description = "Another Task for Project Alpha",
                        Status = "Active",
                        AssignedEmployeeIds = new int[] {2, 3}, 
                        StartDate = new DateTime(2024, 12, 13), 
                        DueDate = new DateTime(2025, 1, 13) 
                    },
                    new ProjectTask {
                        ProjectTaskId = 3,
                        ProjectId = 2,
                        Title = "Task 3",
                        Description = "Task for Project Beta",
                        Status = "Completed",
                        AssignedEmployeeIds = new int[] {1, 2}, 
                        StartDate = new DateTime(2025, 1, 13), 
                        DueDate = new DateTime(2025, 2, 13) 
                    },
                    new ProjectTask {
                        ProjectTaskId = 4,
                        ProjectId = 2,
                        Title = "Task 4",
                        Description = "Another Task for Project Beta",
                        Status = "Active",
                        AssignedEmployeeIds = new int[] {1, 2}, 
                        StartDate = new DateTime(2024, 11, 13), 
                        DueDate = new DateTime(2025, 2, 13) 
                    }
                );
        }

        public static void Initialize(IServiceProvider serviceProvider)
        {
            using var context = new JanTaskTrackerDbContext(
                serviceProvider.GetRequiredService<DbContextOptions<JanTaskTrackerDbContext>>());

            if (context.Database.EnsureCreated())
            {
                // Database was created; no additional steps needed
            }
        }
    }
}
