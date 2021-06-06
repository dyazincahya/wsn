const utilsModule = require("tns-core-modules/utils/utils");
const appSettings = require("tns-core-modules/application-settings");
const GlobalModel = require("../global-model");
const globalHelper = require("../global-helper");

var API = new GlobalModel([]);
var context, framePage; 

exports.onLoaded = function(args) {
    framePage = args.object.frame;

	appSettings.setString("CONFIG_URL", "https://wa.me/");
	appSettings.setString("CONFIG_COUNTRY_CODE", "62");
};

exports.onNavigatingTo = function(args) {
	const page = args.object; 

	context = API;

	page.bindingContext = context;
};

exports.openApps = function(){
    const vNum = globalHelper.validatePhoneNumber(context.phone_number);
    if(globalHelper.invalidPhoneNumber(vNum)){

        const fullUrl = appSettings.getString("CONFIG_URL") + vNum;
        utilsModule.openUrl(fullUrl);
        globalHelper.insert({
            phone: vNum,
            datetime: globalHelper.getCurrentTime()
        });
        
        context.set("phone_number", "");
    }
    else {
        alert("Format number is not Valid!!!");
    }
};

exports.infoTap = function(){
    framePage.navigate({
        moduleName: "info/info-page",
        animated: true,
        transition: { name: "fade" }
    });
};