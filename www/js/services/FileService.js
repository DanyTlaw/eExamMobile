/* 
    This Service handles the File writing Logic and the Upload Logic to the Webapplikation
    The Upload Logic could also be done in a seperate service.

    $cordovaFile handles the Filesystem calls
    $cordovaFileTransfer handles the upload call
*/

app.service('FileService', function($cordovaFile, $cordovaFileTransfer, $http){
    // Encryption Password (webapplikation has the same for decryption)
    var encPassword = "";
    // Variables for writing
    var onlineText = "Online";
    var offlineText = "Offline";
    var bluetoothActivate = "Bluetooth avtivated";
    var bluetoothDeactivate = "Bluetooth deactivated";
    var filename = "";

    // Variables to upload
    var targetPath = "";
    var trustHosts = true;
    var options = {};
    // Saves the basic url of the api
    var apiURL = "http://10.0.3.2:3000/api/";

    // This Function Handling the File upload
    this.upload = function(course_of_study, course, email){
        // Describe the option to upload
        var options = {
            fileKey: "logfile",
            fileName: filename,
            chunkedMode: false,
            mimeType: "text/plain",
            params: {"course_of_study": course_of_study,"course": course ,"email": email}
        };
        var targetPath = cordova.file.dataDirectory + filename;
        alert(targetPath);

        //Before uploading we want to say that we upload
        var text = GibberishAES.enc("Send File", encPassword) + "|";
        writeFile(filename, text);
        // uploads the file after we wrote the text in the file


        setTimeout(function () {
             uploadFile(apiURL + "logfile", targetPath, options);
        }, 6000);    
        
    }
    // This function handles the upload to the server
    function uploadFile(server, filePath, options){
        $cordovaFileTransfer.upload(server, filePath, options)
      .then(function(result) {
        alert("Logfile was send succesfuly");
      }, function(err) {
        console.log("Logfile problem");
      }, function (progress) {
        // constant progress updates
      });
    }
    // Function for calculate the time with the momentjs libary
    function calcTime(){
        // Using moment.js for date -> momentjs.com
        // Get the date unconverted
        var date = moment().format('MMMM Do YYYY, h:mm:ss a');
        return date;
    }

    // This function handles the writing for the file
    function writeFile(filename, text){

        $cordovaFile.writeExistingFile(cordova.file.dataDirectory, filename, text)
            .then(function (success) {
                // if the writing is done we can return a success callback can be used for debugging
                console.log(success);
            }, function (error) {
                console.log(error);
            }
        );
    }
    // Function for creating the file
    function createFile(logFilename){
        filename = logFilename;
        $cordovaFile.createFile(cordova.file.dataDirectory, filename, true)
            .then(function (success) {
                console.log(success);
            }, function (error) {
                console.log(error);
            }
        );
    }

    // This Function returns true if the file already exist and false if not // Not used in the app but maybe for later use
    function checkFile(filename){
        $cordovaFile.checkFile(cordova.file.dataDirectory, filename)
            .then(function (success) {
                console.log(success);
            }, function (error) {
                console.log(error);
            });
    }


    // For the Creation of the Logfile we need the enc key first then we can create the File and then write the informations

    this.createLogFile = function(file){
        // Before creating the Logfile we want the encryption key and save it in the variable
        getKey();    
        createFile(file);
        
        
    }

    // This function returns the available disk space and is for the Cordova FILE API test
    this.diskSpace = function(){
      $cordovaFile.getFreeDiskSpace()
          .then(function (success) {
            // success in kilobytes
            alert(success);
          }, function (error) {
            alert(error);
          });
    }
    /*
        Different Functions to write the correct text in the file
    */

    // Function to write the information in the file
    this.writeInformations = function(courseOfStudy, course, email){
        // save the current time
        var time = calcTime();
        // encrypts the time correctly
        var encTime = GibberishAES.enc(time, encPassword);
        // Creating text, wrote one line per file to represent the text better
        var courseOfStudyText =" Studiengang: " + courseOfStudy;
        var courseText = " Modul: " + course;


        var studentText = " Emailadresse: " + email;
        // Encrypts every line one by one so we can iterate over the lines on the server and decrypt
        var text = encTime +"|" + GibberishAES.enc(courseOfStudyText, encPassword) +"|" + GibberishAES.enc(courseText, encPassword) +"|"+ GibberishAES.enc(studentText, encPassword)+"|";
        // writes the text in the file
        writeFile(filename, text);


    }

    // Function to write the online status
    this.writeOnline = function(){
        // Get the converted Time
        var time = calcTime();
        var enctime = GibberishAES.enc(time, encPassword);
        // Create the correct string to save in File the | is needed for encryption logic on the server
        var text = enctime + "|" + GibberishAES.enc("Online", encPassword) + "|";
        alert(filename);
        writeFile(filename, text);

    }

    // Function to write the offline status
    this.writeOffline = function(){
        // Get the converted Time
        var time = calcTime();
        var enctime = GibberishAES.enc(time, encPassword);
        // Create the correct string to save in File the | is needed for encryption logic on the server
        var text = enctime + "|" + GibberishAES.enc("Offline", encPassword)+ "|";
        alert(filename);
        writeFile(filename, text);
    }

    
    // this function gets the key for encryption
    function getKey(){
      $http.get(apiURL + "enc")
        .success(function(data){
            encPassword = data.key;
        })
        .error(function(data){

        });
    }


});