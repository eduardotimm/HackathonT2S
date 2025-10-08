using Microsoft.EntityFrameworkCore;
using HackathonT2S.Models;

namespace HackathonT2S.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }
        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Rating> Ratings { get; set; } = null!;
        public DbSet<Project> Projects { get; set; } = null!;
        public DbSet<Report> Reports { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configura o relacionamento um-para-muitos: Um User pode ter vários Projects.
            modelBuilder.Entity<User>()
                .HasMany(u => u.Projects)
                .WithOne(p => p.User)
                .HasForeignKey(p => p.UserID);

            // Configura o relacionamento um-para-muitos: Um Project pode ter vários Reports.
            modelBuilder.Entity<Project>()
                .HasMany(p => p.Reports)
                .WithOne(r => r.Project)
                .HasForeignKey(r => r.ProjectID);
        }
    }
}
