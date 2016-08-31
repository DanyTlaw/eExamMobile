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
    $rootScope.courseOfStudy = "";
    $rootScope.course = "";
    $rootScope.email= "";

    // Disable variables
    $scope.disableReady = true;
    $scope.disableUpload = true;

    $scope.editCourseOfStudy = false;
    $scope.editCourse = false;
    $scope.editEmail = false;

    $scope.saveData = function(data){
      $rootScope.courseOfStudy = data.courseOfStudy;
      $rootScope.course = data.course;
      $rootScope.email = data.email;

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
      var splitEmail = $rootScope.email.split("@");
      // Puts the logfile name together
      var logfileName = splitEmail[0] + $rootScope.course + $rootScope.courseOfStudy + ".txt";
      // Creates a file with the name 
      FileService.createLogFile(logfileName);
      
      // Timer for getting the Key first
      setTimeout(function () {
            FileService.writeInformations($rootScope.courseOfStudy, $rootScope.course, $rootScope.email);
            // Enable the Upload button 
            $scope.disableUpload = false;
      }, 6000);    
     
      // Sends the ready signal
      postReady();
      }
    
    function upload(){
      FileService.upload($rootScope.courseOfStudy, $rootScope.course, $rootScope.email);
    }

    /* 
      Checks Online and Offline Events
    */

    // Checks for Online event
    $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
        var onlineState = networkState;
        // Send a Post call that the user is Online
        postOnline();
        // Writes Online in the file
        FileService.writeInet("Online");  
    })

    // Checks for Offline event
    $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
        var offlineState = networkState;
        // Writes Offline in the file
        FileService.writeInet("Offline");
    })
    /*
      Bluetooth events
    */
  window.addEventListener('BluetoothStatus.enabled', function() {
      // write that the applikations bluetooth is enabled
      //alert('Bluetooth has been enabled');
      FileService.writeBluetooth("Bluetooth On");

  });

  window.addEventListener('BluetoothStatus.disabled', function() {
    // write that the applikations bluetooth is disabled
    //alert('Bluetooth has been disabled');
    FileService.writeBluetooth("Bluetooth Off");
  });
    /*
      Post calls
     */
    // This urlt represents the API URL
    
    var apiURL = "http://eexam.herokuapp.com/api/";
    function postOnline(){
      $http.post(apiURL + "isOnline", [{"course_of_study": $rootScope.course_of_study,"course": $rootScope.course ,"email": $rootScope.email}])
      .success(function(data){
       
      })
      .error(function(data){
       
      });
    }
    
    // Function for sending the ready signal to the server
    function postReady(){
      // Sends a JSON file with the informations
      $http.post(apiURL + "setReady", [{"course_of_study": $rootScope.course_of_study,"course": $rootScope.course ,"email": $rootScope.email}])
      .success(function(data){
        alert("Ready set");
        // If this is a success the student shouldnt be able to change the data
        $scope.editCourseOfStudy = true;
        $scope.editCourse = true;
        $scope.editEmail = true;

        $scope.disableReady = true;
      })
      .error(function(data){
        alert("Ready not set");
      });
    }
  });
});