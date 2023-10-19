const FS = require("fs-extra")

const SaveStateClass = Import("me.corebyte.HyperBot.Classes.SaveState")
const ConsoleWatcherClass = Import("me.corebyte.HyperBot.Classes.ConsoleWatcher")
const WebhookManagerClass = Import("me.corebyte.HyperBot.Classes.WebhookManager")

console.log("Hello js world")

const StateImages = {
    Safe: "https://github.com/CoreBytee/HyperBot/blob/main/Images/green.png?raw=true",
    Warning: "https://github.com/CoreBytee/HyperBot/blob/main/Images/yellow.png?raw=true",
    Dangerous: "https://github.com/CoreBytee/HyperBot/blob/main/Images/red.png?raw=true"
}

async function Main() {
    const SaveMessage = await FS.readFileSync("./Config/SaveMessage").toString()
    const ConsoleWatcher = new ConsoleWatcherClass(
        FS.readFileSync("./Config/Host").toString(),
        FS.readFileSync("./Config/ServerId").toString(),
        FS.readFileSync("./Config/Key").toString(),
        async function(Line) {
            if (Line.includes(SaveMessage) == false) { return }
            TypeWriter.Logger.Information("Looks like the server is saving, resetting counter")
            await SaveState.ResetCounter()
        }
    )

    await ConsoleWatcher.Connect()

    const WebhookManager = new WebhookManagerClass(
        FS.readFileSync("./Config/WebhookURL").toString(),
        Import("me.corebyte.HyperBot.Embed")
    )
    await WebhookManager.EnsureLastMessage()

    const SaveInterval = Number(FS.readFileSync("./Config/SaveInterval").toString())
    const SaveState = new SaveStateClass(
        SaveInterval,
        {
            "Safe" : Infinity,
            "Warning": 3*60,
            "Dangerous": 1*60
        },
        function(NewState, NextSave) {
            TypeWriter.Logger.Information(`State changed to ${NewState}`)

            WebhookManager.Update(
                function(Template) {
                    Template.title = `Current state: ${NewState}`
                    Template.timestamp = NextSave.toISOString()
                    Template.thumbnail.url = StateImages[NewState]
                    return Template
                }
            )
        }
    )

    SaveState.ResetCounter()
}

Main()