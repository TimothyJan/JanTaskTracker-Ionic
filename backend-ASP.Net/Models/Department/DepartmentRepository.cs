using Microsoft.EntityFrameworkCore;

namespace JanTaskTracker.Server.Models
{
    public class DepartmentRepository : IdepartmentRepository
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
                    DepartmentId = d.DepartmentId,
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
                DepartmentId = department.DepartmentId,
                DepartmentName = department.DepartmentName
            };
        }

        public async Task CreateDepartmentAsync(DepartmentDTO departmentDto)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var department = new Department
                {
                    DepartmentName = departmentDto.DepartmentName
                };

                _context.Departments.Add(department);
                await _context.SaveChangesAsync();

                departmentDto.DepartmentId = department.DepartmentId;
                await transaction.CommitAsync();
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task UpdateDepartmentAsync(DepartmentDTO departmentDto)
        {
            var department = await _context.Departments.FindAsync(departmentDto.DepartmentId);
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

        public async Task<bool> CheckDuplicateNameAsync(string name)
        {
            return await _context.Departments
                .AnyAsync(d => d.DepartmentName.Trim().ToLower() == name.Trim().ToLower());
        }
    }

}
