// Ionic kelaa24 app

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'kelaa24' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'kelaa24.controllers' is found in controllers.js
angular.module('kelaa24', ['ionic', 'kelaa24.controllers'])

.run(function($ionicPlatform, $ionicPopup) {

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    // Check for network connection
    if(window.Connection) {
      console.log(navigator.connection.type);
      if( navigator.connection.type == window.Connection.NONE ) {
        alert('Sorry, no Internet connectivity detected. Please reconnect and try again.');
        ionic.Platform.exitApp();
      }
    }


  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('kelaa', {
      url: "/kelaa",
      abstract: true,
      templateUrl: "templates/menu.html",
      controller: 'MainCtrl'
    })

    .state('kelaa.categories', {
      url: "/categories",
      views: {
        'menuContent' :{
          templateUrl: "templates/categories.html",
          controller: 'categoriesCtrl'
        }
      }
    })

    .state('kelaa.pagesalat', {
      url: "/pagesalat",
      views: {
        'menuContent' :{
          templateUrl: "templates/pagesalat.html" 
        }
      }
    })

    .state('kelaa.contact', {
      url: "/contact",
      views: {
        'menuContent' :{
          templateUrl: "templates/contact.html" 
        }
      }
    }) 

    .state('kelaa.category', {
      url: "/categories/:categoryId",
      controller: "categoryCtrl",
      views: {
        'menuContent' :{
          templateUrl: "templates/category.html",
          controller: 'categoryCtrl'
        }
      }
    })

    .state('kelaa.search', {
      url: "/search/:query",
      controller: "SearchCtrl",
      views: {
        'menuContent' :{
          templateUrl: "templates/search.html",
          controller: 'SearchCtrl'
        }
      }
    })


    .state('kelaa.post', {
      url: "/categories/posts/:postId",
      controller: "PostCtrl",
      views: {
        'menuContent' :{
          templateUrl: "templates/post.html",
          controller: 'PostCtrl'
        }
      }
    });

  $urlRouterProvider.otherwise('/kelaa/categories');
});

