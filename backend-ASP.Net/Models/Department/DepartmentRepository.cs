using Microsoft.EntityFrameworkCore;

namespace JanTaskTracker.Server.Models
{
    public class DepartmentRepository : IDepartmentRepository
    {
        private readonly JanTaskTrackerDbContext _context;

        public DepartmentRepository(JanTaskTrackerDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<DepartmentDTO>> GetAllDepartmentsAsync()
        {
            return await _context.Departments
                .Select(d => new DepartmentDTO
                {
                    DepartmentID = d.DepartmentID,
                    DepartmentName = d.DepartmentName
                })
                .ToListAsync();
        }

        public async Task<DepartmentDTO> GetDepartmentByIdAsync(int id)
        {
            var department = await _context.Departments.FindAsync(id);
            if (department == null) return null;

            return new DepartmentDTO
            {
                DepartmentID = department.DepartmentID,
                DepartmentName = department.DepartmentName
            };
        }

        public async Task CreateDepartmentAsync(DepartmentDTO departmentDto)
        {
            var department = new Department
            {
                DepartmentName = departmentDto.DepartmentName
            };
            _context.Departments.Add(department);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateDepartmentAsync(DepartmentDTO departmentDto)
        {
            var department = await _context.Departments.FindAsync(departmentDto.DepartmentID);
            if (department == null) return;

            department.DepartmentName = departmentDto.DepartmentName;

            await _context.SaveChangesAsync();
        }

        public async Task DeleteDepartmentAsync(int id)
        {
            var department = await _context.Departments.FindAsync(id);
            if (department == null) return;

            _context.Departments.Remove(department);
            await _context.SaveChangesAsync();
        }
    }

}
