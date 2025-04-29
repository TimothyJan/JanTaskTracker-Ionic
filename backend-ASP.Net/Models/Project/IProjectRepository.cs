using JanTaskTracker.Server.Models;

namespace JanTaskTracker.Server.Repositories
{
    public interface IProjectRepository
    {
        Task<IEnumerable<ProjectDTO>> GetAllProjectsAsync();
        Task<ProjectDTO> GetProjectByIdAsync(int id);
        Task CreateProjectAsync(ProjectDTO project);
        Task<bool> UpdateProjectAsync(ProjectDTO project);
        Task<bool> DeleteProjectAsync(int id);
        Task<IEnumerable<int>> GetAllProjectIdsAsync();
    }
}