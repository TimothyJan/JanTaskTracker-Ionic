// RoleController.cs
using JanTaskTracker.Server.Models;
using Microsoft.AspNetCore.Mvc;

namespace JanTaskTracker.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoleController : ControllerBase
    {
        private readonly IRoleRepository _repository;

        public RoleController(IRoleRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<RoleDTO>>> GetAllRoles()
        {
            var roles = await _repository.GetAllRolesAsync();
            return Ok(roles);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<RoleDTO>> GetRoleById(int id)
        {
            var role = await _repository.GetRoleByIdAsync(id);
            if (role == null) return NotFound();
            return Ok(role);
        }

        [HttpPost]
        public async Task<ActionResult<RoleDTO>> CreateRole(RoleDTO roleDto)
        {
            // Check for duplicate role name in the same department
            if (await _repository.CheckDuplicateNameAsync(roleDto.RoleName, roleDto.DepartmentID))
            {
                return Conflict(new
                {
                    message = $"A role with the name '{roleDto.RoleName}' already exists in this department."
                });
            }

            await _repository.CreateRoleAsync(roleDto);

            var createdRole = await _repository.GetRoleByIdAsync(roleDto.RoleID);
            if (createdRole == null)
            {
                return Problem("Role was created but could not be retrieved.");
            }

            return CreatedAtAction(
                nameof(GetRoleById),
                new { id = createdRole.RoleID },
                createdRole);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRole(int id, RoleDTO roleDto)
        {
            if (id != roleDto.RoleID)
            {
                return BadRequest(new { message = "Role ID mismatch." });
            }

            var existingRole = await _repository.GetRoleByIdAsync(id);
            if (existingRole == null)
            {
                return NotFound();
            }

            // Only check for duplicates if name or department is being changed
            if (existingRole.RoleName != roleDto.RoleName ||
                existingRole.DepartmentID != roleDto.DepartmentID)
            {
                if (await _repository.CheckDuplicateNameAsync(
                    roleDto.RoleName,
                    roleDto.DepartmentID,
                    roleDto.RoleID))
                {
                    return Conflict(new
                    {
                        message = $"A role with the name '{roleDto.RoleName}' already exists in this department."
                    });
                }
            }

            await _repository.UpdateRoleAsync(roleDto);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRole(int id)
        {
            var roleExists = await _repository.GetRoleByIdAsync(id) != null;
            if (!roleExists)
            {
                return NotFound();
            }

            await _repository.DeleteRoleAsync(id);
            return NoContent();
        }

        [HttpGet("department/{departmentId}/roles")]
        public async Task<ActionResult<IEnumerable<RoleDTO>>> GetRolesByDepartmentId(int departmentId)
        {
            var roles = await _repository.GetRolesByDepartmentIdAsync(departmentId);
            if (roles == null || !roles.Any()) return NotFound();
            return Ok(roles);
        }
    }
}