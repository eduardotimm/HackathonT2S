namespace HackathonT2S.Models
{
    public class User
    {
        public int  UserID { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = "User";
        public ICollection<Project> Projects { get; set; } = new List<Project>();
    }
}
