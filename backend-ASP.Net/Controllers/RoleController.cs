using JanTaskTracker.Server.Models;
using Microsoft.AspNetCore.Mvc;
using System;

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

        // GET: api/Role/check-duplicate?name=TestName&departmentId=1
        [HttpGet("check-duplicate")]
        public async Task<ActionResult<bool>> CheckDuplicate(
            [FromQuery] string name,
            [FromQuery] int? departmentId = null)
        {
            if (string.IsNullOrWhiteSpace(name))
            {
                return BadRequest(new { message = "Role name is required." });
            }

            try
            {
                bool isDuplicate = await _repository.CheckDuplicateNameAsync(name, departmentId);
                return Ok(isDuplicate);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while checking for duplicate role names.",
                    error = ex.Message
                });
            }
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<RoleDTO>>> GetAllRoles()
        {
            try
            {
                var roles = await _repository.GetAllRolesAsync();
                return Ok(roles);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while retrieving roles.",
                    error = ex.Message
                });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<RoleDTO>> GetRoleById(int id)
        {
            try
            {
                var role = await _repository.GetRoleByIdAsync(id);
                if (role == null)
                {
                    return NotFound(new { message = $"Role with ID {id} not found." });
                }
                return Ok(role);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = $"An error occurred while retrieving role with ID {id}.",
                    error = ex.Message
                });
            }
        }

        [HttpPost]
        public async Task<ActionResult<RoleDTO>> CreateRole(RoleDTO roleDto)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(roleDto.RoleName))
                {
                    return BadRequest(new { message = "Role name is required." });
                }

                if (await _repository.CheckDuplicateNameAsync(roleDto.RoleName, roleDto.DepartmentID))
                {
                    return Conflict(new
                    {
                        message = $"A role with the name '{roleDto.RoleName}' already exists in this department.",
                        suggestion = "Please choose a different name."
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
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while creating the role.",
                    error = ex.Message
                });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRole(int id, RoleDTO roleDto)
        {
            try
            {
                if (id != roleDto.RoleID)
                {
                    return BadRequest(new { message = "Role ID mismatch." });
                }

                var existingRole = await _repository.GetRoleByIdAsync(id);
                if (existingRole == null)
                {
                    return NotFound(new { message = $"Role with ID {id} not found." });
                }

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
                            message = $"A role with the name '{roleDto.RoleName}' already exists in this department.",
                            suggestion = "Please choose a different name."
                        });
                    }
                }

                await _repository.UpdateRoleAsync(roleDto);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = $"An error occurred while updating role with ID {id}.",
                    error = ex.Message
                });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRole(int id)
        {
            try
            {
                var roleExists = await _repository.GetRoleByIdAsync(id) != null;
                if (!roleExists)
                {
                    return NotFound(new { message = $"Role with ID {id} not found." });
                }

                await _repository.DeleteRoleAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = $"An error occurred while deleting role with ID {id}.",
                    error = ex.Message
                });
            }
        }

        [HttpGet("department/{departmentId}/roles")]
        public async Task<ActionResult<IEnumerable<RoleDTO>>> GetRolesByDepartmentId(int departmentId)
        {
            try
            {
                var roles = await _repository.GetRolesByDepartmentIdAsync(departmentId);
                if (roles == null || !roles.Any())
                {
                    return NotFound(new { message = $"No roles found for department ID {departmentId}." });
                }
                return Ok(roles);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = $"An error occurred while retrieving roles for department ID {departmentId}.",
                    error = ex.Message
                });
            }
        }
    }
}