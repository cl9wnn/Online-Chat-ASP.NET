public class JoinMessage : Message
{
    public override string Type => "join";

    public JoinMessage(string userName) : base(userName) 
    {
        Text = $"{userName} joined the room";
    }
}