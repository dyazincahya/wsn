const appSettings = require("tns-core-modules/application-settings");

function multiDimensionalUnique(arr) {
    var uniques = [];
    var itemsFound = {};
    for(var i = 0, l = arr.length; i < l; i++) {
        var stringified = JSON.stringify(arr[i]);
        if(itemsFound[stringified]) { continue; }
        uniques.push(arr[i]);
        itemsFound[stringified] = true;
    }
    return uniques;
}

exports.get = function(index=null, distinct=false, xkey="lsakc"){
    if(!appSettings.hasKey(xkey)){
        return {
            "success"   : false,
            "message"   : "Data not found!",
            "data"      : []
        };
    } else {
        const arrData = JSON.parse(appSettings.getString(xkey));
        if(index == null){
            if(arrData.length != 0){                
                if(distinct){
                    return {
                        "success"   : true,
                        "message"   : "Data found.",
                        "data"      : multiDimensionalUnique(arrData)
                    };
                } else {
                    return {
                        "success"   : true,
                        "message"   : "Data found.",
                        "data"      : arrData
                    };
                }
            } else {
                return {
                    "success"   : false,
                    "message"   : "Data not found!",
                    "data"      : []
                };
            }
        } else {
            if ( tmpdata[index] !== void 0 ) {
                if(distinct){
                    return {
                        "success"   : true,
                        "message"   : "Data found.",
                        "data"      : multiDimensionalUnique(arrData)[index]
                    };
                } else {
                    return {
                        "success"   : true,
                        "message"   : "Data found.",
                        "data"      : arrData[index]
                    };
                }
            } else {
                return {
                    "success"   : false,
                    "message"   : "Index not found!",
                    "data"      : []
                };
            }
        }        
    }
};
 
exports.insert = function(data=[], xkey="lsakc"){
    if(data.length == 0 || Object.keys(data).length == 0){
        return {
            "success"   : false,
            "message"   : "Data is null!",
            "data"      : data
        };
    } else {
        if(!appSettings.hasKey(xkey)){
            let tmp = [];
            tmp.push(data);
            appSettings.setString(xkey, JSON.stringify(tmp));

            return {
                "success"   : true,
                "message"   : "Data has been inserted!",
                "data"      : data
            };
        } else {
            if(Array.isArray(data)){
                let extractdata = JSON.parse(appSettings.getString(xkey));

                let ma = data.concat(extractdata);
                appSettings.remove(xkey);            
                appSettings.setString(xkey, JSON.stringify(ma)); 
            } else {
                let tmpdata = [];
                let extractdata = JSON.parse(appSettings.getString(xkey));
                tmpdata.push(data);

                let ma = tmpdata.concat(extractdata);
                appSettings.remove(xkey);            
                appSettings.setString(xkey, JSON.stringify(ma));   
            }

            return {
                "success"   : true,
                "message"   : "Data has been inserted.",
                "data"      : data
            };
        }
    }
};

exports.update = function(data=[], index=0, xkey="lsakc"){
    if(data.length == 0 || Object.keys(data).length == 0){
        return {
            "success"   : false,
            "message"   : "Data is null!",
            "data"      : data
        };
    } else {
        let tmpdata = [];
        let extractdata = JSON.parse(appSettings.getString(xkey));
        tmpdata.push(extractdata);

        if ( tmpdata[index] !== void 0 ) {
            delete tmpdata[index];

            let newdata = [];
            for (let i = 0; i < tmpdata.length; i++) {
                if(tmpdata[i] != undefined || tmpdata[i] != "undefined"){
                    newdata.push(tmpdata[i]);
                } else {
                    newdata.push(data);
                }           
            }

            appSettings.remove(xkey);
            appSettings.setString(xkey, JSON.stringify(newdata));
            
            return {
                "success"   : true,
                "message"   : "Data has been updated.",
                "data"      : data
            };
        } else {
            return {
                "success"   : false,
                "message"   : "Index not found!",
                "data"      : data
            };
        }
    }
};

exports.delete = function(index=0, xkey="lsakc"){
    if(!appSettings.hasKey(xkey)){
        return {
            "success" : false,
            "message" : "Database not found!"
        };
    } else {
        let tmpdata = [];
        let extractdata = JSON.parse(appSettings.getString(xkey));
        tmpdata.push(extractdata);

        if ( tmpdata[index] !== void 0 ) {
            delete tmpdata[index];
            
            let newdata = [];
            for (let i = 0; i < tmpdata.length; i++) {
                if(tmpdata[i] != undefined || tmpdata[i] != "undefined"){
                    newdata.push(tmpdata[i]);
                }            
            }
            
            appSettings.remove(xkey);
            appSettings.setString(xkey, JSON.stringify(newdata));

            return {
                "success" : true,
                "message" : "Data has been deleted."
            };
        } else {
            return {
                "success" : false,
                "message" : "Index not found!"
            };
        }
    }
};

exports.drop = function(xkey="lsakc"){
    if(!appSettings.hasKey(xkey)){
        return {
            "success" : false,
            "message" : "Storage not found!"
        };
    } else {
        appSettings.remove(xkey);
        
        return {
            "success" : true,
            "message" : "Storage has been dropped."
        };
    }
};


exports.getCurrentTime = function(){
    var d = new Date();

    var p = d.getFullYear(),
        q = d.getMonth()+1,
        r = d.getDate(),
        s = d.getHours(),
        t = d.getMinutes(),
        u = d.getSeconds();

    var months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"],
        monthName = months[d.getMonth()];

    var days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jum'at", "Sabtu"],
        dayName = days[d.getDay()];

    var result = dayName + ", " + r+"/"+monthName+"/"+p+" "+s+":"+t+":"+u;

    return result;
};

exports.validatePhoneNumber = function(num){
    const firstNumber = num.charAt(0);
    const removeFirstNumber = num.substring(1);
    if(firstNumber === "0")
    {
        return appSettings.getString("CONFIG_COUNTRY_CODE") + removeFirstNumber;
    } 
    else if(firstNumber === "+")
    {
        return removeFirstNumber;
    } 
    else 
    {
        return num;
    }
};

exports.invalidPhoneNumber = function(num){
    const rule1 = (num.indexOf(" ") != "-1") ? false : true;
    const rule2 = (num.indexOf("-") != "-1") ? false : true;
    const rule3 = (num.indexOf("+") != "-1") ? false : true;
    const rule4 = (num.charAt(0) == "0") ? false : true;

    if(rule1 && rule2 && rule3 && rule4)
    {
        return true;
    } 
    else
    {
        return false;
    }
}