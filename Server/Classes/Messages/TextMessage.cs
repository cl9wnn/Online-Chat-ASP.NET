public class TextMessage : Message<string>
{
    public override string Type => "text";
    public TextMessage(User user, string data) : base(user)
    {
        Data = data;
    }
}
