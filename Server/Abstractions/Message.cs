public abstract class Message
{
    public string Timestamp { get; } = DateTime.Now.ToString("HH:mm");
    public abstract string Type { get; }
    public User? User { get; }
    public string? Text { get; set; }

    public Message(User user)
    {
        User = user;
    }
}
