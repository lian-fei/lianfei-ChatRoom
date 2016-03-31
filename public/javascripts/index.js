angular.module("todoModule", []);
angular.module("todoModule")
    .controller("todoCtrl", function ($scope,$http) {
        $scope.todos=[{_id:1,text:"baoma"},{_id:1,text:"benchi"}];
    })