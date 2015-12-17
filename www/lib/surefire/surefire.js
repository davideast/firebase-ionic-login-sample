var surefireModule = angular.module('surefire', []);
surefireModule.factory('surefireFactory', function ($q) {
    var deferredCheck = function (deferred, error, success) {
        if (error) {
            deferred.reject(error);
        }
        else {
            deferred.resolve(success);
        }
    };
    var deferredAction = function (options) {
        var deferred = $q.defer();
        switch (options.name) {
            case "set":
                options.ref.set(options.obj, function (error) {
                    deferredCheck(deferred, error, true);
                });
                break;
            case "update":
                options.ref.update(options.obj, function (error) {
                    deferredCheck(deferred, error, true);
                });
                break;
            case "remove":
                options.ref.remove(function (error) {
                    deferredCheck(deferred, error, true);
                });
                break;
            case "once":
                options.ref.once('value', function (value) {
                    deferredCheck(deferred, null, value);
                }, function (error) {
                    deferredCheck(deferred, error, null);
                });
                break;
            default:
                deferred.reject(new Error('Invalid method name: Only set, update, remove, and once are allowed.'));
                break;
        }
        return deferred.promise;
    };
    var surefireFactory = {
        deferredCheck: deferredCheck,
        deferredAction: deferredAction
    };
});
surefireModule.factory('surefire', function (surefireFactory) {
    return function (mainRef) {
        var publicAPI = {
            set: function (obj) {
                return surefireFactory.deferredAction({
                    ref: mainRef,
                    name: 'set',
                    obj: obj
                });
            },
            update: function (obj) {
                return surefireFactory.deferredAction({
                    ref: mainRef,
                    name: 'update',
                    obj: obj
                });
            },
            remove: function () {
                return surefireFactory.deferredAction({
                    ref: mainRef,
                    name: 'remove'
                });
            },
            once: function () {
                return surefireFactory.deferredAction({
                    ref: mainRef,
                    name: 'once'
                });
            }
        };
        return publicAPI;
    };
});
