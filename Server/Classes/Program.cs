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
        using var ws = await context.WebSockets.AcceptWebSocketAsync();

        connections.Add(ws);

        var currentName = context.Request.Query["name"];
        var currentGuid = context.Request.Query["guid"];

        var userInfo = new User(currentGuid, currentName);

        await Broadcast(new JoinMessage(userInfo));
        await BroadcastConnectionCount(connections.Count());

        await RecieveMessage(ws, async (result, buffer) =>
        {
            if (result.MessageType == WebSocketMessageType.Text)
            {
                string message = Encoding.UTF8.GetString(buffer, 0, result.Count);
                await Broadcast(new UserMessage(userInfo, message));
            }
            else if (result.MessageType == WebSocketMessageType.Close || ws.State == WebSocketState.Aborted)
            {
                connections.Remove(ws);
                await Broadcast(new LeaveMessage(userInfo));
                await BroadcastConnectionCount(connections.Count());
                await ws.CloseAsync(result.CloseStatus.Value, result.CloseStatusDescription, CancellationToken.None);
            }
        });
    }
    else
    {
        context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
    }
});

async Task Broadcast(Message message)
{
    var jsonMessage = JsonSerializer.Serialize(message);

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
async Task BroadcastConnectionCount(int connectionCount)
{
    foreach (var connection in connections)
    {
        if (connection.State == WebSocketState.Open)
        {
            var countMessage = Encoding.UTF8.GetBytes(connectionCount.ToString());
            var arraySegment = new ArraySegment<byte>(countMessage);

            await connection.SendAsync(arraySegment, WebSocketMessageType.Text, true, CancellationToken.None);
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
