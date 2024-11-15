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

        await SendMessage(new JoinMessage(userInfo));
        await SendMessage(connections.Count());

        await RecieveMessage(ws, async (result, buffer) =>
        {
            if (result.MessageType == WebSocketMessageType.Text)
            {
                string message = Encoding.UTF8.GetString(buffer, 0, result.Count);
                await SendMessage(new UserMessage(userInfo, message));
            }
            else if (result.MessageType == WebSocketMessageType.Binary)
            {
                var imageData = new byte[result.Count];
                Array.Copy(buffer, imageData, result.Count);

                //деление на пакеты и пометка последнего пакета 
                await SendMessage(new ImageMessage(userInfo, imageData, isLastChunk:true));

            }
            else if (result.MessageType == WebSocketMessageType.Close || ws.State == WebSocketState.Aborted)
            {
                connections.Remove(ws);
                await SendMessage(new LeaveMessage(userInfo));
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
    var buffer = new byte[1024 * 48];
    while (socket.State == WebSocketState.Open)
    {
        var result = await socket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
        handleMessage(result, buffer);
    }
}

app.Run();
