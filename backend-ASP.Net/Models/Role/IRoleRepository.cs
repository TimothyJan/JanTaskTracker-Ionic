namespace JanTaskTracker.Server.Models
{
    public interface IRoleRepository
    {
        Task<IEnumerable<RoleDTO>> GetAllRolesAsync();
        Task<RoleDTO> GetRoleByIdAsync(int id);
        Task CreateRoleAsync(RoleDTO roleDto);
        Task UpdateRoleAsync(RoleDTO roleDto);
        Task DeleteRoleAsync(int id);
        Task<IEnumerable<RoleDTO>> GetRolesByDepartmentIdAsync(int departmentId);
    }

}
