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
        public async Task<IActionResult> CreateDepartment(DepartmentDTO departmentDto)
        {
            await _repository.CreateDepartmentAsync(departmentDto);
            return CreatedAtAction(nameof(GetDepartmentById), new { id = departmentDto.DepartmentID }, departmentDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDepartment(int id, DepartmentDTO departmentDto)
        {
            if (id != departmentDto.DepartmentID) return BadRequest();

            await _repository.UpdateDepartmentAsync(departmentDto);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDepartment(int id)
        {
            await _repository.DeleteDepartmentAsync(id);
            return NoContent();
        }
    }
}
