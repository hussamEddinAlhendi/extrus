angular.module('RBKme.services', [])

// Service for Users requests functions
.factory('Users', function ($http) {

  // function to get all the users from the database
  var getAll = function () {
    return $http({
      method: 'GET',
      url: '/api/users'
    })
    .then(function (resp) {
      return resp.data;
    });
  };

  // function to get a single user from the database
  var getOne = function (username) {
    return $http({
      method: 'GET',
      url: '/api/users/'+username
    })
    .then(function (resp) {
      return resp.data;
    });
  };

  // function to add a single user to the database
  var addOne = function (user) {
    return $http({
      method: 'POST',
      url: '/api/users',
      data: user
    })
    .then(function (resp) {
      return resp;
    });
  };

  // function to save the edited info on the profile
  var editProfile = function (user) {
  	return $http({
      method: 'POST',
      url: '/api/users/editProfile',
      data : user
    })
    .then(function (resp) {
      return resp;
    });
  }

  // function to edit the pairReflection for a single user
  var updatePair = function(user){
    return $http({
      method: 'POST', 
      url: '/api/users/pairReflect',
      data: user
    }).then(function(resp){
      return resp; 
    })
  }

  // function to delete a user
  var deleteOne = function(user){
    return $http({
      method : 'POST', 
      url : '/api/users/delete', 
      data : user
    })
  }

  return {
    getAll: getAll,
    getOne : getOne,
    addOne: addOne,
    editProfile: editProfile,
    updatePair : updatePair,
    deleteOne : deleteOne
  };
})

// Service for Blogs requests functions
.factory('Blogs', function ($http) {

  // function to get all blogs
  var getAll = function () {
    return $http({
      method: 'GET',
      url: '/api/blogs'
    })
    .then(function (resp) {
      return resp.data;
    });
  };

  // function to add a single blog
  var addOne = function (blog) {
    return $http({
      method: 'POST',
      url: '/api/blogs',
      data: blog
    })
    .then(function (resp) {
      return resp;
    });
  };

  // function to like the blog

  var like = function(blog){
    return $http({
      method: 'POST',
      url: '/api/blogs/like',
      data: blog
    })
    .then(function(resp){
      return resp;
    })
  };

  // function to add comments to the blog

  var comment = function(blog){
    return $http({
      method : 'POST',
      url : '/api/blogs/comment',
      data : blog
    })
    .then(function(resp){
      return resp;
    })
  };

  return {
    getAll: getAll,
    addOne: addOne,
    like: like,
    comment : comment
  };
})

.factory('Dialogs', function ($http) {
  // function to show the dialogs
  var showDialog = function($scope,$mdDialog,$mdMedia,controller,htmlTemplate,event,paramsObj,successCB,failureCB){

    // variable to make the pop-up get the max size always
    // in a way to look good for the user
    var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
    
    // calling $mdDialog.show to show a pop-up
    $mdDialog.show({
      controller: controller, // we pass here the handling of the pop-up to a specific controller
      templateUrl: htmlTemplate, // we pass here the html template that's gonna be displayed in the pop-up
      parent: angular.element(document.body), // we pass here the parent window so when we close the pop-up we get redirected back to the parent
      targetEvent: event,
      locals: paramsObj, // we pass here parameters if any to the controller
      clickOutsideToClose:true,
      fullscreen: useFullScreen
    })
    .then(function(answer) {
      // callback to be executed when we close the pop-up
      successCB(answer);

    }, function() {
      // callback to be executed in case of an error
      failureCB();
    });

    // keep watching the browser's size to make the pop-up responsive
    $scope.$watch(function() {
      return $mdMedia('xs') || $mdMedia('sm');
    }, function(wantsFullScreen) {
      $scope.customFullscreen = (wantsFullScreen === true);
    });

  };

  return {
    showDialog:showDialog
  };

})
.factory('Messages', function ($http) {

  // function to send a new message
  var sendMessage = function (msg) {
    return $http({
      method: 'POST',
      url: '/api/users/sendMessage',
      data: msg
    })
    .then(function (resp) {
      return resp;
    });
  };
  
  // function to get a list of the messaged friends for a specific user
  var getMessagedFriends = function (user) {
    return $http({
      method: 'POST',
      url: '/api/users/getUserMessagedFriends',
      data: user
    })
    .then(function (resp) {
      return resp.data;
    });
  };
  
  // function to get all messages between two users
  var getMessages = function (fromTo) {
    return $http({
      method: 'POST',
      url: '/api/users/getMessages',
      data: fromTo
    })
    .then(function (resp) {
      console.log(fromTo);
      return resp.data;
    });
  };

  return {
    sendMessage: sendMessage,
    getMessages: getMessages,
    getMessagedFriends: getMessagedFriends
  };
})
.factory('Auth', function ($http, $location, $window) {
  // Don't touch this Auth service!!!
  // it is responsible for authenticating our user
  // by exchanging the user's username and password
  // for a JWT from the server
  // that JWT is then stored in localStorage as 'com.shortly'
  // after you signin/signup open devtools, click resources,
  // then localStorage and you'll see your token from the server
  var signin = function (user) {
    return $http({
      method: 'POST',
      url: '/api/users/signin',
      data: user
    })
    .then(function (resp) {
      return resp.data;
    });
  };

  var isAuth = function () {
    return !!$window.localStorage.getItem('com.RBKme');
  };

  var signout = function () {
    $window.localStorage.removeItem('com.RBKme');
    $window.localStorage.removeItem('username');
    $location.path('/');
  };

  // function to reset the password when you forget your password or username
  var forgotPassword = function (obj) {
    return $http({
      method: 'POST',
      url: '/api/users/forget',
      data : obj
    })
    .then(function (resp) {
      return resp;
    });
  };

  return {
    signin: signin,
    isAuth: isAuth,
    forgotPassword: forgotPassword,
    signout: signout
  };
})

.factory('socket', function () {
    var chat = function () {
      var socket = io.connect()
      return socket;  
    }
    return {
      chat:chat
    }
})


.factory('Rooms', function ($http) {
  var addNewRoom = function (room) {
    return $http({
      method: 'POST',
      url: '/api/rooms',
      data: room
    })
    .then(function (resp) {
      return resp;
    });
  }
  var getMessages = function (clickedRoom) {
      return $http({
        method: 'GET',
        url: '/msg?room=' + clickedRoom
      })
      .then(function (resp) {
        return resp.data;
      });
  }
  return {
    addNewRoom: addNewRoom,
    getMessages: getMessages
  }
})


