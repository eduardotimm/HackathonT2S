﻿using System.Collections.Generic;

namespace HackathonT2S.Models
{
    public class Project
    {

        public int ProjectID { get; set; }
        public int UserID { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; } = string.Empty;
    public string RepoURL { get; set; } = string.Empty;
    // Caminho absoluto ou relativo no disco onde o projeto reside (opcional)
    public string? LocalPath { get; set; }
        public string Status { get; set; } = "Pendente";
        public DateTime SubmittedAt { get; set; }
        public DateTime LastUpdatedAt { get; set; }

        // Propriedades de navegação
        public User User { get; set; }
        public ICollection<Report> Reports { get; set; } = new List<Report>();
        public ICollection<Rating> Ratings { get; set; } = new List<Rating>(); // Para avaliações manuais
        public ICollection<PythonRatingDetail> PythonRatingDetails { get; set; } = new List<PythonRatingDetail>(); // Para avaliações da IA
    }
}
