function ajaxCall(ajaxType, postData, route) {
    var result = null;

    var url = getRootUrl();

    url = url + "api/" + route;

    return ajaxCallFromUrl(ajaxType, postData, url);
}

function ajaxCallFromUrl(ajaxType, postData, url) {
    var result = null;
    $.ajax({
        url: url,
        method: ajaxType,
        dataType: "json",
        data: JSON.stringify(postData),
        traditional: true,
        async: false,
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            if (data != null)
                result = data;
        },
        error: function (data) {
            console.log(data.statusText);
            if (data.statusText == "Unauthorized" && url.indexOf("login") == -1) {
                redirectToLogin();
            }
            else if (data.status == 400) // Bad Request
            {
                if (data.responseJSON != null && data.responseJSON.Message != null)
                    alert(data.responseJSON.Message);
            }
        }
    });

    return result;
}

function asyncAjaxCall(ajaxType, postData, route, callback, extraOptions) {
    var url = getRootUrl();

    url = url + "/api/" + route;

    return asyncAjaxCallFromUrl(ajaxType, postData, url, callback, extraOptions);
}

function asyncAjaxCallFromUrl(ajaxType, postData, url, callbackFunc, extraOptions) {
    $.ajax({
        url: url,
        method: ajaxType,
        dataType: "json",
        data: JSON.stringify(postData),
        traditional: true,
        async: true,
        contentType: "application/json; charset=utf-8",
        complete: function (e) {
            callbackFunc(e, extraOptions);
        },
        error: function (data) {
            console.log(data.statusText);
            if (data.statusText == "Unauthorized" && url.indexOf("login") == -1) {
                redirectToLogin();
            }
            else if (data.status == 400) // Bad Request
            {
                if (data.responseJSON != null && data.responseJSON.Message != null)
                    alert(data.responseJSON.Message);
            }
        }
    });
}

function getRootUrl() {
    var url = location.protocol + '//' + location.host;
    var virtualName = location.pathname;
    var indexOfAppName = virtualName.indexOf("/", 1); // bypass the first "/"

    if (indexOfAppName != -1) {
        virtualName = virtualName.substring(0, indexOfAppName + 1);
    }

    url = url + virtualName;

    var end = url.indexOf(".html") + 4;
    if (end > 0) {
        var begin = url.lastIndexOf("/", end);
        if (begin > 0) {
            var subString = url.slice(begin + 1, end + 1);
            //console.log(subString);
            url = url.replace(subString, "");
        }
    }

    //console.log(url);
    return url.toLowerCase();
}
