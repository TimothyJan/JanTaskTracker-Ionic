using Microsoft.AspNetCore.Mvc;
using JanTaskTracker.Server.Models;

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

        [HttpGet]
        public async Task<ActionResult<IEnumerable<DepartmentDTO>>> GetAllDepartments()
        {
            var departments = await _repository.GetAllDepartmentsAsync();
            return Ok(departments);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<DepartmentDTO>> GetDepartmentById(int id)
        {
            var department = await _repository.GetDepartmentByIdAsync(id);
            if (department == null) return NotFound();
            return Ok(department);
        }

        [HttpPost]
        public async Task<ActionResult<DepartmentDTO>> CreateDepartment(DepartmentDTO departmentDto)
        {
            // Check for duplicate department name
            if (await _repository.CheckDuplicateNameAsync(departmentDto.DepartmentName))
            {
                return Conflict(new { message = $"A department with the name '{departmentDto.DepartmentName}' already exists." });
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

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDepartment(int id, DepartmentDTO departmentDto)
        {
            if (id != departmentDto.DepartmentID)
            {
                return BadRequest(new { message = "Department ID mismatch." });
            }

            // Get existing department to compare names
            var existingDepartment = await _repository.GetDepartmentByIdAsync(id);
            if (existingDepartment == null)
            {
                return NotFound();
            }

            // Only check for duplicates if the name is being changed
            if (!string.Equals(existingDepartment.DepartmentName, departmentDto.DepartmentName, StringComparison.OrdinalIgnoreCase))
            {
                if (await _repository.CheckDuplicateNameAsync(departmentDto.DepartmentName))
                {
                    return Conflict(new { message = $"A department with the name '{departmentDto.DepartmentName}' already exists." });
                }
            }

            await _repository.UpdateDepartmentAsync(departmentDto);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDepartment(int id)
        {
            var departmentExists = await _repository.GetDepartmentByIdAsync(id) != null;
            if (!departmentExists)
            {
                return NotFound();
            }

            await _repository.DeleteDepartmentAsync(id);
            return NoContent();
        }
    }
}