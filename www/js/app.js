
angular.module('starter', ['ionic','starter.controllers','starter.services','ngCordova','ionic-timepicker','ngStorage','ngCordovaOauth','yaru22.angular-timeago'])

.run(function(BASE_URL,$ionicPlatform,$http,$ionicPopup,$state,localStorageService,$rootScope) {
  $ionicPlatform.ready(function() {
    
    FCMPlugin.getToken(
      function(token){
        console.log(token);
        if (token == null) {
        console.log("null token");
        setTimeout(token, 2000);
        }else{
          localStorageService.set('device_token',token);
          var currentPlatform = ionic.Platform.platform();
          console.log("update token on server");
          var u_token = localStorageService.get('customer_data');
          console.log(u_token);
          $http({
            method: 'POST',
            data: 'user_token=' + u_token.user_token + '&user_id=' + u_token.id + '&device_id=' + token + '&device_type=' + currentPlatform,
            url: BASE_URL+'update_profile',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
          }).success(function(response){
            console.log(response);
            if(response.status == false){
              console.log("false");
            }else{
              localStorageService.set('customer_data', response.data);
            }
          }).error(function(error){
            console.log(error);
          });
        }
      },
    function(err){
      console.log('error retrieving token: ' + err);
    }
  )
    FCMPlugin.onNotification(function(data){
      console.log(data);
      var u_token = localStorageService.get('customer_data');

      if(u_token.notification == 'y'){
      if(data.noti_type == "apply_job"){
        var confirmPopup = $ionicPopup.confirm({
          title: data.label,
          cssClass:'logout_popup',
          template: data.msg
        });
        confirmPopup.then(function(res) {
          if(res) {
            console.log('You are sure');
            $state.go('tab.home');
          }else {
            console.log('You are not sure');
          }
        })
      }else{
        console.log("err");
      }
    }else{
      console.log("off");
    }

     if(u_token.notification == 'y'){
      if(data.noti_type == "reject_job"){
        var confirmPopup = $ionicPopup.confirm({
          title: data.label,
          cssClass:'logout_popup',
          template: data.msg
        });
        confirmPopup.then(function(res) {
          if(res) {
            console.log('You are sure');
            $state.go('tab.home');
          }else {
            console.log('You are not sure');
          }
        })
      }else{
        console.log("err");
      }
    }else{
      console.log("off");
    }

     if(u_token.notification == 'y'){
      if(data.noti_type == "start_job"){
        var confirmPopup = $ionicPopup.confirm({
          title: data.label,
          cssClass:'logout_popup',
          template: data.msg
        });
        confirmPopup.then(function(res) {
          if(res) {
            console.log('You are sure');
            $state.go('tab.History');
          }else {
            console.log('You are not sure');
          }
        })
      }else{
        console.log("err");
      }
    }else{
      console.log("off");
    }

     if(u_token.notification == 'y'){
      if(data.noti_type == "end_job"){
        var confirmPopup = $ionicPopup.confirm({
          title: data.label,
          cssClass:'logout_popup',
          template: data.msg
        });
        confirmPopup.then(function(res) {
          if(res) {
            console.log('You are sure');
            $state.go('tab.History');
          }else {
            console.log('You are not sure');
          }
        })
      }else{
        console.log("err");
      }
    }else{
      console.log("off");
    }


     if(u_token.notification == 'y'){
      if(data.noti_type == "chat"){
        if($state.current.name !== "conversations"){
        var confirmPopup = $ionicPopup.confirm({
          title: data.label,
          cssClass:'logout_popup',
          template: data.msg
        });
        confirmPopup.then(function(res) {
          if(res) {
            console.log('You are sure');
            $rootScope.usreId = data.reciver_id;
            console.log($rootScope.usreId);
            $state.go('conversations');
          }else {
            console.log('You are not sure');
          }
        })
        $rootScope.chatConverCus();
      }else{
        console.log("off");
        $rootScope.chatConverCus();
      }
      }else{
        console.log("err");
      }
    }else{
      $rootScope.chatConverCus();

    }

    })

    if(window.Connection) {
      if(navigator.connection.type == Connection.NONE) {
        // swal("Sorry, no Internet connectivity detected. Please reconnect and try again.!")
        // swal("Sorry!", "no Internet connectivity detected. Please reconnect and try again.!")
        $ionicPopup.confirm({
          title: 'No Internet Connection',
          cssClass:'logout_popup',
          content: 'Sorry, no Internet connectivity detected. Please reconnect and try again.'
        })
        .then(function(result) {
          console.log(result);
          if(!result) {
            ionic.Platform.exitApp();
          }
        });
      }
    }

    if(window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

// App is basically related to events. There are two type of logins
// In this app client can add the job and service provider may apply the job . After apply the job client get notification to accept or reject the proposal. 
// Client can add any service provider to his wishlist and network. After add it may have option to chat, about the services and requirement.

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  $ionicConfigProvider.tabs.position('bottom');
  $stateProvider
  
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  .state('tab.account', {
    cache:false,
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'settingCtrl'
      }
    }
  })

  .state('login', {
    cache:false,
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })

  .state('signup', {
    cache:false,
    url: '/signup',
    templateUrl: 'templates/signup.html',
    controller: 'SignupCtrl'
  })
  
  .state('createprofile', {
    cache:false,
    url: '/createprofile',
    templateUrl: 'templates/createprofile.html',
    controller: 'CreateProfileCtrl'
  })

  .state('change_password', {
    cache:false,
    url: '/change_password',
    templateUrl: 'templates/change_password.html',
    controller: 'changePassCtrl'
  })

  .state('tab.home', {
    cache: false,
    url: '/home',
    views: {
      'tab-home': {
        templateUrl: 'templates/customer_home.html',
        controller: 'homeCustomerCtrl'
      }
    }
  })

  .state('tab.post_job', {
    cache: false,
    url: '/post_job',
    views: {
      'tab-post_job': {
        templateUrl: 'templates/post_job.html',
        controller: 'postJobCtrl'
      }
    }
  })

  .state('tab.History', {
    cache:false,
    url: '/History',
    views: {
      'tab-History': {
        templateUrl: 'templates/History.html',
        controller: 'historyAlljobsCtrl'
      }
    }
  })

  .state('tab.notifications', {
    cache:false,
    url: '/notifications',
    views: {
      'tab-notifications': {
        templateUrl: 'templates/notifications.html',
        controller: 'notificationCtrl'
      }
    }
  })

  .state('History_detail', {
    cache:false,
    url: '/History_detail',
    templateUrl: 'templates/History_detail.html',
    controller: 'historyjobsDetailsCtrl'
  })

  .state('history_detail_completed', {
    cache:false,
    url: '/history_detail_completed',
    templateUrl: 'templates/history_detail_completed.html',
    controller: 'historyjobsDetailsCompleteCtrl'
  })

  .state('job_detail', {
    cache:false,
    url: '/job_detail',
    templateUrl: 'templates/job_detail.html',
    controller: 'JobDetailHisCtrl'
  })

  .state('job_detail_completed', { 
    cache: false,
    url: '/job_detail_completed',
    templateUrl: 'templates/job_detail_completed.html',
    controller: 'JobDetailCompleted'
  })

  .state('profile', {
    cache: false,
    url: '/profile',
    templateUrl: 'templates/profile.html',
    controller: 'profileCtrl'
  })

  .state('conversations', {
    cache:false,
    url: '/conversations',
    templateUrl: 'templates/conversations.html',
    controller: 'ChatsCtrl'
  })

  .state('message', {
    cache:false,
    url: '/message',
    templateUrl: 'templates/message.html',
    controller: 'MessageCtrl'
  })

  .state('rating', {
    cache:false,
    url: '/rating',
    templateUrl: 'templates/rating.html',
    controller: 'RatingCtrl'
  })

  .state('reciept', {
    cache:false,
    url: '/reciept',
    templateUrl: 'templates/reciept.html',
    controller: 'recieptCtrl'
  })

  .state('payment_option', {
    cache:false,
    url: '/payment_option',
    templateUrl: 'templates/payment_option.html',
    controller: 'paymentCtrl'
  })

  .state('make_pay_add_card', {
    cache:false,
    url: '/make_pay_add_card',
    templateUrl: 'templates/make_pay_add_card.html',
    controller: 'makePayAddCardCtrl'
  })

  .state('new_card', {
    cache:false,
    url: '/new_card',
    templateUrl: 'templates/new_card.html',
    controller: 'newcardCtrl'
  })

  .state('edit_profile', {
    cache: false,
    url: '/edit_profile',
    templateUrl: 'templates/edit_profile.html',
    controller: 'editprofileCtrl'
  })

  .state('job_detail_customer', {
    cache : false,
    url: '/job_detail_customer',
    templateUrl: 'templates/job_detail_customer.html',
    controller: 'JobDetailCustomer'
  })

  .state('job_applicants', {
    cache : false,
    url: '/job_applicants',
    templateUrl: 'templates/job_applicants.html',
    controller: 'JobApplicants'
  })

  .state('other_profile', {
    cache:false,
    url: '/other_profile',
    templateUrl: 'templates/other_profile.html',
    controller: 'otherProfileCtrl'
  })

  .state('review', {
    cache:false,
    url: '/review',
    templateUrl: 'templates/review.html',
    controller: 'reviewProfileCtrl'
  })

  .state('forgot_password', {
    cache:false,
    url: '/forgot_password',
    templateUrl: 'templates/forgot_password.html',
    controller: 'forgotPasswordCtrl'
  });

  // .state('conversations', {
  //     url: '/conversations',
  //     templateUrl: 'templates/conversations.html',
  //     controller: 'chatCtrl'
  // });

  $urlRouterProvider.otherwise('/login');

})

.constant('BASE_URL', 'http://142.4.10.93/~vooap/service_provider/webservice/')
.constant('IMG_URL', 'http://142.4.10.93/~vooap/service_provider/public/uploads/user/')
// .constant('BASE_URL', 'http://halphero.com/halphero/webservice/')
// .constant('IMG_URL', 'http://halphero.com/halphero//public/uploads/user/')
 
.directive('sameValueAs', function () {
  return {
    require: 'ngModel',
    link: function (scope, elm, attrs, ctrl) {
      ctrl.$validators.sameValueAs = function (modelValue, viewValue) {
        if (ctrl.$isEmpty(modelValue) || attrs.sameValueAs === viewValue) {
            return true;
        }
        return false;
      };
    }
  };
})

.service('UserService', function() {
  var setUser = function(user_data) {
    window.localStorage.starter_google_user = JSON.stringify(user_data);
  };
  var getUser = function(){
    return JSON.parse(window.localStorage.starter_google_user || '{}');
  };
  return {
    getUser: getUser,
    setUser: setUser
  };
})

.directive('starRating',function() {
  return {
    restrict : 'A',
    template : '<ul class="rating">'+ '<li ng-repeat="star in stars" ng-class="star" ng-click="toggle($index)">'+ '  <i class="fa fa-star-o"></i>'+ ' </li>'+ '</ul>',
    scope : {
      ratingValue : '=',
      max : '=',
      onRatingSelected : '&'
    },
    link : function(scope, elem, attrs) {
      var updateStars = function() {
        scope.stars = [];
        for ( var i = 0; i < scope.max; i++) {
          scope.stars.push({
            filled : i < scope.ratingValue
          });
        }
      };
      scope.toggle = function(index) {
        scope.ratingValue = index + 1;
        scope.onRatingSelected({
          rating : index + 1
        });
      };
      scope.$watch('ratingValue',
      function(oldVal, newVal) {
        if (newVal) {
          updateStars();
        }
      });
    }
  };
})

.factory('ConnectivityMonitor', function($rootScope,$cordovaNetwork){
  return {
    isOnline: function(){
      if(ionic.Platform.isWebView()){
        return $cordovaNetwork.isOnline();    
      } else {
        return navigator.onLine;
      }
    },
    isOffline: function(){
      if(ionic.Platform.isWebView()){
        return !$cordovaNetwork.isOnline();    
      } else {
        return !navigator.onLine;
      }
    },
    startWatching: function(){
      if(ionic.Platform.isWebView()){
        $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
          console.log("went online");
        });

        $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
          console.log("went offline");
        });
      } else {
        window.addEventListener("online", function(e) {
          console.log("went online");
        }, false);    
        window.addEventListener("offline", function(e) {
          console.log("went offline");
        }, false);  
      }       
    }
  }
})



// .directive('googleplace', [ function() {
//   return {
//     require: 'ngModel',
//     link: function(scope, element, attrs, model) {
//       var options = {
//         types: []
//         // componentRestrictions: {  country:'IN' }
//       };
//       scope.gPlace = new google.maps.places.Autocomplete(element[0], options);
//       google.maps.event.addListener(scope.gPlace, 'place_changed', function() {
//         var geoComponents = scope.gPlace.getPlace();
//         var latitude = geoComponents.geometry.location.lat();
//         var longitude = geoComponents.geometry.location.lng();
//         var addressComponents = geoComponents.address_components;
//         console.log(addressComponents);
//         callFunctionHello(latitude,longitude);
//         addressComponents = addressComponents.filter(function(component){
//           switch (component.types[0]) {
//             case "locality": // city
//               return true;
//             case "administrative_area_level_1": // state
//               return true;
//             case "country": // country
//               return true;
//             default:
//               return false;
//           }
//         }).map(function(obj) {
//           return obj.long_name;
//         });

//         addressComponents.push(latitude, longitude);
//         scope.$apply(function() {
//           scope.details = addressComponents; // array containing each location component
          
//           model.$setViewValue(element.val());  
//         });
//       });
//     }
//   };
// }])


// .directive('input', function($timeout) {
//   return {
//     restrict: 'E',
//     scope: {
//       'returnClose': '=',
//       'onReturn': '&',
//       'onFocus': '&',
//       'onBlur': '&'
//     },
//     link: function(scope, element, attr) {
//       element.bind('focus', function(e) {
//         if (scope.onFocus) {
//           $timeout(function() {
//             scope.onFocus();
//           });
//         }
//       });
//       element.bind('blur', function(e) {
//         if (scope.onBlur) {
//           $timeout(function() {
//             scope.onBlur();
//           });
//         }
//       });
//       element.bind('keydown', function(e) {
//         if (e.which == 13) {
//           if (scope.returnClose) element[0].blur();
//           if (scope.onReturn) {
//             $timeout(function() {
//               scope.onReturn();
//             });
//           }
//         }
//       });
//     }
//   }
// })

.directive('moDateInput', function ($window) {
  return {
    require:'^ngModel',
    restrict:'A',
    link:function (scope,delm,attrs,ctrl) {
      var moment = $window.moment;
      var dateFormat = attrs.moDateInput;
      attrs.$observe('moDateInput', function (newValue) {
        if (dateFormat == newValue || !ctrl.$modelValue) return;
        dateFormat = newValue;
        ctrl.$modelValue = new Date(ctrl.$setViewValue);
      });

      ctrl.$formatters.unshift(function (modelValue) {
        if (!dateFormat || !modelValue) return "";
        var retVal = moment(modelValue).format(dateFormat);
        return retVal;
      });

      ctrl.$parsers.unshift(function (viewValue) {
        var date = moment(viewValue, dateFormat);
        return (date && date.isValid() && date.year() > 1950 ) ? date.toDate() : "";
      });
    }
  };
})

.directive('noCacheSrc', function($window) {
  return {
    priority: 99,
    link: function(scope, element, attrs) {
      attrs.$observe('noCacheSrc', function(noCacheSrc) {
        noCacheSrc += '?' + (new Date()).getTime();
        attrs.$set('src', noCacheSrc);
      });
    }
  }
})


.directive('repeatDone', function () {
 return function (scope, element, attrs) {
    if (scope.$last) {
     scope.$eval(attrs.repeatDone);
    }
  }
})

.directive('myRepeatDirective', function() {
  return function(scope, element, attrs) {
    angular.element(element).css('color','blue');
    if (scope.$last){
    }
  };
})


.directive('myCustomer', function() {
  return {
    templateUrl: function(elem, attr) {
      return 'customer-' + attr.type + '.html';
    }
  };
})

.directive('myCustomer', function() {
  return {
    restrict: 'E',
    templateUrl: 'my-customer.html'
  };
})

.directive('myCustomer', function() {
  return {
    restrict: 'E',
    scope: {
      customerInfo: '=info'
    },
    templateUrl: 'my-customer-plus-vojta.html'
  };
})

.directive('myCurrentTime', ['$interval', 'dateFilter', function($interval, dateFilter) {
  function link(scope, element, attrs) {
    var format,
    timeoutId;
    function updateTime() {
      element.text(dateFilter(new Date(), format));
    }
    scope.$watch(attrs.myCurrentTime, function(value) {
      format = value;
      updateTime();
    });
    element.on('$destroy', function() {
      $interval.cancel(timeoutId);
    });
    timeoutId = $interval(function() {
      updateTime(); 
    }, 1000);
  }
  return {
    link: link
  };
}])

.directive('myDialog', function() {
  return {
    restrict: 'E',
    transclude: true,
    scope: {},
    templateUrl: 'my-dialog.html',
    link: function(scope) {
      scope.name = 'Jeff';
    }
  };
})

.directive('limitChar', function() {
  'use strict';
  return {
    restrict: 'A',
    scope: {
      limit: '=limit',
      ngModel: '=ngModel'
    },
    link: function(scope) {
      scope.$watch('ngModel', function(newValue, oldValue) {
        if (newValue) {
          var length = newValue.toString().length;
          if (length > scope.limit) {
            scope.ngModel = oldValue;
          }
        }
      });
    }
  };
})


.directive('myDraggable', ['$document', function($document) {
  return {
    link: function(scope, element, attr) {
      var startX = 0, startY = 0, x = 0, y = 0;

      element.css({
       position: 'relative',
       border: '1px solid red',
       backgroundColor: 'lightgrey',
       cursor: 'pointer'
      });

      element.on('mousedown', function(event) {
        // Prevent default dragging of selected content
        event.preventDefault();
        startX = event.pageX - x;
        startY = event.pageY - y;
        $document.on('mousemove', mousemove);
        $document.on('mouseup', mouseup);
      });

      function mousemove(event) {
        y = event.pageY - startY;
        x = event.pageX - startX;
        element.css({
          top: y + 'px',
          left:  x + 'px'
        });
      }

      function mouseup() {
        $document.off('mousemove', mousemove);
        $document.off('mouseup', mouseup);
      }
    }
  };
}])

//////////// location //////////////

// function callFunctionHello(latitude, longitude){
//   angular.element(document.getElementById('idLatitude')).scope().setLatLong(latitude,longitude); 
// }

// 703636388-4jte6rdegr7gm1rb1pophcd6n5ohsf8n.apps.googleusercontent.com
// TEhpDvFXdxYrDbMUpk8ytTaA