using Microsoft.EntityFrameworkCore;
using JanTaskTracker.Server.Models;
using System.Text.Json;

namespace JanTaskTracker.Server.Repositories
{
    public class ProjectTaskRepository : IProjectTaskRepository
    {
        private readonly JanTaskTrackerDbContext _context;

        public ProjectTaskRepository(JanTaskTrackerDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ProjectTaskDTO>> GetAllProjectTasksAsync()
        {
            return await _context.ProjectTasks
                .Select(task => MapToDTO(task))
                .ToListAsync();
        }

        public async Task<ProjectTaskDTO> GetProjectTaskByIdAsync(int id)
        {
            var task = await _context.ProjectTasks.FindAsync(id);
            return task != null ? MapToDTO(task) : null;
        }

        public async Task CreateProjectTaskAsync(ProjectTaskDTO taskDto)
        {
            var task = MapToEntity(taskDto);
            await _context.ProjectTasks.AddAsync(task);
            await _context.SaveChangesAsync();

            // Update the DTO with the generated ID
            taskDto.ProjectTaskId = task.ProjectTaskId;
        }

        public async Task<bool> UpdateProjectTaskAsync(ProjectTaskDTO taskDto)
        {
            var task = await _context.ProjectTasks.FindAsync(taskDto.ProjectTaskId);
            if (task == null) return false;

            MapToEntity(taskDto, task);

            try
            {
                await _context.SaveChangesAsync();
                return true;
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await ProjectTaskExists(taskDto.ProjectTaskId))
                    return false;
                throw;
            }
        }

        public async Task<bool> DeleteProjectTaskAsync(int id)
        {
            var task = await _context.ProjectTasks.FindAsync(id);
            if (task == null) return false;

            _context.ProjectTasks.Remove(task);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<int>> GetProjectTaskIdsByProjectIdAsync(int projectId)
        {
            return await _context.ProjectTasks
                .Where(task => task.ProjectId == projectId)
                .Select(task => task.ProjectTaskId)
                .ToListAsync();
        }

        private async Task<bool> ProjectTaskExists(int id)
        {
            return await _context.ProjectTasks.AnyAsync(e => e.ProjectTaskId == id);
        }

        private static ProjectTaskDTO MapToDTO(ProjectTask task)
        {
            return new ProjectTaskDTO
            {
                ProjectTaskId = task.ProjectTaskId,
                ProjectId = task.ProjectId,
                Title = task.Title,
                Description = task.Description,
                Status = task.Status,
                AssignedEmployeeIds = task.AssignedEmployeeIds,
                StartDate = task.StartDate,
                DueDate = task.DueDate
            };
        }

        private static ProjectTask MapToEntity(ProjectTaskDTO dto, ProjectTask existingTask = null)
        {
            var task = existingTask ?? new ProjectTask();

            // Don't set ProjectTaskId when creating new entity
            if (existingTask != null)
            {
                task.ProjectTaskId = dto.ProjectTaskId;
            }

            task.ProjectId = dto.ProjectId;
            task.Title = dto.Title;
            task.Description = dto.Description;
            task.Status = dto.Status;
            task.AssignedEmployeeIds = dto.AssignedEmployeeIds ?? Array.Empty<int>();
            task.StartDate = dto.StartDate;
            task.DueDate = dto.DueDate;

            return task;
        }
    }
}