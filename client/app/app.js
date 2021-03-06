angular.module('RBKme', [
  'RBKme.services',
  'RBKme.blog',
  'RBKme.newBlog',
  'RBKme.Msg',
  'RBKme.newMsg',
  'RBKme.msgHistory',
  'RBKme.profileView',
  'RBKme.profileEdit',
  'RBKme.home',
  'RBKme.auth',
  'RBKme.admin',
  'RBKme.chat',
  'RBKme.chatroom',
  'ngRoute',
  'ngMaterial',
  'ngAnimate',
  'jkAngularRatingStars'
])
.config(function ($routeProvider, $httpProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'app/home/home.html',
      controller: 'HomeController'
    })
    .when('/blogs', {
      templateUrl: 'app/blog/blog.html',
      controller: 'BlogController'
    })
    .when('/admin', {
      templateUrl: 'app/admin/admin.html',
      controller: 'adminController'
    })
    .when('/messages', {
      templateUrl: 'app/messages/messages.html',
      controller: 'MsgController'
    })
    .when('/chat', {
      templateUrl: 'app/socketIO/chat.html',
      controller: 'chatController'
    })
    .when('/chatroom', {
      templateUrl: 'app/chatroom/chatroom.html',
      controller: 'chatroomController',
    })
    .otherwise({
      redirectTo: '/'
    });
    
    // We add our $httpInterceptor into the array
    // of interceptors. Think of it like middleware for your ajax calls
    $httpProvider.interceptors.push('AttachTokens');
})
.controller('mainCtrl', function ($scope, $mdDialog, $mdMedia, Auth, Dialogs,$window) {
  
  // a flag to switch between signin and signout buttons
  if(!window.localStorage.getItem('username'))
    $scope.loggedIN = false;
  else
    $scope.loggedIN = true;

  $scope.signin = function(ev) {
    // for more info about the parameters we're passing here
    // check the documentation in the showDialog function
    // in the Dialogs factory in the services.js file
    Dialogs.showDialog($scope,$mdDialog,$mdMedia,
      'AuthController','app/auth/signin.html',ev,
      {},function(answer){
        if(answer){
       // $scope.loggedIN = true;
      $scope.loggedIN=true;
     console.log($window.localStorage.getItem('com.RBKme'));
        console.log('Successful Login');
        }
      },function(){
        $scope.status = 'You cancelled the dialog.';
      });
  };

  $scope.signout = function () {
    Auth.signout();
    $scope.loggedIN = false;
  };

})
.factory('AttachTokens', function ($window) {
  // this is an $httpInterceptor
  // its job is to stop all out going request
  // then look in local storage and find the user's token
  // then add it to the header so the server can validate the request
  var attach = {
    request: function (object) {
      var jwt = $window.localStorage.getItem('com.RBKme');
      if (jwt) {
        object.headers['x-access-token'] = jwt;
      }
      object.headers['Allow-Control-Allow-Origin'] = '*';
      return object;
    }
  };
  return attach;
})
.run(function ($rootScope, $location, Auth) {
  // here inside the run phase of angular, our services and controllers
  // have just been registered and our app is ready
  // however, we want to make sure the user is authorized
  // we listen for when angular is trying to change routes
  // when it does change routes, we then look for the token in localstorage
  // and send that token to the server to see if it is a real user or hasn't expired
  // if it's not valid, we then redirect back to homePage
  $rootScope.$on('$routeChangeStart', function (evt, next, current) {
    if (next.$$route && next.$$route.authenticate && !Auth.isAuth()) {
      $location.path('/');
    }
  });
});