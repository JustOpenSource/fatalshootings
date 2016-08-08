module.exports = function(d) {
    d.state = !d.user.username ? false : {
        "options" : [{
            "title" : "Leave Current State",
            "value" : "current"
        }, {
            "title" : "Change to Pending",
            "value" : "pending"
        }, {
            "title" : "Change to Published",
            "value" : "published"
        }]
    }

    return d;
}