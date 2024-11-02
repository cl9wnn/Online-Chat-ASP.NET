public class LeaveMessage : Message
{
    public override string Type => "leave";
    public LeaveMessage(string userName)
    {
        Text = $"{userName} left the room";
    }
}