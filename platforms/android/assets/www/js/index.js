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
    $scope.closeApp = function() {

    };
});

smartMediBoxApp.controller('DrugsCtrl', function($scope) {
    $scope.getBarcodeFromImage = function() {
        cordova.plugins.barcodeScanner.scan(
            function(result) {
                /*alert("We got a barcode\n" +
                    "Result: " + result.text + "\n" +
                    "Format: " + result.format + "\n" +
                    "Cancelled: " + result.cancelled);*/
                $scope.barCodeResult = result.text;
                $("#barcode").val(result.text);
            },
            function(error) {
                alert("Scanning failed: " + error);
            }
        );
    }

    $scope.addMedoc = function() {
        code = $("#barcode").val();
        //Stock
        var stock;
        if (localStorage.stock != undefined)
            stock = JSON.parse(localStorage.stock);
        else
            stock = new Object();

        var medoc_info;
        //Le medoc existe ?
        if (stock[code] != undefined) {
            stock[code].quantity += 1;
            localStorage.stock = JSON.stringify(stock);
            $("#result").css("color", "green");
            $("#result").text(stock[code].info.name + " Ajouté !");
            return;
        } else {
            $("#sub").attr("disabled", "true");
            //On cherche sur la bdd
            $.get("http://vuesubjective.org/htmllearn/workspace/sante/index.php?code=" + code,
                function(data) {
                    medoc_info = data;
                    if (medoc_info == undefined || medoc_info.error != undefined) {
                        if (medoc_info.error == undefined)
                            medoc_info.error = "No code";
                        $("#result").css("color", "red");
                        $("#result").text("Error : " + medoc_info.error);
                    } else {
                        stock[code] = new Object();
                        stock[code].quantity = 1;
                        stock[code].info = medoc_info;
                        $("#result").css("color", "green");
                        $("#result").text(stock[code].info.name + " nouvellement ajouté !");
                        localStorage.stock = JSON.stringify(stock);
                    }
                    $("#sub").removeAttr("disabled");
                });
        }
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

    $scope.selectDrug = function(medoc){
        /*alert(medoc.info.name);*/
    };
});

smartMediBoxApp.controller('TasksCtrl', function($scope) {
    if (localStorage.stock != undefined)
        $scope.medocs = JSON.parse(localStorage.stock);
    if (localStorage.planning != undefined)
        $scope.tasks = JSON.parse(localStorage.planning);
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
