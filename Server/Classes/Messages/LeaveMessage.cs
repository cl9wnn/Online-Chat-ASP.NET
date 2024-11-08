public class LeaveMessage : Message
{
    public override string Type => "leave";
    public LeaveMessage(User user) : base(user)
    {
        Text = $"{user.Name} left the room";
    }
}