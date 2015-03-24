(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory;
    } else {
        root.request = factory(root);
    }
})(this, function (root) {

    'use strict';

    var exports = {},
        utils = {},
        $Q = null,
        xhr;

    utils.parse = function(req){
        var result;
        try {
            result = JSON.parse(req.responseText);
        } catch (e) {
            result = req.responseText;
        }
        return [result, req];
    };

    utils.toQuery = function(q){
        var key,
            params = [];
        for(key in q){
            params.push(key+'='+q[key]);
        }
        return params.join('&');
    };

    utils.verifyQuery = function(url,query){
        var result = {},
            parameter = null;
        for(parameter in query){
            if(!(new RegExp('[?|&]'+parameter+'=')).test(url)){
                result[parameter] = query[parameter];
            }
        }
        return result;
    };

    utils.validateHTTPStatus = function(code){
        var result = false;
        code = parseInt(code);
        /*
        200 OK
        201 Created
        202 Accepted
        203 Non-Authoritative Information (since HTTP/1.1)
        204 No Content
        205 Reset Content
        206 Partial Content
        207 Multi-Status (WebDAV; RFC 4918)
        208 Already Reported (WebDAV; RFC 5842)
        226 IM Used (RFC 3229)
         */
        if(code >= 200 && code <230){
            result = true;
        }
        return result;
    };

    utils.Q = function(Q){
        if(Q) $Q = Q;
        return $Q;
    };

    xhr = function(method, url, data, query){
        var methods = {
                success: function(){},
                error: function(){},
                always: function(){}
            },
            request = null,
            callbacks = {},
            defer = null,
            protocol = (window.location.protocol === 'file:') ? 'https:' : window.location.protocol;

        if($Q){
            defer = $Q.defer();
            methods.success = function(data){
                defer.resolve(data);
            };
            methods.error = function(error){
                defer.reject(error);
            };
        }

        if(method === 'GET'){
            query = utils.verifyQuery(url,query);
        }

        if(window.XDomainRequest){
            request = new XDomainRequest();
            request.onprogress = function(){ };
            request.ontimeout = function(){ };
        }else if(window.ActiveXObject){
            request = new ActiveXObject('Microsoft.XMLHTTP');
        }else if(window.XMLHttpRequest){
            request = new XMLHttpRequest();
        }

        if(request){
            if(query) url += ((url.indexOf('?') > -1) ? '&' : '?') + utils.toQuery(query);
            request.open(method, (url.indexOf('http') > -1) ? url : protocol+url, true);
            request.onload = function(){
                if(utils.validateHTTPStatus(request.status) || request.statusText === 'OK' || typeof request.statusText === 'undefined'){
                    methods.success.apply(request, utils.parse(request));
                } else {
                    methods.error.apply(request, utils.parse(request));
                }
                methods.always.apply(request, []);
            };
            request.onerror = function(e){
                methods.error.apply(request, [e]);
                methods.always.apply(request, []);
            };
            if(method === 'POST'){
                if(!window.XDomainRequest){
                    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                }
                data = utils.toQuery(data);
            }
            if(method === 'GET'){
                data = null;
            }
            if($Q){
                request.send(data);
            }else{
                setTimeout(function(){
                    request.send(data);
                },0);
            }
        }

        callbacks = {
            success: function(callback){
                methods.success = callback;
                return callbacks;
            },
            error: function(callback){
                methods.error = callback;
                return callbacks;
            },
            always: function(callback){
                methods.always = callback;
                return callbacks;
            }
        };

        return $Q ? defer.promise : callbacks;
    };

    /*jshint -W069 */
    exports['get'] = function (url, query) {
        return xhr('GET', url, {}, query);
    };

    exports['put'] = function (url, data, query) {
        return xhr('PUT', url, data, query);
    };

    exports['post'] = function (url, data, query) {
        return xhr('POST', url, data, query);
    };
    /*jshint +W069 */

    exports['delete'] = function (url, query) {
        return xhr('DELETE', url, {}, query);
    };

    exports['Q'] = function(Q){
        return utils.Q(Q);
    };

    return exports;
});
