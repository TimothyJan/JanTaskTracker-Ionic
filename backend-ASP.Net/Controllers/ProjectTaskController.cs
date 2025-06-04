using JanTaskTracker.Server.Models;
using JanTaskTracker.Server.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace JanTaskTracker.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectTaskController : ControllerBase
    {
        private readonly IProjectTaskRepository _repository;

        public ProjectTaskController(IProjectTaskRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProjectTaskDTO>>> GetAllProjectTasks()
        {
            var tasks = await _repository.GetAllProjectTasksAsync();
            return Ok(tasks);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProjectTaskDTO>> GetProjectTaskById(int id)
        {
            var task = await _repository.GetProjectTaskByIdAsync(id);
            if (task == null) return NotFound();
            return Ok(task);
        }

        [HttpPost]
        public async Task<IActionResult> CreateProjectTask(ProjectTaskDTO projectTaskDto)
        {
            await _repository.CreateProjectTaskAsync(projectTaskDto);
            return CreatedAtAction(nameof(GetProjectTaskById), new { id = projectTaskDto.ProjectTaskId }, projectTaskDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProjectTask(int id, ProjectTaskDTO projectTaskDto)
        {
            if (id != projectTaskDto.ProjectTaskId) return BadRequest();

            await _repository.UpdateProjectTaskAsync(projectTaskDto);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProjectTask(int id)
        {
            await _repository.DeleteProjectTaskAsync(id);
            return NoContent();
        }

        [HttpGet("project/{projectId}/tasks")]
        public async Task<ActionResult<IEnumerable<int>>> GetProjectTaskIdsByProjectId(int projectId)
        {
            var taskIds = await _repository.GetProjectTaskIdsByProjectIdAsync(projectId);

            if (taskIds == null || !taskIds.Any())
                return NotFound($"No tasks found for project with Id {projectId}");

            return Ok(taskIds);
        }
    }
}
