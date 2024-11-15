public abstract class Message<T>
{
    public string Timestamp { get; } = DateTime.Now.ToString("HH:mm");
    public abstract string Type { get; }
    public User? User { get; }
    public T? Data { get; set; }

    public Message(User user)
    {
        User = user;
    }
}
