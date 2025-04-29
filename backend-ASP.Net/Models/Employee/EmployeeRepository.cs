using Microsoft.EntityFrameworkCore;

namespace JanTaskTracker.Server.Models
{
    public class EmployeeRepository : IEmployeeRepository
    {
        private readonly JanTaskTrackerDbContext _context;

        public EmployeeRepository(JanTaskTrackerDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<EmployeeDTO>> GetAllEmployeesAsync()
        {
            return await _context.Employees
                .Select(e => new EmployeeDTO
                {
                    EmployeeID = e.EmployeeID,
                    Name = e.Name,
                    Salary = e.Salary,
                    DepartmentID = e.DepartmentID,
                    RoleID = e.RoleID
                })
                .ToListAsync();
        }

        public async Task<EmployeeDTO> GetEmployeeByIdAsync(int id)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null) return null;

            return new EmployeeDTO
            {
                EmployeeID = employee.EmployeeID,
                Name = employee.Name,
                Salary = employee.Salary,
                DepartmentID = employee.DepartmentID,
                RoleID = employee.RoleID
            };
        }

        public async Task CreateEmployeeAsync(EmployeeDTO employeeDto)
        {
            var employee = new Employee
            {
                Name = employeeDto.Name,
                Salary = employeeDto.Salary,
                DepartmentID = employeeDto.DepartmentID,
                RoleID = employeeDto.RoleID
            };
            _context.Employees.Add(employee);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateEmployeeAsync(EmployeeDTO employeeDto)
        {
            var employee = await _context.Employees.FindAsync(employeeDto.EmployeeID);
            if (employee == null) return;

            employee.Name = employeeDto.Name;
            employee.Salary = employeeDto.Salary;
            employee.DepartmentID = employeeDto.DepartmentID;
            employee.RoleID = employeeDto.RoleID;

            await _context.SaveChangesAsync();
        }

        public async Task DeleteEmployeeAsync(int id)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null) return;

            _context.Employees.Remove(employee);
            await _context.SaveChangesAsync();
        }
    }

}
