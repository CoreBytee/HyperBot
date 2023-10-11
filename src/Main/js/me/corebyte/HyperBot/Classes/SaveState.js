const FitsClamp = Import("me.corebyte.HyperBot.Helpers.FitsClamp")

class SaveState {
    constructor(SaveInterval, States, StateChange) {
        this.SaveInterval = SaveInterval
        this.StateChange = StateChange
        this.States = []

        const StateTimes = Object.values(States)
        let Index = 0
        for (const StateTime of StateTimes) {
            const NextStateTime = StateTimes[Index + 1] || -9999
            this.States.push(
                {
                    State: Object.keys(States)[Index],
                    Max: StateTime,
                    Min: NextStateTime
                }
            )

            Index++
        }

        this.NextSave = -1

        setInterval(
            () => {
                const TimeLeft = this.GetTimeLeft()
                console.log(`Time left: ${TimeLeft} ${this.GetState()}`)
            },
            1000
        )
    }

    ResetCounter() {
        this.NextSave = Date.now() / 1000 + this.SaveInterval
    }

    GetTimeLeft() {
        return Math.floor(this.NextSave - Date.now() / 1000)
    }

    GetState() {
        const TimeLeft = this.GetTimeLeft()
        for (const State of this.States) {
            console.log(State)
            if (FitsClamp(State.Min, State.Max, TimeLeft)) {
                return State.State
            }
        }
    }
}

module.exports = SaveState