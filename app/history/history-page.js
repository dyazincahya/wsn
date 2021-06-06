const utilsModule = require("tns-core-modules/utils/utils");
const appSettings = require("tns-core-modules/application-settings");
const ObservableArray = require("tns-core-modules/data/observable-array").ObservableArray;
const globalModel = require("../global-model");
const globalHelper = require("../global-helper");

const dataHistory = new ObservableArray([]);
var API = new globalModel([]);
var context; 

exports.onLoaded = function() {
	__loadData();
};

exports.onNavigatingTo = function(args) {
	const page = args.object; 

	context = API;

	page.bindingContext = context;
};

exports.clearTap = function(){
    confirm({
        title: "Clear data history",
        message: "Are you sure you want to do this?",
        okButtonText: "Yes",
        neutralButtonText: "No"
    }).then((result) => {
        if(result) {
            globalHelper.drop();
            __loadData();
            alert("Successfully cleared history data :)");
        }
    });
}; 

exports.refreshTap = function(){
	__loadData();
};

exports.onItemTap = (args) => {
    let itemTap = args.view;
    let itemTapData = itemTap.bindingContext;

    const fullUrl = appSettings.getString("CONFIG_URL") + itemTapData.phone; 
	utilsModule.openUrl(fullUrl);
};

function __loadData(){
	const DB = globalHelper.get();
	dataHistory.splice(0);
	if(DB.success)
	{
		const data = DB.data;
		if(data.length > 0)
		{
			for (let i = 0; i < data.length; i++) {
				dataHistory.push({
					phone: data[i].phone,
					datetime: data[i].datetime
				});
            }
			context.set("items", dataHistory);
		} else
		{
			context.set("items", false);
		}
	} else 
	{
		context.set("items", false);
	}
}