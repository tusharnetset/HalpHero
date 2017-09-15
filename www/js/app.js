angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngCordova', 'ionic-timepicker', 'ngStorage', 'ngCordovaOauth', 'yaru22.angular-timeago'])
    .run(function(BASE_URL, $ionicPlatform, $http, $ionicPopup, $state, localStorageService, $rootScope) {

        $ionicPlatform.ready(function() {
            inAppPurchase
            //.getProducts(['com.halphero.provider.purchase'])
            .getProducts(['com.halphero.subscription'])
            .then(function(products) {
                console.log(products);
            })
            .catch(function(err) {
                console.log(err);
            });

            FCMPlugin.getToken(
                function(token) {
                    console.log(token);
                    localStorageService.set('device_token', token);
                    if (token == null) {
                        console.log("null token");
                        setTimeout(token, 2000);
                    } else {
                        localStorageService.set('device_token', token);
                        var currentPlatform = ionic.Platform.platform();
                        console.log("update token on server");
                        var u_token = localStorageService.get('customer_data');
                        console.log(u_token);
                        $http({
                            method: 'POST',
                            data: 'user_token=' + u_token.user_token + '&user_id=' + u_token.id + '&device_id=' + token + '&device_type=' + currentPlatform,
                            url: BASE_URL + 'update_profile',
                            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                        }).success(function(response) {
                            console.log(response);
                            if (response.status == false) {
                                console.log("false");
                            } else {
                                localStorageService.set('customer_data', response.data);
                            }
                        }).error(function(error) {
                            console.log(error);
                        });
                    }
                },
                function(err) {
                    console.log('error retrieving token: ' + err);
                }
            )
            FCMPlugin.onNotification(function(data) {
               	// alert(JSON.stringify(data));
                var u_token = localStorageService.get('customer_data');
                if (u_token.notification == 'y') {
                    if (data.noti_type == "apply_job") {
                        if(u_token.user_type == "c"){
                            var confirmPopup = $ionicPopup.confirm({
                                title: data.label,
                                cssClass: 'logout_popup',
                                template: data.msg
                            });
                            confirmPopup.then(function(res) {
                                if (res) {
                                    console.log('You are sure');
                                    $state.go('tab.home');
                                } else {
                                    console.log('You are not sure');
                                }
                            })
                        }else{
                            console.log("sp");
                        }
                    } else {
                        console.log("err");
                    }
                } else {
                    console.log("off");
                }

                if (u_token.notification == 'y') {
                    if (data.noti_type == "reject_job") {
                        if(u_token.user_type == "c"){
                            var confirmPopup = $ionicPopup.confirm({
                                title: data.label,
                                cssClass: 'logout_popup',
                                template: data.msg
                            });
                            confirmPopup.then(function(res) {
                                if (res) {
                                    console.log('You are sure');
                                    $state.go('tab.home');
                                } else {
                                    console.log('You are not sure');
                                }
                            })
                        }else{
                            console.log("sp");
                        }
                    } else {
                        console.log("err");
                    }
                } else {
                    console.log("off");
                }

                if (u_token.notification == 'y') {
                    if (data.noti_type == "start_job") {
                        if(u_token.user_type == "c"){
                            var confirmPopup = $ionicPopup.confirm({
                                title: data.label,
                                cssClass: 'logout_popup',
                                template: data.msg
                            });
                            confirmPopup.then(function(res) {
                                if (res) {
                                    console.log('You are sure');
                                    $state.go('tab.History');
                                } else {
                                    console.log('You are not sure');
                                }
                            })
                        }else{
                            console.log("sp");
                        }
                    } else {
                        console.log("err");
                    }
                } else {
                    console.log("off");
                }

                if (u_token.notification == 'y') {
                    if (data.noti_type == "end_job") {
                        if(u_token.user_type == "c"){
                            var confirmPopup = $ionicPopup.confirm({
                                title: data.label,
                                cssClass: 'logout_popup',
                                template: data.msg
                            });
                            confirmPopup.then(function(res) {
                                if (res) {
                                    console.log('You are sure');
                                    $state.go('tab.History');
                                } else {
                                    console.log('You are not sure');
                                }
                            })
                        }else{
                            console.log("sp");
                        }
                    } else {
                        console.log("err");
                    }
                } else {
                    console.log("off");
                }


                if (u_token.notification == 'y') {
                    if (data.noti_type == "chat") {
                        if ($state.current.name !== "conversations" && $state.current.name !== "conversations_provider") {
                            var confirmPopup = $ionicPopup.confirm({
                                title: data.label,
                                cssClass: 'logout_popup',
                                template: data.msg
                            });
                            confirmPopup.then(function(res) {
                                if (res) {
                                    console.log('You are sure');
                                    if(u_token.user_type == 'c'){
                                        $rootScope.usreId = data.reciver_id;
                                        console.log($rootScope.usreId);
                                        $state.go('conversations');
                                    }else{
                                        $rootScope.usreId = data.reciver_id;
                                        console.log($rootScope.usreId);
                                        $state.go('conversations_provider');
                                    }
                                } else {
                                    console.log('You are not sure');
                                }
                            })
                            if(u_token.user_type == 'c'){
                                $rootScope.chatConverCus();
                            }else{
                                $rootScope.chatConver();    
                            }
                        } else {
                            if(u_token.user_type == 'c'){
                                $rootScope.chatConverCus();
                            }else{
                                $rootScope.chatConver();    
                            }
                        }
                    } else {
                        console.log("err");
                    }
                } else {
                    if(u_token.user_type == 'c'){
                        $rootScope.chatConverCus();
                    }else{
                        $rootScope.chatConver();
                    }
                }

                if (u_token.notification == 'y') {
                        if (data.noti_type == "create_job") {
                            if(u_token.user_type == "sp"){
                            var confirmPopup = $ionicPopup.confirm({
                                title: data.label,
                                cache: false,
                                cssClass: 'logout_popup',
                                template: data.msg
                            });
                            confirmPopup.then(function(res) {
                                if (res) {
                                    console.log('You are sure');
                                    $state.go('tab.home');
                                } else {
                                    console.log('You are not sure');
                                }
                            })
                        } else {
                            console.log("c");
                        }
                    }else{
                        console.log("err");
                    }
                } else {
                    console.log("off");
                }

                if(u_token.notification == 'y'){
                	if(data.notification == "user_type_chat"){
                		if(u_token.user_type == "sp"){
                			var confirmPopup = $ionicPopup.confirm({
                				title:data.title,
                				cache:false,
                				cssClass: 'logout_popup',
                				template:data.msg
                			});
                			confirmPopup.then(function(res){
                				if(res){
                					$state.go('tab.home');
                				}
                			})
                		}
                	}
                } 

                if (u_token.notification == 'y') {
                        if (data.noti_type == "hire_service_provider") {
                            if(u_token.user_type == "sp"){
                            var confirmPopup = $ionicPopup.confirm({
                                title: data.label,
                                cache: false,
                                cssClass: 'logout_popup',
                                template: data.msg
                            });
                            confirmPopup.then(function(res) {
                                if (res) {
                                    console.log('You are sure');
                                    $state.go('tab.myjobs');
                                } else {
                                    console.log('You are not sure');
                                }
                            })
                        } else {
                            console.log("c");
                        }
                    } else {
                        console.log("err");
                    }
                } else {
                    console.log("off");
                }

            })

            if (window.Connection) {
                if (navigator.connection.type == Connection.NONE) {
                    // swal("Sorry!", "no Internet connectivity detected. Please reconnect and try again.!")
                    $ionicPopup.confirm({
                        title: 'No Internet Connection',
                        cssClass: 'logout_popup',
                        content: 'Sorry, no Internet connectivity detected. Please reconnect and try again.'
                    })
                    .then(function(result) {
                        console.log(result);
                        if (!result) {
                            ionic.Platform.exitApp();
                        }
                    });
            	}
            }

            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);
            }
            if (window.StatusBar) {
                StatusBar.styleLightContent();
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

    // .state('landing', {
    //     url: '/landing',
    //     cache: false,
    //     templateUrl: 'templates/landing.html',
    //     controller: 'landingCtrl'
    // })

    .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/Customer/tabs.html'
    })

    .state('tab.setting', {
        cache: false,
        url: '/setting',
        views: {
            'tab-setting': {
                templateUrl: 'templates/Customer/setting.html',
                controller: 'settingCtrl'
            }
        }
    })

    .state('login', {
        cache: false,
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'loginCtrl'
    })

    .state('signup', {
        cache: false,
        url: '/signup',
        templateUrl: 'templates/Customer/signup.html',
        controller: 'SignupCtrl'
    })

    .state('createprofile', {
        cache: false,
        url: '/createprofile',
        templateUrl: 'templates/Customer/createprofile.html',
        controller: 'CreateProfileCtrl'
    })

    .state('change_password', {
        cache: false,
        url: '/change_password',
        templateUrl: 'templates/Customer/change_password.html',
        controller: 'changePassCtrl'
    })

    .state('tab.customer_home', {
        cache: false,
        url: '/customer_home',
        views: {
            'tab-customer_home': {
                templateUrl: 'templates/Customer/customer_home.html',
                controller: 'homeCustomerCtrl'
            }
        }
    })

    .state('tab.post_job', {
        cache: false,
        url: '/post_job',
        views: {
            'tab-post_job': {
                templateUrl: 'templates/Customer/post_job.html',
                controller: 'postJobCtrl'
            }
        }
    })

    .state('tab.History', {
        cache: false,
        url: '/History',
        views: {
            'tab-History': {
                templateUrl: 'templates/Customer/History.html',
                controller: 'historyAlljobsCtrl'
            }
        }
    })

    .state('tab.notifications', {
        cache: false,
        url: '/notifications',
        views: {
            'tab-notifications': {
                templateUrl: 'templates/Customer/notifications.html',
                controller: 'notificationCtrl'
            }
        }
    })

    .state('History_detail', {
        cache: false,
        url: '/History_detail',
        templateUrl: 'templates/Customer/History_detail.html',
        controller: 'historyjobsDetailsCtrl'
    })

    .state('history_detail_completed', {
        cache: false,
        url: '/history_detail_completed',
        templateUrl: 'templates/Customer/history_detail_completed.html',
        controller: 'historyjobsDetailsCompleteCtrl'
    })

    // .state('job_detail_completed', { 
    //   cache: false,
    //   url: '/job_detail_completed',
    //   templateUrl: 'templates/Customer/job_detail_completed.html',
    //   controller: 'JobDetailCompleted'
    // })

    .state('profile', {
        cache: false,
        url: '/profile',
        templateUrl: 'templates/Customer/profile.html',
        controller: 'profileCtrl'
    })

    .state('conversations', {
        cache: false,
        url: '/conversations',
        templateUrl: 'templates/Customer/conversations.html',
        controller: 'ChatsCtrl'
    })

    .state('message', {
        cache: false,
        url: '/message',
        templateUrl: 'templates/Customer/message.html',
        controller: 'MessageCtrl'
    })

    .state('rating', {
        cache: false,
        url: '/rating',
        templateUrl: 'templates/Customer/rating.html',
        controller: 'RatingCtrl'
    })

    .state('reciept', {
        cache: false,
        url: '/reciept',
        templateUrl: 'templates/Customer/reciept.html',
        controller: 'recieptCtrl'
    })

    .state('payment_option', {
        cache: false,
        url: '/payment_option',
        templateUrl: 'templates/Customer/payment_option.html',
        controller: 'paymentCtrl'
    })

    .state('make_pay_add_card', {
        cache: false,
        url: '/make_pay_add_card',
        templateUrl: 'templates/Customer/make_pay_add_card.html',
        controller: 'makePayAddCardCtrl'
    })

    .state('new_card', {
        cache: false,
        url: '/new_card',
        templateUrl: 'templates/Customer/new_card.html',
        controller: 'newcardCtrl'
    })

    .state('edit_profile', {
        cache: false,
        url: '/edit_profile',
        templateUrl: 'templates/Customer/edit_profile.html',
        controller: 'editprofileCtrl'
    })

    .state('job_detail_customer', {
        cache: false,
        url: '/job_detail_customer',
        templateUrl: 'templates/Customer/job_detail_customer.html',
        controller: 'JobDetailCustomer'
    })

    .state('job_applicants', {
        cache: false,
        url: '/job_applicants',
        templateUrl: 'templates/Customer/job_applicants.html',
        controller: 'JobApplicants'
    })

    .state('other_profile', {
        cache: false,
        url: '/other_profile',
        templateUrl: 'templates/Customer/other_profile.html',
        controller: 'otherProfileCtrl'
    })

    .state('review', {
        cache: false,
        url: '/review',
        templateUrl: 'templates/Customer/review.html',
        controller: 'reviewProfileCtrl'
    })

    .state('forgot_password', {
        cache: false,
        url: '/forgot_password',
        templateUrl: 'templates/forgot_password.html',
        controller: 'forgotPasswordCtrl'
    })

    .state('about_us', {
        cache: false,
        url: '/about_us',
        templateUrl: 'templates/Customer/about_us.html',
        controller: 'aboutCtrl'
    })

    .state('contact_us', {
        cache: false,
        url: '/contact_us',
        templateUrl: 'templates/Customer/contact_us.html',
        controller: 'contactCtrl'
    })

    .state('privacy_policy', {
        cache: false,
        url: '/privacy_policy',
        templateUrl: 'templates/Customer/privacy_policy.html',
        controller: 'privacyCtrl'
    })

    .state('term_conditions', {
        cache: false,
        url: '/term_conditions',
        templateUrl: 'templates/Customer/term_conditions.html',
        controller: 'termConCtrl'
    })

    //////////// Service Provider /////////////////////////////////////////////////////////////////////////

    .state('tab1', {
        url: '/tab1',
        abstract: true,
        templateUrl: 'templates/Service_provider/tabs_provider.html'
    })

    .state('tab1.settings', {
        cache: false,
        url: '/settings',
        views: {
            'tab-settings': {
                templateUrl: 'templates/Service_provider/settings.html',
                controller: 'settingProviderCtrl'
            }
        }
    })

    .state('login_provider', {
        cache: false,
        url: '/login_provider',
        templateUrl: 'templates/Service_provider/login_provider.html',
        controller: 'LoginProviderCtrl'
    })

    .state('signup_provider', {
        cache: false,
        url: '/signup_provider',
        templateUrl: 'templates/Service_provider/signup_provider.html',
        controller: 'SignupProviderCtrl'
    })

    .state('add_account', {
        cache: false,
        url: '/add_account',
        templateUrl: 'templates/Service_provider/add_account.html',
        controller: 'accountCtrl'
    })

    .state('createprofile_provider', {
        cache: false,
        url: '/createprofile_provider',
        templateUrl: 'templates/Service_provider/createprofile_provider.html',
        controller: 'CreateProfileProviderCtrl'
    })
    
    .state('tab1.home', {
        cache: false,
        url: '/home',
        views: {
            'tab-home': {
                templateUrl: 'templates/Service_provider/home.html',
                controller: 'homeCtrl'
            }
        }
    })

    .state('tab1.myjobs', {
        cache: false,
        url: '/myjobs',
        views: {
            'tab-myjobs': {
                templateUrl: 'templates/Service_provider/myjobs.html',
                controller: 'MyjobsCtrl'
            }
        }
    })

    .state('tab1.notifications_provider', {
        cache: false,
        url: '/notifications_provider',
        views: {
            'tab-notifications_provider': {
                templateUrl: 'templates/Service_provider/notifications_provider.html',
                controller: 'notificationProviderCtrl'
            }
        }
    })

    .state('tab1.completed_jobs', {
        cache: false,
        url: '/completed_jobs',
        views: {
            'tab-completed_jobs': {
                templateUrl: 'templates/Service_provider/completed_jobs.html',
                controller: 'CompletedjobsCtrl'
            }
        }
    })

    .state('job_detail', {
        cache: false,
        url: '/job_detail',
        templateUrl: 'templates/Service_provider/job_detail.html',
        controller: 'JobDetailCtrl'
    })

    .state('job_detail_applied', {
        cache: false,
        url: '/job_detail_applied',
        templateUrl: 'templates/Service_provider/job_detail_applied.html',
        controller: 'JobDetailApplied'
    })

    .state('job_detail_completed', {
        cache: false,
        url: '/job_detail_completed',
        templateUrl: 'templates/Service_provider/job_detail_completed.html',
        controller: 'JobDetailCompletedCtrl'
    })

    .state('profile_provider', {
        cache: false,
        url: '/profile_provider',
        templateUrl: 'templates/Service_provider/profile_provider.html',
        controller: 'profileProviderCtrl'
    })

    .state('review_provider', {
        cache: false,
        url: '/review_provider',
        templateUrl: 'templates/Service_provider/review_provider.html',
        controller: 'providerReviewCtrl'
    })

    .state('change_password_provider', {
        cache: false,
        url: '/change_password_provider',
        templateUrl: 'templates/Service_provider/change_password_provider.html',
        controller: 'changePassProviderCtrl'
    })
    .state('edit_profile_provider', {
        cache: false,
        url: '/edit_profile_provider',
        templateUrl: 'templates/Service_provider/edit_profile_provider.html',
        controller: 'editprofileProviderCtrl'
    })

    .state('conversations_provider', {
        cache: false,
        url: '/conversations_provider',
        templateUrl: 'templates/Service_provider/conversations_provider.html',
        controller: 'conversationsProviderCtrl'
    })

    .state('message_provider', {
        cache: false,
        url: '/message_provider',
        templateUrl: 'templates/Service_provider/message_provider.html',
        controller: 'MessageProviderCtrl'
    })

    .state('receipt_provider', {
        cache: false,
        url: '/receipt_provider',
        templateUrl: 'templates/Service_provider/receipt_provider.html',
        controller: 'receiptProviderCtrl'
    })

    // .state('rating', {
    //   url: '/rating',
    //   templateUrl: 'templates/Service_provider/rating.html',
    //   controller: 'RatingServiCtrl'
    // })

    .state('forgot_password_provider', {
        cache: false,
        url: '/forgot_password_provider',
        templateUrl: 'templates/Service_provider/forgot_password_provider.html',
        controller: 'forgotPassProviderCtrl'
    })

    .state('purchase', {
        cache: false,
        url: '/purchase',
        templateUrl: 'templates/Service_provider/purchase.html',
        controller: 'purchaseCtrl'
    })

    .state('about_us_provider', {
        cache: false,
        url: '/about_us_provider',
        templateUrl: 'templates/Service_provider/about_us_provider.html',
        controller: 'aboutProviderCtrl'
    })

    .state('contact_us_provider', {
        cache: false,
        url: '/contact_us_provider',
        templateUrl: 'templates/Service_provider/contact_us_provider.html',
        controller: 'contactProviderCtrl'
    })

    .state('privacy_policy_provider', {
        cache: false,
        url: '/privacy_policy_provider',
        templateUrl: 'templates/Service_provider/privacy_policy_provider.html',
        controller: 'privacyProviderCtrl'
    })

    .state('term_conditions_provider', {
        cache: false,
        url: '/term_conditions_provider',
        templateUrl: 'templates/Service_provider/term_conditions_provider.html',
        controller: 'termConProviderCtrl'
    })

    $urlRouterProvider.otherwise('/login');

})

// .constant('BASE_URL', 'http://142.4.10.93/~vooap/service_provider/webservice/')
// .constant('IMG_URL', 'http://142.4.10.93/~vooap/service_provider/public/uploads/user/')
.constant('BASE_URL', 'http://halphero.com/halphero/webservice/')
.constant('IMG_URL', 'http://halphero.com/halphero//public/uploads/user/')

.directive('sameValueAs', function() {
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            ctrl.$validators.sameValueAs = function(modelValue, viewValue) {
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
    var getUser = function() {
        return JSON.parse(window.localStorage.starter_google_user || '{}');
    };
    return {
        getUser: getUser,
        setUser: setUser
    };
})

.directive('starRating', function() {
    return {
        restrict: 'A',
        template: '<ul class="rating">' + '<li ng-repeat="star in stars" ng-class="star" ng-click="toggle($index)">' + '  <i class="fa fa-star-o"></i>' + ' </li>' + '</ul>',
        scope: {
            ratingValue: '=',
            max: '=',
            onRatingSelected: '&'
        },
        link: function(scope, elem, attrs) {
            var updateStars = function() {
                scope.stars = [];
                for (var i = 0; i < scope.max; i++) {
                    scope.stars.push({
                        filled: i < scope.ratingValue
                    });
                }
            };
            scope.toggle = function(index) {
                scope.ratingValue = index + 1;
                scope.onRatingSelected({
                    rating: index + 1
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



.factory('ConnectivityMonitor', function($rootScope, $cordovaNetwork) {
    return {
        isOnline: function() {
            if (ionic.Platform.isWebView()) {
                return $cordovaNetwork.isOnline();
            } else {
                return navigator.onLine;
            }
        },
        isOffline: function() {
            if (ionic.Platform.isWebView()) {
                return !$cordovaNetwork.isOnline();
            } else {
                return !navigator.onLine;
            }
        },
        startWatching: function() {
            if (ionic.Platform.isWebView()) {
                $rootScope.$on('$cordovaNetwork:online', function(event, networkState) {
                    console.log("went online");
                });

                $rootScope.$on('$cordovaNetwork:offline', function(event, networkState) {
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

.directive('moDateInput', function($window) {
    return {
        require: '^ngModel',
        restrict: 'A',
        link: function(scope, delm, attrs, ctrl) {
            var moment = $window.moment;
            var dateFormat = attrs.moDateInput;
            attrs.$observe('moDateInput', function(newValue) {
                if (dateFormat == newValue || !ctrl.$modelValue) return;
                dateFormat = newValue;
                ctrl.$modelValue = new Date(ctrl.$setViewValue);
            });

            ctrl.$formatters.unshift(function(modelValue) {
                if (!dateFormat || !modelValue) return "";
                var retVal = moment(modelValue).format(dateFormat);
                return retVal;
            });

            ctrl.$parsers.unshift(function(viewValue) {
                var date = moment(viewValue, dateFormat);
                return (date && date.isValid() && date.year() > 1950) ? date.toDate() : "";
            });
        }
    };
})

.directive('noCacheSrc', function($window) {
    return {
        priority: 100,
        link: function(scope, element, attrs) {
            attrs.$observe('noCacheSrc', function(noCacheSrc) {
                noCacheSrc += '?' + (new Date()).getTime();
                attrs.$set('src', noCacheSrc);
            });
        }
    }
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
            var startX = 0,
                startY = 0,
                x = 0,
                y = 0;
            element.css({
                position: 'relative',
                border: '1px solid red',
                backgroundColor: 'lightgrey',
                cursor: 'pointer'
            });
            element.on('mousedown', function(event) {
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
                    left: x + 'px'
                });
            }

            function mouseup() {
                $document.off('mousemove', mousemove);
                $document.off('mouseup', mouseup);
            }
        }
    };
}])

/*.service('myService', function($q, $http) {
  this.data;
  var self = this;

  this.getMyData = function() {
    if (angular.isDefined(self.data)) {
      // use $q to return a promise
      return $q.when(self.data)
    }
    return $http.get('myurl').then(function(resp) {
      self.data = resp;
    })
  }*/

// }

// function callFunctionHello(latitude, longitude){
//   angular.element(document.getElementById('idLatitude')).scope().setLatLong(latitude,longitude); 
// }

// 703636388-4jte6rdegr7gm1rb1pophcd6n5ohsf8n.apps.googleusercontent.com
// TEhpDvFXdxYrDbMUpk8ytTaA

// com.ionicframework.customer640089