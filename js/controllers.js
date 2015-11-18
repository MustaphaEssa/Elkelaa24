angular.module('kelaa24.controllers', ['ionic', 'ngCordova'])

.factory('Kelaa24App', function ($http, $q, $cacheFactory, $ionicLoading) {
    var _host = ( window.location.host == 'localhost' )? 'elkelaa24.com' : 'elkelaa24.com';
    var apiBaseURL = 'http://'+_host+'/kelaa24Api/api.php?action=';
    var pages = [];

    return {
        getCachedPromise: function(params, loading){
          var apiURL = apiBaseURL + params;
          var $httpDefaultCache = $cacheFactory.get('$http');
          var deferred = $q.defer();
          var data = $httpDefaultCache.get(apiURL);
          if (!data) {
              if( loading == true ){
                $ionicLoading.show({
                  content: 'Loading',
                  template: '<i class="loader ion-loading-b"></i>',
                  animation: 'fade-in',
                  showBackdrop: true,
                  maxWidth: 200,
                  showDelay: 0
                });
              }
              $http.get(apiURL,{
                cache : true
              }).then(function(result){
                  deferred.resolve(result);
                  if( loading == true ){
                    $ionicLoading.hide();
                  }
              });
          } else {
              //console.log(JSON.parse(data[1]))
              deferred.resolve(JSON.parse(data[1]));
          }
          return deferred.promise;
          
        },
        getCategories: function () {
          return this.getCachedPromise('getCategories', true);
        },
        getCategory: function (mid, pid, loading, tag) {
          //console.log(pages[mid])
          return this.getCachedPromise('getCategory&categoryid='+mid+'&pageid='+pid, loading);
        },
        search: function (tag, pid) {
          //console.log(pages[mid])
          return this.getCachedPromise('search&tag='+ encodeURI(tag)+'&pageid='+pid, true);
        },
        getPost: function(rid){
          return this.getCachedPromise('getPost&pid='+rid, true);
        },
        getMaxPages: function(mid){
          var deferred = $q.defer(),
              max = 0;
          $http.get(apiBaseURL+'maxpage&categoryid='+mid).then(function(res){
            deferred.resolve(res);
          })
          return deferred.promise;
        }
    }

})

.controller('SearchFromCtrl', function($scope, $state) {
    $scope.doSearch = function(){
      $scope.master = {};
      $state.go('kelaa24.search', { query: $scope.searchposts.query });
      $scope.searchModal.hide();
      $scope.searchposts = angular.copy($scope.master);
      //$location.path('#/eats/search/'+$scope.searchposts.query);
    }
})


.controller('SearchCtrl', function($scope, Kelaa24App, $stateParams) {
  category = Kelaa24App.search($stateParams.query, 0);
  category.then(function(res){
    if( res.data ){
      _res = res.data;
    }else{
      _res = res;
    }
    $scope.posts = _res;
  });
})
 

.controller('MainCtrl', function($scope, $ionicModal, $timeout, Kelaa24App, $stateParams, $cordovaSocialSharing) {
  // Form data for the login modal
  //$scope.contactData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/modals/contact.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.contactModal = modal;
  });

  $ionicModal.fromTemplateUrl('templates/modals/search.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.searchModal = modal;
  });
  categories = Kelaa24App.getCategories(true);
  //console.log(categories);
  
  categories.then(function(res){
    if( res.data ){
      _res = res.data;
    }else{
      _res = res;
    }
    $scope.categories = _res;
    //console.log(_res)
  }); 

  // Triggered in the login modal to close it
  $scope.contactClose = function() {
    $scope.contactModal.hide();
  };

  $scope.rateClose = function() {
    $scope.rateModal.hide();
  };

  $scope.searchClose = function() {
    $scope.searchModal.hide();
  };

  // Open the login modal
  $scope.contact = function() {
    $scope.contactModal.show();
    return false;
  };

  $scope.search = function() {
    $scope.searchModal.show();
    return false;
  };
 
  // Perform the login action when the user submits the login form
  $scope.doContact = function() {
    //console.log('Doing login', $scope.contactData);
    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeContact();
    }, 1000);
  };
 
    $scope.shareAnywhere = function() {
        $cordovaSocialSharing.share("This is your message", "This is your subject", "www/imagefile.png", "http://blog.nraboy.com");
    }
 
    $scope.shareViaTwitter = function(message, image, link) {
        $cordovaSocialSharing.canShareVia("twitter", message, image, link).then(function(result) {
            $cordovaSocialSharing.shareViaTwitter(message, image, link);
        }, function(error) {
            alert("Cannot share on Twitter");
        });
    }
})
//, $ionicLoading
.controller('categoriesCtrl', function($scope, Kelaa24App, $stateParams, $http) {
  var _host = ( window.location.host == 'localhost' )? 'elkelaa24.com' : 'elkelaa24.com';
  var apiBaseURL = 'http://'+_host+'/kelaa24Api/api.php?action=';
  var categoryMaxPagesCall = Kelaa24App.getMaxPages('');
  var currentpage = 1;

  //console.log(categoryMaxPagesCall)
  categoryMaxPagesCall.then(function(resp){
    var categoryMaxPages = resp.data.max;
    $scope.moredata = false;
    $scope.loadMore = function() {
      currentpage = currentpage+1;
      if( currentpage <= categoryMaxPages ){
        moreItems = Kelaa24App.getCategory($stateParams.categoryId, currentpage, false);
        moreItems.then(function(res){
          if( res.data ){
            _res = res.data;
          }else{
            _res = res;
          }
          //console.log(_res)
          $scope.posts = $scope.posts.concat(_res);
          $scope.$broadcast('scroll.infiniteScrollComplete');
        });
      }else{
        $scope.moredata = true;
      }
    };  
    $scope.$on('$stateChangeSuccess', function() {
      $scope.loadMore();
    });
  })


  category = Kelaa24App.getCategory($stateParams.categoryId, 0, true);
  category.then(function(res){
    if( res.data ){
      _res = res.data;
      //console.log(_res)
    }else{
      _res = res;
    }
    $scope.posts = _res;
  });
})

.controller('categoryCtrl', function($scope, Kelaa24App, $stateParams, $http) {
  var _host = ( window.location.host == 'localhost' )? 'elkelaa24.com' : 'elkelaa24.com';
  var apiBaseURL = 'http://'+_host+'/kelaa24Api/api.php?action=';
  var categoryMaxPagesCall = Kelaa24App.getMaxPages($stateParams.categoryId);
  var currentpage = 1;

  //console.log(categoryMaxPagesCall)
  categoryMaxPagesCall.then(function(resp){
    var categoryMaxPages = resp.data.max;
    $scope.moredata = false;

    $scope.loadMore = function() {
      currentpage = currentpage+1;
      if( currentpage <= categoryMaxPages ){
        moreItems = Kelaa24App.getCategory($stateParams.categoryId, currentpage, false);
        moreItems.then(function(res){
          if( res.data ){
            _res = res.data;
          }else{
            _res = res;
          }
          //console.log(_res)
          $scope.posts = $scope.posts.concat(_res);
          $scope.$broadcast('scroll.infiniteScrollComplete');
        });
      }else{
        $scope.moredata = true;
      }
    };  
    $scope.$on('$stateChangeSuccess', function() {
      $scope.loadMore();
    });
  })


  category = Kelaa24App.getCategory($stateParams.categoryId, 0, true);
  category.then(function(res){
    if( res.data ){
      _res = res.data;
      //console.log(_res)
    }else{
      _res = res;
    }
    $scope.posts = _res;
  });
})

.controller('PostCtrl', function($scope, Kelaa24App, $stateParams) {
  post = Kelaa24App.getPost($stateParams.postId);
  post.then(function(res){
    if( res.data ){
      _res = res.data;
      //console.log(_res)
    }else{
      _res = res;
    }
    //$scope.posts = _res;
    $scope.id = _res.id;
    $scope.title = _res.title;
    $scope.content = _res.content;
    $scope.author = _res.author; 
    $scope.link = _res.link; 
  });
  //var postData = res.data;
}); 