
myApp.controller('testController',['$scope','$http',function($scope,$http){
console.log("hello from testController");
//new address object i will need to concatnate into address form
$scope.newAddress = {

};

$scope.stringAddress = '';

$scope.objectToString = function(object){
  console.log("within objectToString",$scope.stringAddress)
  $scope.stringAddress += (object.street+", "+object.city+", "+object.state+", "+object.zip)
  console.log('objectToString response', $scope.stringAddress);
};



$scope.submitAddress = function(){
 $scope.objectToString($scope.newAddress);
 var string = $scope.stringAddress
 var address = {address:string};
 console.log('our address object is',address);
//This is our only post that will invoke two post requests 
  $http.post('/test', address)
    .then(function(data){
    console.log('POST /test', data)
    $scope.stringAddress = '';
    $scope.newAddress = {};
    });
};

}]);
