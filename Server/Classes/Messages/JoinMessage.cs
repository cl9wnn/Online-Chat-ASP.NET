public class JoinMessage : Message<string>
{
    public override string Type => "join";

    public JoinMessage(User user) : base(user)
    {
        Data = $"{user.Name} joined the room";
    }
}