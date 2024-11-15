public class LeaveMessage : Message<string>
{
    public override string Type => "leave";
    public LeaveMessage(User user) : base(user)
    {
        Data = $"{user.Name} left the room";
    }
}