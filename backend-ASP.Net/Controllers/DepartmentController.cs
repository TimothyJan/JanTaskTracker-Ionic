using Microsoft.AspNetCore.Mvc;
using JanTaskTracker.Server.Models;
using System;

namespace JanTaskTracker.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DepartmentController : ControllerBase
    {
        private readonly IDepartmentRepository _repository;

        public DepartmentController(IDepartmentRepository repository)
        {
            _repository = repository;
        }

        // GET: api/Department
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DepartmentDTO>>> GetAllDepartments()
        {
            try
            {
                var departments = await _repository.GetAllDepartmentsAsync();
                return Ok(departments);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving departments.", error = ex.Message });
            }
        }

        // GET: api/Department/5
        [HttpGet("{id}")]
        public async Task<ActionResult<DepartmentDTO>> GetDepartmentById(int id)
        {
            try
            {
                var department = await _repository.GetDepartmentByIdAsync(id);
                if (department == null)
                {
                    return NotFound(new { message = $"Department with ID {id} not found." });
                }
                return Ok(department);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"An error occurred while retrieving department with ID {id}.", error = ex.Message });
            }
        }

        // POST: api/Department
        [HttpPost]
        public async Task<ActionResult<DepartmentDTO>> CreateDepartment(DepartmentDTO departmentDto)
        {
            try
            {
                // Validate input
                if (string.IsNullOrWhiteSpace(departmentDto.DepartmentName))
                {
                    return BadRequest(new { message = "Department name is required." });
                }

                // Check for duplicate department name
                if (await _repository.CheckDuplicateNameAsync(departmentDto.DepartmentName))
                {
                    return Conflict(new
                    {
                        message = $"A department with the name '{departmentDto.DepartmentName}' already exists.",
                        suggestion = "Please choose a different name."
                    });
                }

                await _repository.CreateDepartmentAsync(departmentDto);

                // Get the newly created department to return with the response
                var createdDepartment = await _repository.GetDepartmentByIdAsync(departmentDto.DepartmentID);
                if (createdDepartment == null)
                {
                    return Problem("Department was created but could not be retrieved.");
                }

                return CreatedAtAction(
                    nameof(GetDepartmentById),
                    new { id = createdDepartment.DepartmentID },
                    createdDepartment);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while creating the department.", error = ex.Message });
            }
        }

        // PUT: api/Department/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDepartment(int id, DepartmentDTO departmentDto)
        {
            try
            {
                if (id != departmentDto.DepartmentID)
                {
                    return BadRequest(new { message = "Department ID in URL does not match ID in request body." });
                }

                // Validate input
                if (string.IsNullOrWhiteSpace(departmentDto.DepartmentName))
                {
                    return BadRequest(new { message = "Department name is required." });
                }

                // Get existing department to compare names
                var existingDepartment = await _repository.GetDepartmentByIdAsync(id);
                if (existingDepartment == null)
                {
                    return NotFound(new { message = $"Department with ID {id} not found." });
                }

                // Only check for duplicates if the name is being changed
                if (!string.Equals(existingDepartment.DepartmentName, departmentDto.DepartmentName, StringComparison.OrdinalIgnoreCase))
                {
                    if (await _repository.CheckDuplicateNameAsync(departmentDto.DepartmentName))
                    {
                        return Conflict(new
                        {
                            message = $"A department with the name '{departmentDto.DepartmentName}' already exists.",
                            suggestion = "Please choose a different name."
                        });
                    }
                }

                await _repository.UpdateDepartmentAsync(departmentDto);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"An error occurred while updating department with ID {id}.", error = ex.Message });
            }
        }

        // DELETE: api/Department/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDepartment(int id)
        {
            try
            {
                var departmentExists = await _repository.GetDepartmentByIdAsync(id) != null;
                if (!departmentExists)
                {
                    return NotFound(new { message = $"Department with ID {id} not found." });
                }

                await _repository.DeleteDepartmentAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"An error occurred while deleting department with ID {id}.", error = ex.Message });
            }
        }

        [HttpGet("check-duplicate")]
        public async Task<ActionResult<bool>> CheckDuplicate([FromQuery] string name)
        {
            if (string.IsNullOrWhiteSpace(name))
            {
                return BadRequest(new { message = "Department name is required." });
            }

            try
            {
                bool isDuplicate = await _repository.CheckDuplicateNameAsync(name);
                return Ok(isDuplicate);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while checking for duplicate department names.",
                    error = ex.Message
                });
            }
        }
    }
}