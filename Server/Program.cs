using System.Net;
using System.Net.WebSockets;
using System.Text;
using System.Text.Json;


var builder = WebApplication.CreateBuilder(args);
builder.WebHost.UseUrls("http://localhost:5241");
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
        var currentName = context.Request.Query["name"];
        using var ws = await context.WebSockets.AcceptWebSocketAsync();
        connections.Add(ws);

        await Broadcast($"{currentName} joined the room", MessageType.join);

        await RecieveMessage(ws, async (result, buffer) =>
        {
            if (result.MessageType == WebSocketMessageType.Text)
            {
                string message = Encoding.UTF8.GetString(buffer, 0, result.Count);
                await Broadcast($"{currentName}: {message}", MessageType.user);
            }
            else if (result.MessageType == WebSocketMessageType.Close || ws.State == WebSocketState.Aborted)
            {
                connections.Remove(ws);
                await Broadcast($"{currentName} lefted room", MessageType.leave);
                await ws.CloseAsync(result.CloseStatus.Value, result.CloseStatusDescription, CancellationToken.None);
            }
        });
    }
    else
    {
        context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
    }
});

async Task Broadcast(string message, MessageType messageType)
{
    string timestamp = DateTime.Now.ToString("HH:mm");

    var messageObject = new
    {
        timestamp,
        text = message,
        messageType = messageType.ToString(),
    };
    var jsonMessage = JsonSerializer.Serialize(messageObject);

    var bytes = Encoding.UTF8.GetBytes(jsonMessage);

    foreach (var socket in connections)
    {
        if (socket.State == WebSocketState.Open)
        {
            var arraySegment = new ArraySegment<byte>(bytes);
            await socket.SendAsync(arraySegment, WebSocketMessageType.Text, true, CancellationToken.None);

        }
    }
}

async Task RecieveMessage(WebSocket socket, Action<WebSocketReceiveResult, byte[]> handleMessage)
{
    var buffer = new byte[1024 * 4];
    while (socket.State == WebSocketState.Open)
    {
        var result = await socket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
        handleMessage(result, buffer);
    }
}

app.Run();
