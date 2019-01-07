angular.module('app').directive('showtab',
    function () {
        return {
            link: function (scope, element, attrs) {
                element.click(function (e) {
                    e.preventDefault();
                    $(element).tab('show');
                });
            }
        };
    });


angular.module('app').directive('customOnChange', function () {
    return {
        require: "ngModel",
        restrict: 'A',
        link: function (scope, element, attrs, ngModel) {           
            var onChangeFunc = scope.$eval(attrs.customOnChange);
            element.bind('change', function (event) {
                ngModel.$setViewValue(event.target.files[0]);
                scope.$apply();
            });

        }
    };
});

angular.module('app').directive("fileModel", function () {
    return {
        restrict: 'EA',
        scope: {
            setFileData: "&"
        },
        link: function (scope, ele, attrs) {
            ele.on('change', function () {
                scope.$apply(function () {
                    var val = ele[0].files[0];
                    scope.setFileData({ value: val });
                });
            });
        }
    }
})