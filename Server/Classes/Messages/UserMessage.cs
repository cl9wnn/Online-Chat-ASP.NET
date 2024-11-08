public class UserMessage : Message
{
    public override string Type => "user";
    public UserMessage(User user, string text) : base(user)
    {
        Text = text;
    }
}
