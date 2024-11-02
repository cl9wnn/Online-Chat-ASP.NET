public abstract class Message
{
    public string Timestamp { get; } = DateTime.Now.ToString("HH:mm");
    public abstract string Type { get; }
    public string? Text { get; set; }
}
