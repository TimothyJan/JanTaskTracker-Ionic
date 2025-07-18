﻿using Microsoft.EntityFrameworkCore;

namespace JanTaskTracker.Server.Models
{
    public class RoleRepository : IRoleRepository
    {
        private readonly JanTaskTrackerDbContext _context;

        public RoleRepository(JanTaskTrackerDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<RoleDTO>> GetAllRolesAsync()
        {
            return await _context.Roles
                .Select(r => new RoleDTO
                {
                    RoleId = r.RoleId,
                    RoleName = r.RoleName,
                    DepartmentId = r.DepartmentId
                })
                .ToListAsync();
        }

        public async Task<RoleDTO> GetRoleByIdAsync(int id)
        {
            var role = await _context.Roles.FindAsync(id);
            if (role == null) return null;

            return new RoleDTO
            {
                RoleId = role.RoleId,
                RoleName = role.RoleName,
                DepartmentId = role.DepartmentId
            };
        }

        public async Task CreateRoleAsync(RoleDTO roleDto)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var role = new Role
                {
                    RoleName = roleDto.RoleName,
                    DepartmentId = roleDto.DepartmentId
                };

                _context.Roles.Add(role);
                await _context.SaveChangesAsync();

                roleDto.RoleId = role.RoleId;
                await transaction.CommitAsync();
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task UpdateRoleAsync(RoleDTO roleDto)
        {
            var role = await _context.Roles.FindAsync(roleDto.RoleId);
            if (role == null) return;

            role.RoleName = roleDto.RoleName;
            role.DepartmentId = roleDto.DepartmentId;

            await _context.SaveChangesAsync();
        }

        public async Task DeleteRoleAsync(int id)
        {
            var role = await _context.Roles.FindAsync(id);
            if (role == null) return;

            _context.Roles.Remove(role);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<RoleDTO>> GetRolesByDepartmentIdAsync(int departmentId)
        {
            return await _context.Roles
                .Where(r => r.DepartmentId == departmentId)
                .Select(r => new RoleDTO
                {
                    RoleId = r.RoleId,
                    RoleName = r.RoleName,
                    DepartmentId = r.DepartmentId
                })
                .ToListAsync();
        }

        public async Task<bool> CheckDuplicateNameAsync(string name, int? departmentId = null, int? excludeRoleId = null)
        {
            var query = _context.Roles
                .Where(r => r.RoleName.Trim().ToLower() == name.Trim().ToLower());

            if (departmentId.HasValue)
            {
                query = query.Where(r => r.DepartmentId == departmentId.Value);
            }

            if (excludeRoleId.HasValue)
            {
                query = query.Where(r => r.RoleId != excludeRoleId.Value);
            }

            return await query.AnyAsync();
        }

    }

}
