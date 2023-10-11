const Websocket = require("ws").WebSocket
const WaitFor = require("p-event")
const FetchJson = Import("me.corebyte.HyperBot.Helpers.FetchJson")

class ConsoleWatcher {
    constructor(Host, ServerId, APIKey, MessageHandler) {
        this.Host = Host
        this.ServerId = ServerId
        this.APIKey = APIKey
        this.MessageHandler = MessageHandler

        TypeWriter.Logger.Information(`Initializing ConsoleWatcher for ${this.Host}...`)
    }

    async GetConnectionData() {
        const Data = await FetchJson(
            `https://${this.Host}/api/client/servers/${this.ServerId}/websocket`,
            {
                Authorization: `Bearer ${this.APIKey}`,
            }
        )
        return Data.data
    }

    async Connect() {
        const Url = (await this.GetConnectionData()).socket
        const Connection = new Websocket(
            Url,
            {
                headers: {
                    Origin: `https://${this.Host}`
                }
            }
        )

        await WaitFor(Connection, "open")
        TypeWriter.Logger.Information("Connected to websocket")
        this.Connection = Connection
        await this.HandleEvents()
        await this.Authorize()

    }

    async Authorize() {
        if (!this.Connection) {
            TypeWriter.Logger.Error("Cannot authorize without a connection")
            return
        }
        const Token = (await this.GetConnectionData()).token
        await this.SendEvent("auth", Token)
        TypeWriter.Logger.Information("Authorized")
    }

    async SendEvent(EventName, Data) {
        if (typeof Data != "object") {
            Data = [Data]
        }
        this.Connection.send(
            JSON.stringify(
                {
                    event: EventName,
                    args: Data
                }
            )
        )
    }
    
    async HandleEvents() {
        if (!this.Connection) {
            TypeWriter.Logger.Error("Cannot handle events without a connection")
            return
        }
        this.Connection.on(
            "message",
            (Data) => {
                const Event = JSON.parse(Data.toString())
                if (Event.event == "console output") {
                    this.MessageHandler(Event.args[0])
                } else if (Event.event == "token expiring") {
                    this.Authorize()
                }
            }
        )
    }

}

module.exports = ConsoleWatcher