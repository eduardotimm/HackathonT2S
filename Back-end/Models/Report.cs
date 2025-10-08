﻿using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HackathonT2S.Models
{
    public class Report
    {
        [Key]
        public int ReportID { get; set; }
        public int ProjectID { get; set; } // Chave estrangeira
        public Project Project { get; set; } // Propriedade de navegação
        public DateTime GeneratedAt { get; set; }
        public string MarkdownContent { get; set; }
        public double TotalScore { get; set; }
    }
}