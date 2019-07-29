var app = angular.module('app',['ngRoute', 'ui.bootstrap', 'ngMessages']).
config(['$routeProvider', function($routeProvider){
    $routeProvider.
    when('/main', {
        controller: 'appController',
        templateUrl: 'tmp/main.html'
    }).
    otherwise({
        redirectTo: '/main'
    });
}]);

app.controller('appController', function($scope, $uibModal){
    $scope.data = {};

    $scope.fetchData = function(){
        $scope.data = $scope.getUsers();
    };
    $scope.createUser = function () {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'modal',
            controller: 'createUser'
        });

        modalInstance.result.then(function () {
            $scope.getUsers();
        });

    };

    $scope.getUsers = function(){
        axios.get('api/users')
            .then(function (response) {
                $scope.data = response.data;
                $scope.$apply();
            })
            .catch(function (error) {
            });
    };

    $scope.updateUser = function(id){
        $scope.user = {};
        axios.get('api/users/'+id)
            .then(function (response) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'modal',
                    controller: 'updateUser',
                    resolve: {
                        data: function () {
                            return response.data;
                        }
                    }
                });

                modalInstance.result.then(function () {
                    $scope.getUsers();
                });
            })
            .catch(function (error) {
            });
    };

    $scope.deleteUser = function(id){
        axios.delete('api/users/'+id)
            .then(function (response) {
                $scope.getUsers();
            })
            .catch(function (error) {
                if (error.response) {
                    alert(JSON.stringify(error.response.data.message, null, 4));
                } else {
                    alert(error);
                }
            });
    };
});

app.controller('createUser', function ($scope, $uibModalInstance) {

    $scope.ls = 'Create New User';
    $scope.requiredPassword = 'required';
    $scope.showDeleteButton = false;
    $scope.save = function () {
        axios.post('api/users', {
                username: $scope.username,
                first_name: $scope.first_name,
                last_name: $scope.last_name,
                email: $scope.email,
                password: $scope.password,
                is_active: $scope.is_active
            })
            .then(function (response) {
                alert(JSON.stringify(response.data.message, null, 4));
            })
            .catch(function (error) {
                if (error.response) {
                    alert(JSON.stringify(error.response.data.message, null, 4));
                } else {
                    alert(error);
                }
            });
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
        $uibModalInstance.close();
    };
});

app.controller('updateUser', function ($scope, $uibModalInstance, data) {

    $scope.data = data;

    $scope.ls = 'Update User #' + data.username;
    $scope.username = data.username;
    $scope.first_name  = data.first_name;
    $scope.last_name = data.last_name;
    $scope.is_active = data.is_active;
    $scope.email = data.email;
    $scope.requiredPassword = '';
    $scope.showDeleteButton = true;

    $scope.save = function () {
        axios.put('api/users/' + data.id, {
            username: $scope.username,
            first_name: $scope.first_name,
            last_name: $scope.last_name,
            password: $scope.password,
            email: $scope.email,
            is_active: $scope.is_active
        })
            .then(function (response) {
            })
            .catch(function (error) {
                if (error.response) {
                    alert(JSON.stringify(error.response.data.message, null, 4));
                } else {
                    alert(error);
                }
            });
        $uibModalInstance.close();

    };

    $scope.deleteUser = function () {
        axios.delete('api/users/'+data.id)
        .then(function (response) {
            $scope.getUsers();
        })
        .catch(function (error) {
            if (error.response) {
                alert(JSON.stringify(error.response.data.message, null, 4));
            } else {
                alert(error);
            }
        });
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
        $uibModalInstance.close();
    };
});
