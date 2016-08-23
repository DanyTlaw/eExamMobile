/*
    This controlles has all Functionalty needed for this application.
    Since there is only one real View one Controller is ok.
    
    $scope is handles the scope for the view
    $cordovaNetwork is used for Online and Offline Events
    FileService is a service that handle all the logic with the File

 */
app.controller("MainController", function($scope, $rootScope, $cordovaNetwork, FileService, $http, $ionicPopup){
  document.addEventListener('deviceready', function(){
    var info_write = false;
    //init variables
    $scope.courseOfStudy = "";
    $scope.course = "";
    $scope.email= "";

    $scope.disableReady = true;
    $scope.disableUpload = true;

    $scope.saveData = function(data){
      $scope.courseOfStudy = data.courseOfStudy;
      $scope.course = data.course;
      $scope.email = data.email;

      // After the information is saved we can enable the button ready send
      $scope.disableReady = false;
    }



    $scope.checkEnc = function(){
      // using encyrption with this https://github.com/mdp/gibberish-aes
      enc = GibberishAES.enc("This sentence is super secret", "ultra-strong-password");
      alert(enc);
      dec = GibberishAES.dec(enc, "ultra-strong-password");
      alert(dec);
    }
    
    // Popup function to get an extra confirmation on the upload
    $scope.uploadPopup = function(){
      // Options for the Popup
      var uploadPp = $ionicPopup.confirm({
          title: "Upload Logfile",
          template: "Are you sure to upload your Logfile?" 
      });

      uploadPp.then(function(res){
        if(res){
          upload();
          alert("File uploaded");
        } else {
          //nothing
          alert("File not uploaded");
        }
      });
    };

    // Popup function to get an extra confirmation for the ready signal
    $scope.readyPopup = function(){
      // Options for the Popup
      var readyPp = $ionicPopup.confirm({
        title: "Ready signal send",
        template: "Did you checked your Information? You wanna send the signal that your ready?"
      });

      readyPp.then(function(res){
        if(res){
          ready();
          alert("Ready Signal send");
        } else{
          alert("Then change your Information and try again");
        }
      });
    };

    // Function that handles everything at the start (send ready signal, creat file, write infos in file)
    function ready(){
      console.log("ReadyFunc start");
      // The name of the Logfile is set together with the informations and should look like this
      // name / modul / course of study
      // daniel.herzogSWE2WI.txt
      // First we have to split the email from daniel.herzog@students.fhnw.ch to -> daniel.herzog 
      var splitEmail = $scope.email.split("@");
      // Puts the logfile name together
      var logfileName = splitEmail[0] + $scope.course + $scope.courseOfStudy + ".txt";
      // Creates a file with the name 
      FileService.createLogFile(logfileName);
      
      // Timer for getting the Key first
      setTimeout(function () {
            FileService.writeInformations($scope.courseOfStudy, $scope.course, $scope.email);
            // Enable the Upload button
            $scope.disableUpload = false;
      }, 6000);    
     
      // Sends the ready signal
      postReady();
      }
    
    function upload(){
      FileService.upload($scope.courseOfStudy,$scope.course,$scope.email);
    }


    /* 
      Checks Online and Offline Events
    */

        // Checks for Online event
    $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
        var onlineState = networkState;
        // Writes Online in the file
        FileService.writeOnline();
        // Send a Post call that the user is Online
        postOnline();

    })

    // Checks for Offline event
    $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
        var offlineState = networkState;
        
        FileService.writeOffline();

    })


    /*
      Post calls
     */

    var apiURL = "http://10.0.3.2:3000/api/"

    function postOnline(){
      $http.post(apiURL + "isOnline", [{"course_of_study": $scope.course_of_study,"course": $scope.course ,"email": $scope.email}])
      .success(function(data){
        alert("sucess");
      })
      .error(function(data){
        alert("failure");
      });
    }
    // Function for sending the ready signal to the server
    function postReady(){
      // Sends a JSON file with the informations
      $http.post(apiURL + "setReady", [{"course_of_study": $scope.course_of_study,"course": $scope.course ,"email": $scope.email}])
      .success(function(data){
        alert("Ready set");
        alert(data);
      })
      .error(function(data){
        alert("Ready not set");
      });
    }



  });
});