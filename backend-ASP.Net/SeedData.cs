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
                new Department { DepartmentId = 1, DepartmentName = "Finance" },
                new Department { DepartmentId = 2, DepartmentName = "Human Resources" },
                new Department { DepartmentId = 3, DepartmentName = "Information Technology" }
                );

            // Seed Roles
            modelBuilder.Entity<Role>().HasData(
                new Role { RoleId = 1, RoleName = "Accountant", DepartmentId = 1 },
                new Role { RoleId = 2, RoleName = "Financial Analyst", DepartmentId = 1 },
                new Role { RoleId = 3, RoleName = "Finance Manager", DepartmentId = 1 },
                new Role { RoleId = 4, RoleName = "HR Assistant", DepartmentId = 2 },
                new Role { RoleId = 5, RoleName = "HR Specialist", DepartmentId = 2 },
                new Role { RoleId = 6, RoleName = "HR Director", DepartmentId = 2 },
                new Role { RoleId = 7, RoleName = "Software Engineer", DepartmentId = 3 },
                new Role { RoleId = 8, RoleName = "Front-End Developer", DepartmentId = 3 },
                new Role { RoleId = 9, RoleName = "Back-End Developer", DepartmentId = 3 },
                new Role { RoleId = 10, RoleName = "Full-Stack Developer", DepartmentId = 3 }
                );

            // Seed Roles
            modelBuilder.Entity<Employee>().HasData(
                new Employee { EmployeeId = 1, Name = "Bob Smith", Salary = 70000, DepartmentId = 1, RoleId = 2 },
                new Employee { EmployeeId = 2, Name = "Catherine Green", Salary = 65000, DepartmentId = 2, RoleId = 5 },
                new Employee { EmployeeId = 3, Name = "David Brown", Salary = 90000, DepartmentId = 3, RoleId = 7 }
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
