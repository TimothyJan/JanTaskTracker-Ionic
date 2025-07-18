﻿namespace JanTaskTracker.Server.Models
{
    public interface IdepartmentRepository
    {
        Task<IEnumerable<DepartmentDTO>> GetAllDepartmentsAsync();
        Task<DepartmentDTO> GetDepartmentByIdAsync(int id);
        Task CreateDepartmentAsync(DepartmentDTO departmentDto);
        Task UpdateDepartmentAsync(DepartmentDTO departmentDto);
        Task DeleteDepartmentAsync(int id);
        Task<bool> CheckDuplicateNameAsync(string name);
    }
}
