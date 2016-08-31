// This service is made for the background only
app.service('ControlService', function($rootScope, $http){
    // This urlt represents the API URL
    var apiURL = "http://eexam.herokuapp.com/api/";

    this.postOnline = function(){
      $http.post(apiURL + "isOnline", [{"course_of_study": $rootScope.course_of_study,"course": $rootScope.course ,"email": $rootScope.email}])
      .success(function(data){
       
      })
      .error(function(data){
       
      });
    }

});