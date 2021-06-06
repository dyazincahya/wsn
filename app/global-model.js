const ObservableArray = require("tns-core-modules/data/observable-array").ObservableArray;
const httpModule = require("tns-core-modules/http");

function GlobalModel(items) {
    var xyz = new ObservableArray(items);

    return xyz;
}

module.exports = GlobalModel;