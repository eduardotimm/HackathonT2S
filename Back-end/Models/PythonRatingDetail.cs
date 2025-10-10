using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HackathonT2S.Models
{
    public class PythonRatingDetail
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("Project")]
        public int ProjectID { get; set; }
        public Project Project { get; set; } = null!;

        [Required]
        [MaxLength(255)]
        public string Criterion { get; set; } = string.Empty;

        [Required]
        public int Score { get; set; }

        [Required]
        public string Justification { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}