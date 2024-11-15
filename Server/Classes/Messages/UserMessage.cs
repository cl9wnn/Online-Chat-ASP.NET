public class UserMessage : Message<string>
{
    public override string Type => "user";
    public UserMessage(User user, string data) : base(user)
    {
        Data = data;
    }
}
