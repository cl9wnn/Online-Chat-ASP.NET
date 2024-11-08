public class JoinMessage : Message
{
    public override string Type => "join";

    public JoinMessage(User user) : base(user)
    {
        Text = $"{user.Name} joined the room";
    }
}