/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var smartMediBoxApp = angular.module('SmartMediBoxApp', ['ngRoute']);

smartMediBoxApp.config(function($routeProvider) {
    $routeProvider.when("/stock", {
        templateUrl: "views/stock.html"
    }).
    when("/planning", {
        templateUrl: "views/planning.html"
    }).
    when("/addDrugs", {
        templateUrl: "views/addDrugs.html"
    }).
    when("/addTask", {
        templateUrl: "views/addTask.html"
    }).
    when("/param", {
        templateUrl: "views/param.html"
    }).
    otherwise({
        redirectTo: '/stock'
    });
});

smartMediBoxApp.controller('NavCtrl', function($scope) {
    $scope.closeApp = function(){
    };
});

smartMediBoxApp.controller('StockCtrl', function($scope) {
    $scope.medocs = JSON.parse(window.localStorage.getItem("stock"));

    $scope.takeDrugs = function(index) {
        var stock = JSON.parse(localStorage.stock);
        var sortedKeys = Object.keys(stock).sort();
        stock[sortedKeys[index]].quantity -= 1;
        if (stock[sortedKeys[index]].quantity == 0) {
            delete stock[sortedKeys[index]];
        }
        $scope.medocs = stock;
        localStorage.stock = JSON.stringify(stock);
    };
});

smartMediBoxApp.controller('TasksCtrl', function($scope) {
    $scope.medocs = JSON.parse(localStorage.stock);
    $scope.tasks = JSON.parse(localStorage.planning);
    $("#test").append('<div> reponse : ' + localStorage.stock + '</div>')
    $scope.addTask = function() {
        var planning;
        if (localStorage.planning != undefined) {
            planning = JSON.parse(localStorage.planning);
        } else {
            planning = new Object();
        }
        if ($scope.leMedoc != undefined) {
            planning[$scope.leMedoc] = {
                name: $scope.leMedoc
            }
        };
        localStorage.planning = JSON.stringify(planning);
        window.location.href = "#planning";
    };
    $scope.deleteTask = function(index) {
        var planning = JSON.parse(localStorage.planning);
        var sortedKeys = Object.keys(planning).sort();
        delete planning[sortedKeys[index]];
        $scope.tasks = planning;
        localStorage.planning = JSON.stringify(planning);
    }
});

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        window.addEventListener('orientationchange', this.handleOrientation, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },

    handleOrientation: function() {
        if (orientation == 0) {
            //portraitMode, do your stuff here
        } else if (orientation == 90) {
            //landscapeMode
        } else if (orientation == -90) {
            //landscapeMode
        } else if (orientation == 180) {
            //portraitMode
        } else {}
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};
