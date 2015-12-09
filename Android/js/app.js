(function() {
    var app = angular.module("CotacaoPi", ['ngMaterial', 'ngTouch']);
    
    app.controller("CotacaoController", ['$scope', '$mdSidenav', '$http', function($scope, $mdSidenav, $http) {
        var cotCtlr = this;
        this.cotacoes = [];
        
        $scope.toggleSidenav = function(menuId) {
            $mdSidenav(menuId).toggle();
        };
        
        $http.get("data/data.json").success(function(data) {
            var rawData = $.grep(data.cotacoes, function(o, i){
                return o.type === "raw";
            });
            
            $(rawData).each(function(i, o) {
                $http.get(o.jsonAddress).success(function(dataRaw) {
                    var cot = {};
                    cot.name = o.name;
                    cot.text = o.text;
                    cot.valor = parseFloat(GetByString(dataRaw,o.jsonValuePath)).toFixed(2);
                    cot.type = o.type;
                    cot.img = o.img;
                    
                    cotCtlr.cotacoes.push(cot);
                    
                    var childs = $.grep(data.cotacoes, function(ocalc, icalc){
                        return (ocalc.type === "calculated" && ocalc.compareTo === cot.name);
                    });
                    $(childs).each(function(icalc, ocalc) {
                        var cotCalc = {};   
                        cotCalc.type = ocalc.type;
                        cotCalc.compareTo = ocalc.compareTo;
                        cotCalc.img = ocalc.img;
                        
                        if(ocalc.jsonAddress) {
                            $http.get(ocalc.jsonAddress).success(function(data) {
                                cotCalc.name = ocalc.name;
                                cotCalc.text = ocalc.text;
                                cotCalc.valor = parseFloat(cot.valor / GetByString(data,ocalc.jsonValuePath)).toFixed(2)

                                cotCtlr.cotacoes.push(cotCalc);
                            });
                        }
                        else {
                            cotCalc.name = ocalc.name;
                            cotCalc.text = ocalc.text;
                            cotCalc.valor = parseFloat(cot.valor / ocalc.value).toFixed(2);

                            cotCtlr.cotacoes.push(cotCalc);
                        }
                    });
                    
                });
            });       
        });
    }]);
    
    app.directive("cotacaoItem", function() {
        return {
            restrict: 'E',
            templateUrl: 'templates/template-cotacao.html'
        };
    });
    
    app.config( function($mdThemingProvider){
        // Configure a dark theme with primary foreground yellow
        $mdThemingProvider.theme('docs-dark', 'default')
            .primaryPalette('blue-grey')
            .dark();
    });
})();