const appSettings = require("tns-core-modules/application-settings");
const GlobalModel = require("../global-model");
const globalHelper = require("../global-helper");

var API = new GlobalModel([]);
var context, framePage; 

exports.onLoaded = function(args) {
    framePage = args.object.frame;   
	appSettings.setString("CONFIG_URL", "whatsapp://send?phone=");
};

exports.onNavigatingTo = function(args) {
	const page = args.object; 

	context = API;

    context.set("items", globalHelper.countryList());

	page.bindingContext = context;
};

exports.onItemTap = (args) => {
    let itemTap = args.view;
    let itemTapData = itemTap.bindingContext;

    confirm({
        title: "Set " + itemTapData.dial_code + " as Default Dial Code",
        message: "Are you sure you want to select [" + itemTapData.name.toUpperCase() + "] as default country?",
        okButtonText: "Yes",
        neutralButtonText: "No"
    }).then((result) => {
        if(result) { 
            appSettings.setString("CONFIG_COUNTRY_CODE", itemTapData.dial_code.substring(1));
            appSettings.setString("CONFIG_COUNTRY_CODE_DATA", JSON.stringify(itemTapData));
            appSettings.setBoolean("HAS_SETUP", true);

            framePage.navigate({
                moduleName: "home/home-page",
                animated: true,
                clearHistory: true,
                transition: {
                    name: "fade"
                }
            });
        }
    });
};

exports.home = function(){
    framePage.navigate({
        moduleName: "home/home-page",
        animated: true,
        clearHistory: true,
        transition: {
            name: "fade"
        }
    });
};