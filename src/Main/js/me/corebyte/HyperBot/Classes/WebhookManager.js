const FS = require("fs-extra")
const FetchJson = Import("me.corebyte.HyperBot.Helpers.FetchJson")
const Fetch = require("node-fetch")

class WebhookManager {
    constructor(HookUrl, Template) {
        this.HookUrl = HookUrl
        this.Template = Template
        FS.ensureFileSync("./Config/LastMessage")
        this.LastMessage = FS.readFileSync("./Config/LastMessage").toString()
    }

    async EnsureLastMessage() {
        if (await this.CheckLastMessage() == false) { await this.SendNewMessage() }
    }

    async Update(UpdateFunction) {
        const Embed = UpdateFunction(this.Template)

        await Fetch(
            `${this.HookUrl}/messages/${this.LastMessage}`,
            {
                headers: {
                    "Content-Type": "application/json"
                },
                method: "PATCH",
                body: JSON.stringify(
                    {
                        content: "",
                        embeds: [Embed]
                    }
                )
            }
        )
    }

    async CheckLastMessage() {
        if (this.LastMessage == "") { return false }

        const MessageData = await FetchJson(
            `${this.HookUrl}/messages/${this.LastMessage}`
        )

        return MessageData.code == undefined
    }

    async SendNewMessage() {
        const Response = await Fetch(
            this.HookUrl + "?wait=true",
            {
                method: "POST",
                body: JSON.stringify(
                    {
                        content: "Loading..."
                    }
                ),
                headers: {
                    "Content-Type": "application/json"
                }
            }
        )

        const ResponseJson = await Response.json()
        this.LastMessage = ResponseJson.id
        this.SaveLastMessage()
    }

    SaveLastMessage(MessageId) {
        this.LastMessage = MessageId || this.LastMessage
        FS.writeFileSync("./Config/LastMessage", this.LastMessage)
    }
}

module.exports = WebhookManager