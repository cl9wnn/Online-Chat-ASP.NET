using System.Net;
using System.Net.WebSockets;
using System.Text;
using System.Text.Json;


var builder = WebApplication.CreateBuilder(args);
builder.WebHost.UseUrls("http://localhost:34101");
var app = builder.Build();
app.UseWebSockets();
app.UseStaticFiles();

var connections = new List<WebSocket>();

app.MapGet("/chat", async context =>
{
    context.Response.ContentType = "text/html";
    await context.Response.SendFileAsync("wwwroot/index.html");
});


app.MapGet("/", async context =>
{

    if (context.WebSockets.IsWebSocketRequest)
    {
        using var ws = await context.WebSockets.AcceptWebSocketAsync();

        connections.Add(ws);

        var currentName = context.Request.Query["name"];
        var currentGuid = context.Request.Query["guid"];

        var user = new User(currentGuid, currentName);

        await SendMessage(new JoinMessage(user));
        await SendMessage(connections.Count());

        await RecieveMessage(ws, async (result, buffer) =>
        {
            if (result.MessageType == WebSocketMessageType.Text)
            {
                string message = Encoding.UTF8.GetString(buffer, 0, result.Count);
                await SendMessage(new TextMessage(user, message));
            }
            else if (result.MessageType == WebSocketMessageType.Binary)
            {
                await SendImageMessage(buffer, 1024*64, user);

            }
            else if (result.MessageType == WebSocketMessageType.Close || ws.State == WebSocketState.Aborted)
            {
                connections.Remove(ws);
                await SendMessage(new LeaveMessage(user));
                await SendMessage(connections.Count());
                await ws.CloseAsync(result.CloseStatus.Value, result.CloseStatusDescription, CancellationToken.None);
            }
        });
    }
    else
    {
        context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
    }
});

async Task SendImageMessage(byte[] imageData, int chunkSize, User user)
{
    int totalChunks = (imageData.Length + chunkSize - 1) / chunkSize; 

    for (int i = 0; i < totalChunks; i++)
    {
        int offset = i * chunkSize; 
        int currentChunkSize = Math.Min(chunkSize, imageData.Length - offset); 

        var chunk = new byte[currentChunkSize];
        Array.Copy(imageData, offset, chunk, 0, currentChunkSize);

        bool isLastChunk = (i == totalChunks - 1);
        
        await SendMessage(new ImageMessage(user, chunk, isLastChunk));
    }
}

async Task SendMessage<T>(T message)
{
    var jsonMessage = JsonSerializer.Serialize(message);

    var bytes = Encoding.UTF8.GetBytes(jsonMessage);
    var arraySegment = new ArraySegment<byte>(bytes);

    foreach (var socket in connections)
    {
        if (socket.State == WebSocketState.Open)
        {
            await socket.SendAsync(arraySegment, WebSocketMessageType.Text, true, CancellationToken.None);

        }
    }
}

async Task RecieveMessage(WebSocket socket, Action<WebSocketReceiveResult, byte[]> handleMessage)
{
    var buffer = new byte[1024];
    var fullMessage = new List<byte>(); 

    while (socket.State == WebSocketState.Open)
    {
        var result = await socket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
        fullMessage.AddRange(buffer.Take(result.Count));

        if (result.EndOfMessage)
        {
            handleMessage(result, fullMessage.ToArray());
            fullMessage.Clear();
        }
    }
}

app.Run();
