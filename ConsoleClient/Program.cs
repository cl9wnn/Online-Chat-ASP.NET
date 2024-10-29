using System.Net.WebSockets;
using System.Text;

var ws = new ClientWebSocket();

string userName;

while (true)
{
    Console.Write("Input your name: ");
    userName = Console.ReadLine();
    userName = string.IsNullOrWhiteSpace(userName) ? "anonim" : userName;
    break;
}

Console.WriteLine("Connecting to server...\n");
await ws.ConnectAsync(new Uri($"ws://localhost:5241/ws?name={userName}"), CancellationToken.None);
Console.WriteLine("Connected!\n To leave chat write \"exit\"\n");

var receiveTask = Task.Run(async () =>
{
    var buffer = new byte[1024*4];
    while (true)
    {
        var result = await ws.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);

        if (result.MessageType == WebSocketMessageType.Close)
        {
            break;
        }
        var message = Encoding.UTF8.GetString(buffer, 0, result.Count);
        Console.WriteLine($"{message}");
    }
});

var sendTask = Task.Run(async () =>
{
    while (true)
    {
        var message = Console.ReadLine();
        message = string.IsNullOrWhiteSpace(message) ? "Empty message" : message;

        if (message == "exit")
        {
            break;
        }

        var buffer = Encoding.UTF8.GetBytes(message);
        await ws.SendAsync(new ArraySegment<byte>(buffer), WebSocketMessageType.Text, true, CancellationToken.None);
    }

});

await sendTask;

if (ws.State == WebSocketState.Open)
{
    await ws.CloseAsync(WebSocketCloseStatus.NormalClosure, "closing", CancellationToken.None);
}

Console.WriteLine("You have exited the chat. Press any key to close the console...");
Console.ReadKey();