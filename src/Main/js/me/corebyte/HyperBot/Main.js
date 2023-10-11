const FS = require("fs-extra")

const SaveStateClass = Import("me.corebyte.HyperBot.Classes.SaveState")
const ConsoleWatcherClass = Import("me.corebyte.HyperBot.Classes.ConsoleWatcher")

console.log("Hello js world")

async function Main() {
    const ConsoleWatcher = new ConsoleWatcherClass(
        FS.readFileSync("./Config/Host").toString(),
        FS.readFileSync("./Config/ServerId").toString(),
        FS.readFileSync("./Config/Key").toString(),
        async function(Line) {
            // console.log(Line)
        }
    )

    await ConsoleWatcher.Connect()

    const SaveInterval = Number(FS.readFileSync("./Config/SaveInterval").toString())
    const SaveState = new SaveStateClass(
        10,// SaveInterval,
        {
            "Safe" : Infinity,
            "Warning": 3,//3*60,
            "Dangerous": 2,//1*60
        },
        function(NewState) {
            console.log(`State changed to ${NewState}`)
        }
    )

    SaveState.ResetCounter()
}

Main()