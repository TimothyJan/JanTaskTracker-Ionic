using JanTaskTracker.Server.Models;

namespace JanTaskTracker.Server.Repositories
{
    public interface IProjectTaskRepository
    {
        Task<IEnumerable<ProjectTaskDTO>> GetAllProjectTasksAsync();
        Task<ProjectTaskDTO> GetProjectTaskByIdAsync(int id);
        Task CreateProjectTaskAsync(ProjectTaskDTO task);
        Task<bool> UpdateProjectTaskAsync(ProjectTaskDTO task);
        Task<bool> DeleteProjectTaskAsync(int id);
        Task<IEnumerable<int>> GetProjectTaskIdsByProjectIdAsync(int projectId);
    }
}
