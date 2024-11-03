public class UserMessage : Message
{
    public override string Type => "user";
    public UserMessage(string userName, string text) : base(userName)
    {
        Text =text;
    }
}
