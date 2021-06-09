const utilsModule = require("tns-core-modules/utils/utils");
const appSettings = require("tns-core-modules/application-settings");
const snackBarModule = require("@nstudio/nativescript-snackbar").SnackBar;
const snackbar = new snackBarModule();

const GlobalModel = require("../global-model");
const globalHelper = require("../global-helper");

var API = new GlobalModel([]);
var context, framePage; 

exports.onLoaded = function(args) {
    framePage = args.object.frame;

    /* 
        Universal Links : https://wa.me/
        Custom URL Scheme : whatsapp://

        More information you can open link below :
        https://faq.whatsapp.com/iphone/how-to-link-to-whatsapp-from-a-different-app/?lang=en    
    */
    if(appSettings.hasKey("HAS_SETUP")){
        context.set("setup", true);
        __contextSetCountryData();
    } else {
        context.set("setup", false);
    }

    appSettings.setString("CONFIG_URL", "whatsapp://send?phone=");
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
        snackbar.action({
            actionText: "OKE",
            actionTextColor: '#FFEB3B',
            snackText: "FORMAT NUMBER IS NOT VALID!",
            textColor: '#FFFFFF',
            hideDelay: 5000,
            backgroundColor: '#333',
            maxLines: 15, // Optional, Android Only
            isRTL: false
        });
    }
};

exports.infoTap = function(){
    framePage.navigate({
        moduleName: "info/info-page",
        animated: true,
        transition: { name: "fade" }
    });
};

exports.setup = function(){
    framePage.navigate({
        moduleName: "setup/setup-page",
        animated: true,
        transition: { name: "fade" }
    });
};

function __contextSetCountryData(){
    const countryData = JSON.parse(appSettings.getString("CONFIG_COUNTRY_CODE_DATA"));
    context.set("configDialCode", countryData.dial_code);
    context.set("configFlag", countryData.flag);
    context.set("hint_text", "Whatsapp Number (" + countryData.dial_code + ")");
}