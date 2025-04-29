using Microsoft.EntityFrameworkCore;
using JanTaskTracker.Server.Models;

namespace JanTaskTracker.Server.Repositories
{
    public class ProjectRepository : IProjectRepository
    {
        private readonly JanTaskTrackerDbContext _context;

        public ProjectRepository(JanTaskTrackerDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ProjectDTO>> GetAllProjectsAsync()
        {
            return await _context.Projects
                .Select(p => new ProjectDTO
                {
                    ProjectId = p.ProjectId,
                    ProjectName = p.ProjectName,
                    Description = p.Description,
                    Status = p.Status,
                    StartDate = p.StartDate,
                    DueDate = p.DueDate
                })
                .ToListAsync();
        }

        public async Task<ProjectDTO> GetProjectByIdAsync(int id)
        {
            var project = await _context.Projects.FindAsync(id);
            if (project == null) return null;

            return new ProjectDTO
            {
                ProjectId = project.ProjectId,
                ProjectName = project.ProjectName,
                Description = project.Description,
                Status = project.Status,
                StartDate = project.StartDate,
                DueDate = project.DueDate,
            };
        }

        public async Task CreateProjectAsync(ProjectDTO projectDto)
        {
            var project = new Project
            {
                ProjectName = projectDto.ProjectName,
                Description = projectDto.Description,
                Status = projectDto.Status,
                StartDate = projectDto.StartDate,
                DueDate = projectDto.DueDate,
            };

            await _context.Projects.AddAsync(project);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> UpdateProjectAsync(ProjectDTO projectDto)
        {
            var project = await _context.Projects.FindAsync(projectDto.ProjectId);
            if (project == null) return false;

            project.ProjectName = projectDto.ProjectName;
            project.Description = projectDto.Description;
            project.Status = projectDto.Status;
            project.StartDate = projectDto.StartDate;
            project.DueDate = projectDto.DueDate;

            try
            {
                await _context.SaveChangesAsync();
                return true;
            }
            catch (DbUpdateConcurrencyException)
            {
                return false;
            }
        }

        public async Task<bool> DeleteProjectAsync(int id)
        {
            var project = await _context.Projects.FindAsync(id);
            if (project == null) return false;

            _context.Projects.Remove(project);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<int>> GetAllProjectIdsAsync()
        {
            return await _context.Projects.Select(p => p.ProjectId).ToListAsync();
        }
    }
}