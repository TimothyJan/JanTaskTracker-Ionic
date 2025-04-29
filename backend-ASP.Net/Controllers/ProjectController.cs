using JanTaskTracker.Server.Models;
using JanTaskTracker.Server.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace JanTaskTracker.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectController : ControllerBase
    {
        private readonly IProjectRepository _repository;

        public ProjectController(IProjectRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProjectDTO>>> GetAllProjects()
        {
            var projects = await _repository.GetAllProjectsAsync();
            return Ok(projects);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProjectDTO>> GetProjectById(int id)
        {
            var project = await _repository.GetProjectByIdAsync(id);
            if (project == null) return NotFound();
            return Ok(project);
        }

        [HttpPost]
        public async Task<IActionResult> CreateProject(ProjectDTO projectDto)
        {
            await _repository.CreateProjectAsync(projectDto);
            return CreatedAtAction(nameof(GetProjectById), new { id = projectDto.ProjectId }, projectDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProject(int id, ProjectDTO projectDto)
        {
            if (id != projectDto.ProjectId) return BadRequest();

            await _repository.UpdateProjectAsync(projectDto);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProject(int id)
        {
            await _repository.DeleteProjectAsync(id);
            return NoContent();
        }

        [HttpGet("projectIds")]
        public async Task<ActionResult<IEnumerable<int>>> GetAllProjectIds()
        {
            var projectIds = await _repository.GetAllProjectIdsAsync();
            return Ok(projectIds);
        }
    }
}
