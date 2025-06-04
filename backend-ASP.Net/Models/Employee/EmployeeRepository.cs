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
                    EmployeeId = e.EmployeeId,
                    Name = e.Name,
                    Salary = e.Salary,
                    DepartmentId = e.DepartmentId,
                    RoleId = e.RoleId
                })
                .ToListAsync();
        }

        public async Task<EmployeeDTO> GetEmployeeByIdAsync(int id)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null) return null;

            return new EmployeeDTO
            {
                EmployeeId = employee.EmployeeId,
                Name = employee.Name,
                Salary = employee.Salary,
                DepartmentId = employee.DepartmentId,
                RoleId = employee.RoleId
            };
        }

        public async Task CreateEmployeeAsync(EmployeeDTO employeeDto)
        {
            var employee = new Employee
            {
                Name = employeeDto.Name,
                Salary = employeeDto.Salary,
                DepartmentId = employeeDto.DepartmentId,
                RoleId = employeeDto.RoleId
            };
            _context.Employees.Add(employee);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateEmployeeAsync(EmployeeDTO employeeDto)
        {
            var employee = await _context.Employees.FindAsync(employeeDto.EmployeeId);
            if (employee == null) return;

            employee.Name = employeeDto.Name;
            employee.Salary = employeeDto.Salary;
            employee.DepartmentId = employeeDto.DepartmentId;
            employee.RoleId = employeeDto.RoleId;

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
