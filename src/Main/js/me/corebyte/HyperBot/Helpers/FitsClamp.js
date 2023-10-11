const Clamp = Import("me.corebyte.HyperBot.Helpers.Clamp")

module.exports = function(Min, Max, Value) {
    return Clamp(Min, Max, Value) == Value
}