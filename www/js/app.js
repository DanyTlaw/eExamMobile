// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic','ngCordova'])

.run(function($ionicPlatform, $cordovaNetwork, $rootScope, $http, ControlService, FileService) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
 
      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);

      // Initialize the bluetooth plugin
      cordova.plugins.BluetoothStatus.initPlugin();
      // Enable background mode while checking online status
      cordova.plugins.backgroundMode.setDefaults({ text: 'Em background.'});
      cordova.plugins.backgroundMode.enable();

        alert(cordova.plugins.backgroundMode.isEnabled());
      
      // Called when background mode is activated
      cordova.plugins.backgroundMode.onactivate = function(){
        console.log("BACKGROUND MOD ACTIVATED");
        setTimeout(function(){
          cordova.plugins.backgroundMode.configure({
            text: 'Running app in the Background'
          });
        }, 5000)
        // If the User goes online when in Backgroundmode
        var apiURL = "http://eexam.herokuapp.com/api/";

        if($cordovaNetwork.isOnline()){
          ControlService.postOnline();
          FileService.writeInet("is Online");
        }

        if($cordovaNetwork.isOffline()){
          FileService.writeInet("is Offline");
        }
        
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
      }

    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

