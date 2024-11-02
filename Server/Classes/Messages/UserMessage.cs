public class UserMessage : Message
{
    public override string Type => "user";
    public UserMessage(string userName, string message)
    {
        Text = $"[{userName}] {message}";
    }
}
