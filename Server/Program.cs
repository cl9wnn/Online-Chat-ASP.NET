using System.Net;
using System.Net.WebSockets;
using System.Text;


var builder = WebApplication.CreateBuilder(args);
builder.WebHost.UseUrls("http://localhost:5241");
var app = builder.Build();
app.UseWebSockets();

var connections = new List<WebSocket>();

app.MapGet("/ws", async context =>
{
    if (context.WebSockets.IsWebSocketRequest)
    {
        var currentName = context.Request.Query["name"];
        using var ws = await context.WebSockets.AcceptWebSocketAsync();
        connections.Add(ws);

        await Broadcast($"{currentName} joined the room");
        await Broadcast($"{connections.Count} users connected");

        await RecieveMessage(ws, async (result, buffer) =>
        {
            if (result.MessageType == WebSocketMessageType.Text)
            {
                string message = Encoding.UTF8.GetString(buffer);
                await Broadcast($"{currentName}: {message}");
            }
            else if (result.MessageType == WebSocketMessageType.Close || ws.State == WebSocketState.Aborted)
            {
                connections.Remove(ws);
                await Broadcast($"{currentName} lefted room");
                await Broadcast($"{connections.Count} users connected");
                await ws.CloseAsync(result.CloseStatus.Value, result.CloseStatusDescription, CancellationToken.None);
            }
        });
    }
    else
    {
        context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
    }
});

async Task Broadcast(string message)
{
    var bytes = Encoding.UTF8.GetBytes(message);

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
