module.exports = function(Min, Max, Value) {
    return Math.min(Math.max(Value, Min), Max)
}