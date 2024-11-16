public class ImageMessage : Message<byte[]>
{
    public override string Type => "image";
    public bool IsLastChunk { get; set; }
    public ImageMessage(User user, byte[] data,  bool isLastChunk) : base(user)
    {
        Data = data;
        IsLastChunk = isLastChunk;
    }
}
