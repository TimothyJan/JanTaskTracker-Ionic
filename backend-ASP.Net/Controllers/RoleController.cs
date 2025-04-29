using JanTaskTracker.Server.Models;
using Microsoft.AspNetCore.Mvc;
using System.Data;

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
        public async Task<IActionResult> CreateRole(RoleDTO roleDto)
        {
            await _repository.CreateRoleAsync(roleDto);
            return CreatedAtAction(nameof(GetRoleById), new { id = roleDto.RoleID }, roleDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRole(int id, RoleDTO roleDto)
        {
            if (id != roleDto.RoleID) return BadRequest();

            await _repository.UpdateRoleAsync(roleDto);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRole(int id)
        {
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
