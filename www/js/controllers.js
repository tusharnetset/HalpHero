angular.module('starter.controllers', ['LocalStorageModule'])
    
.controller('loginCtrl', function($cordovaCamera,$ionicActionSheet,$ionicPlatform,$cordovaToast,$ionicPopup,$cordovaOauth,$scope, $state, $ionicPopup, $ionicLoading, $http, BASE_URL, localStorageService, Customer) {
  $ionicPlatform.registerBackButtonAction(function(event) {
    if($state.current.name == "login") {
      $ionicPopup.confirm({
        title: 'EXIT',
        template: 'Are you sure you want to Exit?'
      }).then(function(res) {
        if (res) {
          ionic.Platform.exitApp();
        }
      }) 
    }
  },200);

  $check = localStorageService.get('customer_data');
  if (!$check) {
    $state.go('login');
  } else if($check.city == "") {
    $state.go('createprofile');
  } else {
    $state.go("tab.home");
  }

  $scope.loginUser = function($dataa, $valid) {
    var device_token = localStorageService.get('device_token');
    $scope.currentPlatform = ionic.Platform.platform();
    $scope.submitted = true;
    if ($valid) {
      $scope.errorUserName = '';
      $scope.errorPassword = '';
      $ionicLoading.show({
        template: '<ion-spinner icon="lines"></ion-spinner>'
      });
      $userdataa = localStorageService.get('customer_data');
      console.log($userdataa);
      var Url = BASE_URL + '/login';
      $http({
        method: 'POST',
        data: 'email=' + $dataa.email + '&password=' + $dataa.password + '&device_id=' + device_token + '&device_type=' + $scope.currentPlatform + '&user_type=' + 'c',
        url: Url,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }).success(function(data) {
        console.log(data);
        if(data.status == true) {
          $ionicLoading.hide();
          if(data.data.city == ""){
            $ionicLoading.hide();
            localStorageService.set('customer_data', data.data);
            $state.go("createprofile");
          }else{
            $ionicLoading.hide();
            localStorageService.set('customer_data', data.data);
            $state.go('tab.home');
          }
        } else {
          $ionicLoading.hide();
          $cordovaToast.showLongBottom(data.message).then(function(success) {
            }, function(error) {
          });
          if(data.type == 'email')
            $scope.errorUserName = data.message;
          else if(data.type == 'password')
            $scope.errorPassword = data.message;
          else $scope.errorMessages = data.message;
        }
      })
     .error(function(data) {
        $ionicLoading.hide();
        $cordovaToast.showLongBottom(data.message).then(function(success) {
        },function(error) {
        });
      });
    } else {
      $ionicLoading.hide();
      $cordovaToast.showLongBottom("Please fill required fields").then(function(success) {
      },function(error) {
      });
    }
  }

  $scope.forgotPass = function(){
    $state.go("forgot_password");
  }

  $scope.signup = function() {
    $state.go('signup');
  }

  $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

  $scope.googleLogin = function(){
    if (typeof String.prototype.startsWith != 'function') {
      String.prototype.startsWith = function (str){
        return this.indexOf(str) == 0;
      };
    }
    var clientId = "435140076880-livfr98i03vcu0khll90olj3b2qto9rg.apps.googleusercontent.com";
    var clientSecret = 'HhUCQyowk6vb86uBZ-UF69Vl';
    var ref = window.open('https://accounts.google.com/o/oauth2/auth?client_id=' + clientId + '&redirect_uri=http://localhost/callback&scope=https://www.googleapis.com/auth/userinfo.email&https://www.googleapis.com/auth/userinfo.profile&https://www.googleapis.com/auth/urlshortener&approval_prompt=force&response_type=code&access_type=offline', '_blank', 'location=no');
    ref.addEventListener('loadstart', function(event) { 
      if((event.url).startsWith("http://localhost/callback")) {
        requestToken = (event.url).split("code=")[1];
        console.log(requestToken);
        $http({method: "post", url: "https://accounts.google.com/o/oauth2/token", data: "client_id=" + clientId + "&client_secret=" + clientSecret + "&redirect_uri=http://localhost/callback" + "&grant_type=authorization_code" + "&code=" + requestToken })
          .success(function(data) {
            console.log(data);
            $scope.accessToken = data.access_token;
            console.log($scope.accessToken);
            $http.get('https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' + $scope.accessToken, {params: {format: 'json' }
          }).then(function(result) {
            console.log(result);
            $scope.g_Id = result.data.id;
            $scope.guserData = result.data;
            $ionicLoading.show({template: '<ion-spinner icon="lines"></ion-spinner>'});
            var device_token = localStorageService.get('device_token');
            var device_type = ionic.Platform.device().platform;
            var Url = BASE_URL + 'register/';
            $http({
              method: 'POST',
              data: 'other_reg_type_login_id=' + $scope.g_Id + '&registration_type=' + 'G' + '&device_id=' + device_token + '&device_type=' + device_type + '&user_type=' + 'c' + '&first_name=' + $scope.guserData.name + '&last_name=' + '' + '&email=' + $scope.guserData.email, 
              url: Url,
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function(data) {
              console.log(data);
              if (data.status == true) {
                $ionicLoading.hide();
                if(data.data.city == ""){
                  $ionicLoading.hide();
                  localStorageService.set('customer_data', data.data);
                  $state.go("createprofile");
                }else{
                  $ionicLoading.hide();
                  localStorageService.set('customer_data', data.data);
                  $state.go('tab.home');
                }
              } else {
                $ionicLoading.hide();
                $cordovaToast.showLongBottom(data.message).then(function(success) {
                },function(error) {
              });
              }
            })
            .error(function(data) {
              $ionicLoading.hide();
              $cordovaToast.showLongBottom(data.message).then(function(success) {
              }, function(error) {
              });
            });
          })
           .error(function(data, status) {
              alert("ERROR: " + JSON.stringify(data));
              console.log("ERROR: " + JSON.stringify(data));
            })          
          })
        ref.close();
      }
    });
  }

  if(typeof String.prototype.startsWith != 'function') {
    String.prototype.startsWith = function (str){
      return this.indexOf(str) == 0;
    };
  }

  $scope.facebookLogin = function(){
    var fb_app_id = '255319991593527';
    $cordovaOauth.facebook(fb_app_id, ["email", "public_profile"],{redirect_uri: "https://igotevent-82f2d.firebaseapp.com/__/auth/handler"}).then(function(result) {
      var access_token = result;
      var re_id = result;
      console.log(re_id);
      $http.get("https://graph.facebook.com/v2.2/me", { params: { access_token: result.access_token,fields: "id,name,gender,first_name,last_name,email,location,picture",format: "json" }
      }).then(function(result) {
        console.log(result);
        $scope.u_id = result.data.id;
        $scope.uData = result.data;
        $ionicLoading.show({template: '<ion-spinner icon="lines"></ion-spinner>'});
        var device_token = localStorageService.get('device_token');
        var device_type = ionic.Platform.device().platform;
        var Url = BASE_URL + 'register/';
        $http({
          method: 'POST',
          data: 'other_reg_type_login_id=' + $scope.u_id + '&registration_type=' + 'F' + '&device_id=' + device_token + '&device_type=' + device_type + '&user_type=' + 'c' + '&first_name=' + $scope.uData.first_name + '&last_name=' + $scope.uData.last_name + '&email=' + $scope.uData.email, 
          url: Url,
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function(data) {
          console.log(data);
          if(data.status == true) {
            $ionicLoading.hide();
            if(data.data.city == ""){
              $ionicLoading.hide();
              localStorageService.set('customer_data', data.data);
              $state.go("createprofile");
            }else{
              $ionicLoading.hide();
              console.log(data);
              localStorageService.set('customer_data', data.data);
              $state.go('tab.home');
            }
          } else {
            $ionicLoading.hide();
            $cordovaToast.showLongBottom(data.message).then(function(success) {
            },function(error) {
          });
          }
        })
        .error(function(data) {
          $ionicLoading.hide();
          $cordovaToast.showLongBottom(data.message).then(function(success) {
          }, function(error) {
          });
        });
      })
    })
  }


})


.controller('SignupCtrl', function($ionicHistory,$ionicPlatform,$cordovaToast,$scope,$state,$ionicPopup,$ionicLoading,$http,BASE_URL,localStorageService) {

  $ionicPlatform.registerBackButtonAction(function(event) {
    $ionicHistory.goBack();
  },200);

  $scope.loginG = function(){
    $state.go('login');
  }

  $scope.create_profile = function($dataa,$valid) {
    var device_token = localStorageService.get('device_token');
    $scope.submitted = true;
    if ($valid) {
      console.log($dataa);
      $dataa.user_type = 'c';
      $dataa.registration_type = "O";
      $dataa.device_type = ionic.Platform.device().platform;
      $dataa.device_id = device_token;
      $ionicLoading.show({
        template: '<ion-spinner icon="lines"></ion-spinner>'
      });
      var Url = BASE_URL + 'register/';
      var config = {
        headers: { 'Content-Type': 'application/json;' }
      };
      $http({
        method: 'POST',
        url: Url,
        data: $dataa,
        transformRequest: function(obj) {
          var str = [];
          for (var p in obj)
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
          return str.join("&");
        },
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }).success(function(data) {
        $ionicLoading.hide();
        if(data.status == true) {
          $ionicLoading.hide();
          $cordovaToast.showLongBottom("Registered Succesfully").then(function(success) {
          },function(error) {
          });
          localStorageService.set('customer_data', data.data);
          $state.go('createprofile');
        } else {
          $ionicLoading.hide();
          if (data.type == 'email')
            $scope.errorEmail = data.message;
          else
            $scope.errorMessages = data.message;
        }
      }).error(function(error) {
        $ionicLoading.hide();
      });
    }else{
      $ionicLoading.hide();
      $cordovaToast.showLongBottom("Please fill required fields").then(function(success) {
      }, function(error) {
      });
    }
  }

})


//////////////////////Create Profile Controller//////////////////

.controller('CreateProfileCtrl', function($ionicHistory,$ionicPlatform,$cordovaToast,$scope, $state, ionicTimePicker, $ionicPopup, $ionicLoading, $http, BASE_URL, localStorageService, $cordovaCamera, $ionicActionSheet, $cordovaFileTransfer, $rootScope, $timeout) {

  var userD = localStorageService.get('customer_data');
  console.log(userD);
  $scope.user = {};

  $ionicPlatform.registerBackButtonAction(function(event) {
    // navigator.app.backHistory();
  },200);

  $scope.genDer = function(value){
    $scope.gender = value;
    console.log($scope.gender);
  }

  $scope.disableTap = function(){
    container = document.getElementsByClassName('pac-container');
    angular.element(container).attr('data-tap-disabled', 'true');
    angular.element(container).on("click", function(){
      document.getElementById('searchTextField').blur();
    })
  }

  // $scope.initCre = function(){
  //  $http({
  //     method: 'GET',
  //     url:'https://api.printful.com/countries',
  //     headers: { 'Content-Type': 'application/json; charset=UTF-8' }
  //   }).success(function(response){
  //     console.log(response);
  //   }).error(function(error){
  //     console.log(error);
  //   });
  // }

    function initialize() {
      var input = document.getElementById('searchTextField');
      var options = {
      types: ['address']};
      var autocomplete = new google.maps.places.Autocomplete(input, options);
      google.maps.event.addListener(autocomplete, 'place_changed', function() {
        var place = autocomplete.getPlace();
        console.log(place);
        $scope.user.city = place.formatted_address;
        for (var i = 0; i < place.address_components.length; i++) {for (var j = 0; j < place.address_components[i].types.length; j++) {
        if (place.address_components[i].types[j] == "country") {
          $scope.country = place.address_components[i].long_name;
          console.log($scope.country);
        }}}
        // $scope.user.address = place.name;document.getElementById('city2').value = place.name;
        // document.getElementById('cityLat').value = place.geometry.location.lat();
        // document.getElementById('cityLng').value = place.geometry.location.lng();
        document.getElementById('country').value = $scope.country;
        $scope.user.country = $scope.country;
      });
    }
    google.maps.event.addDomListener(window, 'load', initialize);initialize();

  $scope.setLatLong = function(lat,long){
    $scope.lat = lat;
    $scope.lng = long;
  }

  $scope.go_home = function($dataa,valid) {
    var device_token = localStorage.getItem('device_token');
    $scope.currentPlatform = ionic.Platform.platform();
    console.log($dataa);
    $scope.gender;
    $scope.gendEr = $scope.gender;
    $scope.submitted = true;
    $userdata = localStorageService.get('customer_data');
    console.log("Anjali");
    console.log($userdata);
    console.log($userdata.user_token);
    console.log("Anjali");
    if (valid) {
    $ionicLoading.show({template: '<ion-spinner icon="lines"></ion-spinner>'});
    var url = BASE_URL + 'update_profile/';
    if ($scope.my_profile_image) {
      console.log($scope.my_profile_image);
      var targetPath = $scope.my_profile_image;
      var filename = targetPath.split("/").pop();
      filename = filename.split('?');
      console.log(filename);
      var options = {
        fileKey: "pic",
        fileName: filename[0],
        chunkedMode: false,
        mimeType: "image/jpg",
      };
      var params = {};
      params.user_token = $userdata.user_token;
      params.user_id = $userdata.id;
      params.gender = $scope.gendEr;
      params.country = $dataa.country;
      params.city = $dataa.city;
      params.device_id = device_token;
      params.device_type = $scope.currentPlatform;
      params.about_me = $dataa.about_me;
      options.params = params;
      console.log(params);
      $cordovaFileTransfer.upload(url, targetPath, options).then(function(result) {
        $ionicLoading.hide();
        console.log(result);
        var hh = JSON.parse(result.response);
        console.log(hh);
        if(hh.status == true) {
          $ionicLoading.hide();
          localStorageService.set('customer_data', hh.data);
          // $cordovaToast.showLongBottom(hh.data).then(function(success) {
          // }, function(error) {
          // });
          $state.go('tab.home');
        } else {
          $ionicLoading.hide();
          console.log(hh.data);
          $cordovaToast.showLongBottom(hh.data).then(function(success) {
          }, function(error) {
          });
        }
      },function(err) {
        $ionicLoading.hide();
        console.log(err);
        $scope.imgURI = undefined;
        console.log("ERROR: " + JSON.stringify(err));
        
      },function(progress) {
        $ionicLoading.show({template: '<ion-spinner icon="lines"></ion-spinner>'});
        $timeout(function() {
          $scope.downloadProgress = (progress.loaded / progress.total) * 100;
        })
      });
    } else {
      $ionicLoading.hide();
      $dataa.user_token = $userdata.user_token;
      $dataa.user_id = $userdata.id;
      var config = {
        headers: { 'Content-Type': 'application/json;' }
      };
      $http({
        method: 'POST',
        url: url,
        data: $dataa,
        transformRequest: function(obj) {
          var str = [];
          for (var p in obj)
          str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
          return str.join("&");
        },
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }).success(function(data) {
        $ionicLoading.hide();
        if (data.status == true) {
          $ionicLoading.hide();
          localStorageService.set('customer_data', data.data);
          console.log(data.data);
          $state.go('tab.home');
        }else {
          $ionicLoading.hide();
          console.log(data);
        }
      }).error(function(data) {
        $ionicLoading.hide();
        console.log(data);
      });
    }
    }else{
      $ionicLoading.hide();
      $cordovaToast.showLongBottom("Please fill required fields").then(function(success) {
      }, function(error) {
      });
    }
  }

  $scope.chooseimage = function() {
    var hideSheet = $ionicActionSheet.show({
      buttons: [
        { text: 'Take Photo' },
        { text: 'Take Photo from albums' }
      ],
      titleText: 'Select photos from',
      cancelText: 'Cancel',
      cancel: function() {
        hideSheet();
      },
      buttonClicked: function(index) {
        if (index == 0) {
          takePicture2({
            quality: 80,
            allowEdit: true,
            targetWidth: 800,
            targetHeight: 800,
            sourceType: Camera.PictureSourceType.CAMERA,
            encodingType: Camera.EncodingType.JPEG,
            destinationType: Camera.DestinationType.FILE_URI
          });
        } else if (index == 1) {
          takePicture2({
            quality: 80,
            allowEdit: true,
            targetWidth: 800,
            targetHeight: 800,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            encodingType: Camera.EncodingType.JPEG,
            destinationType: Camera.DestinationType.FILE_URI,
            MediaType: Camera.MediaType.PICTURE
          });
        } else {
          return true;
        }
        hideSheet();
      }
    });
  }

  var takePicture2 = function(options) {
    $cordovaCamera.getPicture(options).then(function(imageURI) {
       $scope.imageURI = imageURI;
       $scope.my_profile_image = imageURI;
    }, function(err) {
      $cordovaToast.showLongBottom(err).then(function(success) {
        console.log(success);
      }, function(error) {
        console.log(error);
      });
    });
  }

  $scope.upload_document = function() {
    var options = { 
      quality : 80, 
      destinationType : Camera.DestinationType.FILE_URI, 
      sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY,
      mediaType: Camera.MediaType.ALLMEDIA,
      allowEdit : true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 800,
      targetHeight: 800,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: true
    };
    $cordovaCamera.getPicture(options).then(function(imageData) {
      $scope.imgURI = imageData;
      var image = "data:image/jpeg;base64," + imageData;
      $scope.docData = imageData;
    },function(err) {
     $cordovaToast.showLongBottom(err).then(function(success) {
      }, function(error) {
      })
    }) 
  }

})


///////////////customer home/////////////
.controller('homeCustomerCtrl', function($ionicPlatform,$cordovaToast,$scope,$rootScope, $state, $http, $location, BASE_URL, $ionicHistory, $ionicLoading, localStorageService,$ionicPopup) {
 
  $ionicPlatform.registerBackButtonAction(function(event) {
    if($state.current.name=="tab.home") {
      $ionicPopup.confirm({
        title: 'EXIT',
        template: 'Are you sure you want to exit?'
      }).then(function(res) {
        if (res) {
          ionic.Platform.exitApp();
        }
      }) 
    }
  },200);

  $scope.title="Home";
  $userdata = localStorageService.get('customer_data');
  $scope.cusdata = [];

  $scope.getjobs = function() {
    $ionicLoading.show({template: '<ion-spinner icon="lines"></ion-spinner>'});
    $userdata = localStorageService.get('customer_data');
    $http({
      method: 'POST',
      data: 'user_token=' + $userdata.user_token + '&user_id=' + $userdata.id,
      url: BASE_URL+'get_job_of_user',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).success(function(response){
      console.log(response);
      $ionicLoading.hide();
      if(response.status == false){
        $ionicLoading.hide();
        if(response.message == "Session Expired!! Please login again."){
          localStorageService.remove('customer_data');
          $ionicHistory.clearCache().then(function() {
            $state.go('login'); 
          })
        }
      }else{
        $ionicLoading.hide();
        $scope.cusdata = response.data;
        console.log($scope.cusdata);
      }
    }).error(function(error){
      console.log(error);
      $ionicLoading.hide();
    });
  }
  $scope.getjobs();

  $scope.doRefresh = function() {
    $userdata = localStorageService.get('customer_data');
    $http({
       method: 'POST',
       data: 'user_token=' + $userdata.user_token + '&user_id=' + $userdata.id,
       url: BASE_URL+'/get_job_of_user',
       headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).success(function(response) {
      console.log(response);
      if(response.status == false){
        if(response.message == "Session Expired!! Please login again."){
          localStorageService.remove('customer_data');
          $ionicHistory.clearCache().then(function() {
            $state.go('login'); 
          })
        }
      }else{
        $scope.cusdata = response.data;
      }
    }).error(function(error){
      console.log(error.Message);
    })
    .finally(function() {
      console.log('stop_refreshing');
      $scope.$broadcast('scroll.refreshComplete');
    })  
  };

  $scope.go_detail_customer = function(id) {
    console.log("this is job id =", id);
    $rootScope.jobid = id;
    $state.go('job_detail_customer');
  }

  $scope.go_profile = function() {
    $state.go('profile');
  }

  $scope.go_message = function() {
    $state.go('message');
  }

})


.controller('JobDetailCustomer', function( $ionicPlatform,$scope, $state, BASE_URL, localStorageService, $rootScope, $ionicHistory, $ionicLoading, $http, $ionicPopup) {
    
  $ionicPlatform.registerBackButtonAction(function(event) {
    $ionicHistory.goBack();
  },200);


  $scope.title = "Job Detail";

  $scope.myGoBack = function() {
    $ionicHistory.goBack();
  }

  $scope.go_job_applicants = function(id) {
    console.log(id);
    $rootScope.jo_id = id;
    console.log($rootScope.jo_id);
    $state.go('job_applicants');
  }

  $scope.job_dataa = function() {
    $userdata = localStorageService.get('customer_data');
    $scope.submitted = true;
    $scope.user_token = $userdata.user_token;
    var params = {
      'user_token': $userdata.user_token,
      'user_id': $userdata.id,
      'job_id': $rootScope.jobid,
      'user_type':"c"
    }
    $ionicLoading.show({
      template: '<ion-spinner icon="lines"></ion-spinner>'
    });
    var Url = BASE_URL + '/get_job_detail';
    var config = {
      headers: { 'Content-Type': 'application/json;' }
    };
    $http({
      method: 'POST',
      url: Url,
      data: params,
      transformRequest: function(obj) {
        var str = [];
        for (var p in obj)
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        return str.join("&");
      },
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).success(function(data) {
      console.log(data);
      $ionicLoading.hide();
      if (data.status == true) {
        $ionicLoading.hide();
        $scope.jobdata = data.data;
        console.log($scope.jobdata);
        $rootScope.jobtype = $scope.jobdata.price_type;
        // localStorageService.set('job_data', data.data);
        // $state.go('tab.home');
      } else {
        $ionicLoading.hide();
      }
    }).error(function(data) {
      console.log(data);
      $ionicLoading.hide();
       // $ionicPopup.alert({
      //    title: 'Message',
      //    template: data
      // });
   });
  }

  $scope.job_type = function() {
    if ($rootScope.jobtype == 'F') {
      $scope.pricetype = 'Fixed';
    } else {
      $scope.pricetype = 'Hourly';
    }
  }
  $scope.job_type();

  $scope.dataTypeCustomer = function(){
    console.log("data type customer");
  }

})


.controller('historyAlljobsCtrl', function($ionicPlatform,$cordovaToast,$rootScope,$scope, $state, BASE_URL, $cordovaDatePicker, localStorageService, $ionicHistory, $http, $ionicLoading, $ionicPopup, $ionicPlatform, ionicTimePicker) {

  $ionicPlatform.registerBackButtonAction(function(event) {
    $ionicHistory.goBack();
  },200);

  $scope.historyIn = function(){
    $ionicLoading.show({template: '<ion-spinner icon="lines"></ion-spinner>'});
    $userdata = localStorageService.get('customer_data');
    $http({
      method: 'POST',
      data: 'user_token=' + $userdata.user_token + '&c_id=' + $userdata.id,
      url: BASE_URL+'getJobStatusClient/',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).success(function(response){
      console.log(response);
      $ionicLoading.hide();
      if(response.status == false){
        $cordovaToast.showLongBottom(response.message).then(function(success) {
        }, function(error) {
        });
        if(response.message == "Session Expired!! Please login again."){
          localStorageService.remove('customer_data');
          $ionicHistory.clearCache().then(function() {
            $state.go('login'); 
          })
        }
      }else{
        $ionicLoading.hide();
        $scope.historydata = response.data;
      }
    }).error(function(error){
      $ionicLoading.hide();
      console.log(error.Message);
    });
  }

  $scope.doRefresh = function(){
    $userdata = localStorageService.get('customer_data');
    $http({
      method: 'POST',
      data: 'user_token=' + $userdata.user_token + '&c_id=' + $userdata.id,
      url: BASE_URL+'getJobStatusClient/',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).success(function(response){
      console.log(response);
      $ionicLoading.hide();
      if(response.status == false){
        $cordovaToast.showLongBottom(response.message).then(function(success) {
        },function(error) {
        });
      }else{
        $ionicLoading.hide();
        $scope.historydata = response.data;
      }
    }).error(function(error){
      $ionicLoading.hide();
      console.log(error.Message);
    }).finally(function() {
      $scope.$broadcast('scroll.refreshComplete');
    })  
  }

  $scope.job_detail_upcoming = function(id) {
    $rootScope.jo_id = id;
    $state.go('History_detail');
  } 

  $scope.inProgressC = function(id){
    $rootScope.jo_id = id;
    $state.go('History_detail');
  }

  $scope.job_detail_completedHis = function(id) {
    $rootScope.jo_id = id;
    $state.go('history_detail_completed');
    // $state.go('reciept');
  }  

  $scope.go_profile = function() {
    $state.go('profile');
  }

  $scope.go_message = function() {
    $state.go('message');
  }

})


.controller('historyjobsDetailsCtrl', function(IMG_URL,$ionicPlatform,$rootScope,$scope, $state, BASE_URL, $cordovaDatePicker, localStorageService, $ionicHistory, $http, $ionicLoading, $ionicPopup, $ionicPlatform, ionicTimePicker) {
 
  $ionicPlatform.registerBackButtonAction(function(event) {
    $ionicHistory.goBack();
  },200);

  $scope.myGoBack = function() {
    $ionicHistory.goBack();
  }

  $scope.img_url = IMG_URL;

  $userdata = localStorageService.get('customer_data');

  $scope.hisJobDetail = function(){
    $userdata = localStorageService.get('customer_data');
    $scope.submitted = true;
    $scope.user_token = $userdata.user_token;
    var params = {
      'user_token': $userdata.user_token,
      'user_id': $userdata.id,
      'job_id': $rootScope.jo_id,
      'user_type':"c"
    }
    $ionicLoading.show({
      template: '<ion-spinner icon="lines"></ion-spinner>'
    });
    var Url = BASE_URL + 'get_job_detail/';
    var config = {
      headers: { 'Content-Type': 'application/json;' }
    };
    $http({
      method: 'POST',
      url: Url,
      data: params,
      transformRequest: function(obj) {
        var str = [];
        for (var p in obj)
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        return str.join("&");
      },
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).success(function(data) {
      console.log(data);
      $ionicLoading.hide();
      if (data.status == true) {
        $ionicLoading.hide();
        $scope.jobdata = data.data;
        $scope.servicePdata = data.serviceprovider;

      } else {
        $ionicLoading.hide();
      }
    }).error(function(data) {
      console.log(data);
      // $ionicPopup.alert({
      //   title: 'Message',
      //   template: data
      // });
      $ionicLoading.hide();
   });
  }

  $scope.goMessageHis = function(id){
    console.log(id);
    $rootScope.usreId = id;
    console.log($rootScope.usreId);
    $state.go('conversations');
  }


})



.controller('historyjobsDetailsCompleteCtrl', function(IMG_URL,$ionicPlatform,$rootScope,$scope, $state, BASE_URL, $cordovaDatePicker, localStorageService, $ionicHistory, $http, $ionicLoading, $ionicPopup, $ionicPlatform, ionicTimePicker) {
 
  $ionicPlatform.registerBackButtonAction(function(event) {
    $ionicHistory.goBack();
  },200);

  $scope.myGoBack = function() {
    $ionicHistory.goBack();
  }

  $scope.img_url = IMG_URL;
  $userdata = localStorageService.get('customer_data');

    $scope.hisJobDetailCompleted = function(){
    $userdata = localStorageService.get('customer_data');
    $scope.submitted = true;
    $scope.user_token = $userdata.user_token;
    var params = {
      'user_token': $userdata.user_token,
      'user_id': $userdata.id,
      'job_id': $rootScope.jo_id,
      'user_type':"c"
    }
    $ionicLoading.show({
      template: '<ion-spinner icon="lines"></ion-spinner>'
    });
    var Url = BASE_URL + 'get_job_detail/';
    var config = {
      headers: { 'Content-Type': 'application/json;' }
    };
    $http({
      method: 'POST',
      url: Url,
      data: params,
      transformRequest: function(obj) {
        var str = [];
        for (var p in obj)
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        return str.join("&");
      },
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).success(function(data) {
      console.log(data);
      $ionicLoading.hide();
      if (data.status == true) {
        $ionicLoading.hide();
        $scope.jobdata = data.data;
        $scope.servicePdata = data.serviceprovider;

      } else {
        $ionicLoading.hide();
      }
    }).error(function(data) {
      console.log(data);
      // $ionicPopup.alert({
      //   title: 'Message',
      //   template: data
      // });
      $ionicLoading.hide();
   });
  }


  $scope.goMessageHisCom = function(id){
    $rootScope.usreId = id;
    $state.go('conversations');
  }

  $scope.viewServCompleted = function(id,u_id){
    console.log(u_id);
    $rootScope.userComIdProvid = u_id;
    $rootScope.jobIdCo = id;
    $state.go('reciept');
  }

})


.controller('postJobCtrl', function($ionicPlatform,$filter,$rootScope,$cordovaToast,$scope, $state, BASE_URL, $cordovaDatePicker, localStorageService, $ionicHistory, $http, $ionicLoading, $ionicPopup, $ionicPlatform, ionicTimePicker) {

  $ionicPlatform.registerBackButtonAction(function(event) {
    $ionicHistory.goBack();
  },200);

  $scope.user={};
  $scope.disableTap = function(){
    container = document.getElementsByClassName('pac-container');
    angular.element(container).attr('data-tap-disabled', 'true');
    angular.element(container).on("click", function(){
    document.getElementById('address').blur();
    })
  }

  $scope.setLatLong = function(lat,long){
    $scope.lat = lat;
    $scope.lng = long;
  }

  function initialize() {
      var input = document.getElementById('searchTextField');
      var options = {
      types: ['address']};
      var autocomplete = new google.maps.places.Autocomplete(input, options);
      google.maps.event.addListener(autocomplete, 'place_changed', function() {
        var place = autocomplete.getPlace();
        console.log(place);
        $scope.user.location = place.formatted_address;
        for (var i = 0; i < place.address_components.length; i++) {
          for (var j = 0; j < place.address_components[i].types.length; j++) {
            if(place.address_components[i].types[j] == "country") {
              $scope.country = place.address_components[i].long_name;
              console.log($scope.country);
            }
            if(place.address_components[i].types[j] == "locality") {
              $scope.city = place.address_components[i].long_name;
              console.log($scope.city);
            }
            else if(place.address_components[i].types[j] == "administrative_area_level_2"){
              $scope.city = place.address_components[i].long_name;
              console.log($scope.city);
            }
            // document.getElementById('cityLat').value = place.geometry.location.lat();
            // document.getElementById('cityLng').value = place.geometry.location.lng();
            // $scope.user.lat = place.geometry.location.lat();
            // $scope.user.lng = place.geometry.location.lng();
          }
        }
        // document.getElementById('searchTextField').value = place.formatted_address;
        document.getElementById('country').value = $scope.country;
        $scope.user.country = $scope.country;
        console.log($scope.user.country);
        document.getElementById('city').value = $scope.city;
        $scope.user.city = $scope.city;
        console.log($scope.user.city);
      });
    }
    google.maps.event.addDomListener(window, 'load', initialize);initialize();

    document.getElementById("date").classList.add("dateclass");

  var selectedDate;
  $scope.checkDate = function(){
    document.getElementById("date").classList.remove("dateclass");
    var selectedText = document.getElementById('date').value;
     $rootScope.selectedDate = new Date(selectedText);
     var date = new Date();
      date.setHours( 0,0,0,0 );
     $rootScope.now = date;
     if ( $rootScope.selectedDate < $rootScope.now) {
      alert("Start date should not be before today.");
     }
  }

  $scope.checkTime = function(){
    document.getElementById("time").classList.remove("dateclass");
  }

  $scope.create_job = function($dataa,$valid) {
    $scope.submitted = true;

    if($valid){

      if($rootScope.selectedDate < $rootScope.now) {
        alert("Start date should not be before today.");
        $dataa.job_date = "";
        return;
      }

      var tknd = localStorageService.get('customer_data');
      if(tknd.client_token != '' ){
        BraintreePlugin.initialize(tknd.client_token, function() {
        console.log("braintree");
      }, 
      function(error) {
        console.log(error);
      })
      }else{
        BraintreePlugin.initialize("sandbox_sy672pf7_tgwqcbt74d873v92", function() {
        }, 
        function(error) {
          console.log(error);
        })
      }
  
      var options = {amount: "", primaryDescription: "Purchase"};
      BraintreePlugin.presentDropInPaymentUI(options, function(result) {
        console.log(result);
        if(result.userCancelled) {
          console.log("User cancelled payment dialog"); 
          return;
        } else {
          console.log("Payment Nonce:" + result.nonce);
          $scope.nonce = result.nonce;
          console.log("Payment Result.", result);
          $rootScope.creJobData = $dataa;
          $userdata = localStorageService.get('customer_data');
          $dataa.user_token = $userdata.user_token;
          $dataa.user_id = $userdata.id;
          $dataa.nonce = $scope.nonce;
          $dataa.job_date = $filter('date')($dataa.job_date, "yyyy-MM-dd");
          $dataa.job_time = $dataa.job_time.getHours() + ':' + $dataa.job_time.getMinutes() + ':' + $dataa.job_time.getMilliseconds();
          $dataa.job_type = $dataa.jtyp;
          console.log($dataa.job_type);
          $ionicLoading.show({template: '<ion-spinner icon="lines"></ion-spinner>'});
          var Url = BASE_URL + 'create_job/';
          var config = {
            headers: { 'Content-Type': 'application/json;' }
          };
          $http({
            method: 'POST',
            url: Url,
            data: $dataa,
            transformRequest: function(obj) {
              var str = [];
              for (var p in obj)
              str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
              return str.join("&");
            },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
          }).success(function(data) {
            $ionicLoading.hide();
            if(data.status == true) {
              $ionicLoading.hide();
              $cordovaToast.showLongBottom(data.message).then(function(success) {
              }, function(error) {
              });
              localStorageService.set('customer_data', data.data);
              $state.go('tab.home');
            } else {
              $ionicLoading.hide();
            }
          }).error(function(err) {
            $ionicLoading.hide();
            console.log(err);
          });
        }
      })
    }else{
      $cordovaToast.showLongBottom("Fill required field").then(function(success) {
      }, function(error) {
      });
    }
  }


  $scope.showHideTest = false;
  $scope.showHideTestB = false;
  $scope.showdiv = function(value) {
    $scope.value = value;
    if (value == 'H') {
      $scope.showHideTest = true;
      $scope.showHideTestB = false;
    } else {
      $scope.showHideTest = false;
      $scope.showHideTestB = true; 
    }
  }

  $scope.job_detail_hird = function() {
    $state.go('job_detail_hired');
  }

  $scope.job_detail_applied = function() {
    $state.go('job_detail_applied');
  }

  $scope.go_profile = function() {
    $state.go('profile');
  }

  $scope.go_message = function() {
    $state.go('message');
  }

})

.controller('JobDetailHisCtrl', function($ionicPlatform,$rootScope,$scope,$state,BASE_URL,$cordovaDatePicker,localStorageService,$ionicHistory,$http,$ionicLoading,$ionicPopup,$ionicPlatform,ionicTimePicker) {
  console.log("History Job Details");
  
  $ionicPlatform.registerBackButtonAction(function(event) {
    $ionicHistory.goBack();
  },200);

  $scope.myGoBack = function() {
    $ionicHistory.goBack();
  };

  $scope.olJobDetailUpInCom = function(){
    $ionicLoading.show({template: '<ion-spinner icon="lines"></ion-spinner>'});
    $userdata = localStorageService.get('customer_data');
    $http({
      method: 'POST',
      data: 'user_token=' + $userdata.user_token + '&user_id=' + $userdata.id + '&job_id=' + $rootScope.jo_id + '&user_type=' + 'c',
      url: BASE_URL+'/get_job_detail',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).success(function(response){
      $ionicLoading.hide();
      if(response.status == false){
        $ionicLoading.hide();
        $cordovaToast.showLongBottom(response.message).then(function(success) {
        }, function(error) {
        });
      }else{
        $ionicLoading.hide();
        $scope.hisJoDetail = response.data;
      }
    }).error(function(error){
      $ionicLoading.hide();
      console.log(error.Message);
    });
  }

})


.controller('JobApplicants', function($ionicPlatform,$cordovaToast,$location,$ionicHistory,BASE_URL,$http,$ionicLoading,$rootScope,localStorageService,$scope, $state, $ionicHistory) {
 
  $ionicPlatform.registerBackButtonAction(function(event) {
    $ionicHistory.goBack();
  },200);

  $scope.myGoBack = function() {
    $ionicHistory.goBack();
  };

  $scope.go_other = function(id) { 
    $rootScope.other_user_id = id;
    $location.url('other_profile'); 
  }

  $scope.appliCiants = function(){
    console.log($scope.ratingArr.length);
    $userdata = localStorageService.get('customer_data');
    $ionicLoading.show({template: '<ion-spinner icon="lines"></ion-spinner>'});
    $http({
      method: 'POST',
      data: 'user_token=' + $userdata.user_token + '&user_id=' + $userdata.id+ '&job_id=' + $rootScope.jo_id,
      url: BASE_URL+'/view_job_applicants',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).success(function(response){
      console.log(response);
      $ionicLoading.hide();
      if(response.status == false){
        $cordovaToast.showLongBottom("There is no Applicant").then(function(success) {
        },function(error) {
        });
      }else{
        $ionicLoading.hide();
        $scope.applicAnts = response.data;
      }  
        $ionicLoading.hide();
    }).error(function(error){
        $ionicLoading.hide();
    });
  }

  $scope.doRefresh = function(){
    $userdata = localStorageService.get('customer_data');
    $http({
      method: 'POST',
      data: 'user_token=' + $userdata.user_token + '&user_id=' + $userdata.id+ '&job_id=' + $rootScope.jo_id,
      url: BASE_URL+'/view_job_applicants',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).success(function(response){
      if(response.status == false){
        $cordovaToast.showLongBottom("There Is no Applicants").then(function(success) {
        },function (error) {
        }); 
      }else{
        $scope.applicAnts = response.data;
      }  
    }).error(function(error){
       $ionicLoading.hide();
    }).finally(function() {
      $scope.$broadcast('scroll.refreshComplete');
    })  
  }

  $scope.ratingArr = [{
    value: 1,
    icon: 'ion-ios-star-outline',
    question: 1
  }, {
    value: 2,
    icon: 'ion-ios-star-outline',
    question: 2
  }, {
    value: 3,
    icon: 'ion-ios-star-outline',
    question: 3
  }, {
    value: 4,
    icon: 'ion-ios-star-outline',
    question: 4
  }, {
    value: 5,
    icon: 'ion-ios-star-outline',
    question: '5'
  }];

  $scope.setRating = function(question,val) {
    var rtgs = $scope.ratingArr;
    for (var i = 0; i < rtgs.length; i++) {
      if (i < val) {
        rtgs[i].icon = 'ion-ios-star';
      } else {
        rtgs[i].icon = 'ion-ios-star-outline';
      }
    };
    $scope.question = question;
  }


})


.controller('profileCtrl', function($ionicPopup,$ionicPlatform,IMG_URL,$scope, $state, $rootScope, localStorageService, $ionicHistory) {    
  $scope.img_url = IMG_URL;

  $ionicPlatform.registerBackButtonAction(function(event) {
    $ionicHistory.goBack();
  },200);


  $scope.myGoBack = function() {
    $ionicHistory.goBack();
  };

  $scope.go_edit_profile = function() {
    $state.go('edit_profile');
  }

  $scope.profiledata = function() {
    console.log("localStorage user data");
    $scope.userdataa = localStorageService.get('customer_data');
  }

  $scope.logout = function() {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Logout',
      cssClass:'logout_popup',
      template: 'Are you sure you want to logout'
    });
    confirmPopup.then(function(res) {
      if(res) {
        localStorageService.remove('customer_data');
        $ionicHistory.clearCache().then(function() {
          $state.go('login'); 
        })
      }else {
        console.log('You are not sure');
      }
    })
  }

  $scope.changePassword = function(){
    $state.go('change_password');
  }

})

.controller('editprofileCtrl', function($ionicHistory,$ionicPlatform,IMG_URL,$scope, $rootScope, $timeout, $ionicActionSheet, $state, $ionicPopup, $cordovaCamera, $ionicLoading, $http, BASE_URL, localStorageService, $cordovaFileTransfer) {


  $ionicPlatform.registerBackButtonAction(function(event) {
    $ionicHistory.goBack();
  },200);

  $scope.user = {};
  $scope.img_url = IMG_URL;

  $scope.base_url = BASE_URL;
  $scope.userdataa = localStorageService.get('customer_data');
  $scope.user = $scope.userdataa;

  function initialize() {
      var input = document.getElementById('searchTextField');
      var options = {
      types: ['address']};
      var autocomplete = new google.maps.places.Autocomplete(input, options);
      google.maps.event.addListener(autocomplete, 'place_changed', function() {
        var place = autocomplete.getPlace();
        console.log(place);
        $scope.user.city = place.formatted_address;
        for (var i = 0; i < place.address_components.length; i++) {
          for (var j = 0; j < place.address_components[i].types.length; j++) {
            if (place.address_components[i].types[j] == "country") {
              $scope.country = place.address_components[i].long_name;
              console.log($scope.country);
            }
            if (place.address_components[i].types[j] == "administrative_area_level_2") {
              $scope.city = place.address_components[i].long_name;
              console.log($scope.city);
            }
          }
        }
        // document.getElementById('country').value = $scope.country;
        // $scope.user.country = $scope.country;
        // console.log($scope.user.country);
        // document.getElementById('city').value = $scope.city;
        // $scope.user.city = $scope.city;
        // console.log($scope.user.city);
      });
    }
    google.maps.event.addDomListener(window, 'load', initialize);initialize();


  $scope.disableTap = function(){
    container = document.getElementsByClassName('pac-container');
    angular.element(container).attr('data-tap-disabled', 'true');
    angular.element(container).on("click", function(){
      document.getElementById('searchTextField').blur();
    })
  }

  $scope.setLatLong = function(lat,long){
    $scope.lat = lat;
    $scope.lng = long;
  }


  $scope.edit_profile = function($dataa,$valid) {
    $userdata = localStorageService.get('customer_data');
    $scope.submitted = true;
    $ionicLoading.show({
      template: '<ion-spinner icon="lines"></ion-spinner>'
    });
    var url = BASE_URL+'update_profile/';
    if ($valid) {
      if ($rootScope.my_profile_image) {
        console.log($rootScope.my_profile_image);
        var targetPath = $rootScope.my_profile_image;
        var filename = targetPath.split("/").pop();
        filename = filename.split('?');
        console.log(filename);
        var options = {
          fileKey: "pic",
          fileName: filename[0],
          chunkedMode: false,
          mimeType: "image/jpg",
        };
        var params = {};
        params.email = $dataa.email;
        params.user_token = $userdata.user_token;
        params.user_id = $dataa.id;
        params.user_type = $dataa.user_type;
        params.about_me = $dataa.about_me;
        params.city = $dataa.city;
        //params.pic = $rootScope.my_profile_image;
        options.params = params;
        console.log(params);
        $cordovaFileTransfer.upload(url, targetPath, options).then(function(result) {
          var hh = JSON.parse(result.response);
          if(hh.status == true) {
            $ionicLoading.hide();
            localStorageService.set('customer_data', hh.data);
            $state.go('profile');
          } else {
            $ionicLoading.hide();
            return false;
          //   $ionicPopup.alert({
          //   title: 'Fail',
          //   template: hh.message
          // });
          //   $ionicLoading.hide();
          //   return false;
          }
        },function(err) {
          $scope.imgURI = undefined;
          // $ionicPopup.alert({
          //   title: 'Message',
          //   template: err.msg
          // });
          $ionicLoading.hide();
        }, function(progress) {
          $ionicLoading.show({
            template: '<ion-spinner icon="lines"></ion-spinner>'
          });
          $timeout(function() {
           $scope.downloadProgress = (progress.loaded / progress.total) * 100;
          })
        });
      }else {
        $dataa.user_token = $userdata.user_token;
        $dataa.user_id = $userdata.id;
        var config = {
          headers: { 'Content-Type': 'application/json;' }
        };
        $http({
          method: 'POST',
          url: url,
          data: $dataa,
          transformRequest: function(obj) {
            var str = [];
            for (var p in obj)
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            return str.join("&");
          },
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function(data) {
          $ionicLoading.hide();
          if (data.status == true) {
              $ionicLoading.hide();
              localStorageService.set('customer_data', data.data);
              console.log(data.data);
              $state.go('profile');
          } else {
              $ionicLoading.hide();
          }
        }).error(function(data) {
          $ionicLoading.hide();
          console.log(data);
          // $ionicPopup.alert({
          //   title: 'Message',
          //   template: data
          // });
        });
      }
    }
  }

  $scope.chooseimage = function() {
    var hideSheet = $ionicActionSheet.show({
      buttons: [
        { text: 'Take Photo' },
        { text: 'Take Photo from albums' }
      ],
      titleText: 'Select photos from',
      cancelText: 'Cancel',
      cancel: function() {
        hideSheet();
      },
      buttonClicked: function(index) {
        if (index == 0) {
          takePicture2({
            quality: 80,
            allowEdit: true,
            targetWidth: 500,
            targetHeight: 500,
            sourceType: Camera.PictureSourceType.CAMERA,
            encodingType: Camera.EncodingType.JPEG,
            destinationType: Camera.DestinationType.FILE_URI
          }); 
        }else if (index == 1) {
          takePicture2({
            quality: 80,
            allowEdit: true,
            targetWidth: 500,
            targetHeight: 500,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            encodingType: Camera.EncodingType.JPEG,
            destinationType: Camera.DestinationType.FILE_URI,
            MediaType: Camera.MediaType.PICTURE
          });
        }else {
          return true;
        }
        hideSheet();
      }
    });
  }
    
  var takePicture2 = function(options) {
    $cordovaCamera.getPicture(options).then(function(imageURI) {
      $scope.imageURI = imageURI;
      $rootScope.my_profile_image = imageURI;
      console.log($rootScope.my_profile_image);
    }, function(err) {

    });
  }

})


////////////////change password////////////////////
.controller('changePassCtrl', function($ionicPlatform,$cordovaToast,$ionicHistory,$scope, $rootScope, $timeout, $ionicActionSheet, $state, $ionicPopup, $cordovaCamera, $ionicLoading, $http, BASE_URL, localStorageService, $cordovaFileTransfer) {

  $ionicPlatform.registerBackButtonAction(function(event) {
    $ionicHistory.goBack();
  },200);

  $scope.myGoBack = function() {
    $ionicHistory.goBack();
  }

  $userdata = localStorageService.get('customer_data');

  $scope.changePassword = function(data,valid){
    $scope.submitted = true;
    console.log(data.oldPassword);
    if(valid){
      $ionicLoading.show({template: '<ion-spinner icon="lines"></ion-spinner>'});
      $userdata = localStorageService.get('customer_data');
      $http({
        method: 'POST',
        data: 'user_token=' + $userdata.user_token + '&user_id=' + $userdata.id + '&oldPassword=' + data.oldPassword + '&newPassword=' + data.newPassword,
        url: BASE_URL+'/changePassword',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }).success(function(response){
        console.log(response);
        $ionicLoading.hide();
        if(response.status == false){
          $cordovaToast.showLongBottom(response.message).then(function(success) {
          }, function(error) {
          });
        }else{
          console.log("success")
          $ionicLoading.hide();
          $state.go('profile');
        }
      }).error(function(error){
        $ionicLoading.hide();
      });
    }else{
      $cordovaToast.showLongBottom("Please fill required fields").then(function(success) {
      }, function(error) {
      });
    }
  }


})

.controller('forgotPasswordCtrl', function($ionicPlatform,$cordovaToast,$ionicHistory,$scope, $rootScope, $timeout, $ionicActionSheet, $state, $ionicPopup, $cordovaCamera, $ionicLoading, $http, BASE_URL, localStorageService, $cordovaFileTransfer) {

  $ionicPlatform.registerBackButtonAction(function(event) {
    $ionicHistory.goBack();
  },200);

  $scope.myGoBack = function() {
    $ionicHistory.goBack();
  }

  $scope.forgotPassword = function(data,valid){
    $scope.submitted = true;
    if(valid){
      $ionicLoading.show({template: '<ion-spinner icon="lines"></ion-spinner>'});
      $http({
        method: 'POST',
        data: 'email=' + data.email,
        url: BASE_URL+'forgot_password',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }).success(function(response){
        $ionicLoading.hide();
        if(response.status == false){
          $cordovaToast.showLongBottom(response.message).then(function(success) {
          }, function(error) {
          });
        }else{
          $cordovaToast.showLongBottom(response.message).then(function(success) {
          }, function(error) {
          });
          $ionicLoading.hide();
          $state.go('login');
        }
      }).error(function(error){
        $ionicLoading.hide();
      });
    }else{
      $cordovaToast.showLongBottom("Please fill required fields").then(function(success) {
      }, function(error) {
      });
    }
  }

})
                                

.controller('RatingCtrl', function(IMG_URL,$ionicPlatform,$filter,$rootScope,$cordovaToast,$scope, $state, BASE_URL, $cordovaDatePicker, localStorageService, $ionicHistory, $http, $ionicLoading, $ionicPopup, $ionicPlatform, ionicTimePicker) {
  
  $scope.img_url = IMG_URL;

  $ionicPlatform.registerBackButtonAction(function(event) {
    $ionicHistory.goBack();
  },200);

  $scope.ratting = "View ratting";

  $scope.ratingArr = [{
    value: 1,
    icon: 'ion-ios-star-outline',
    question: 1
  }, {
    value: 2,
    icon: 'ion-ios-star-outline',
    question: 2
  }, {
    value: 3,
    icon: 'ion-ios-star-outline',
    question: 3
  }, {
    value: 4,
    icon: 'ion-ios-star-outline',
    question: 4
  }, {
    value: 5,
    icon: 'ion-ios-star-outline',
    question: '5'
  }];

  $scope.setRating = function(question,val) {
    console.log(question);
    console.log(val);
    var rtgs = $scope.ratingArr;
    for (var i = 0; i < rtgs.length; i++) {
      if (i < val) {
        rtgs[i].icon = 'ion-ios-star';
      } else {
        rtgs[i].icon = 'ion-ios-star-outline';
      }
    };
    $scope.question = question;
  }


  $scope.getProviderData = function(){
    $userdata = localStorageService.get('customer_data');
    $ionicLoading.show({template: '<ion-spinner icon="lines"></ion-spinner>'});
    $http({
      method: 'POST',
      data: 'user_token=' + $userdata.user_token + '&user_id=' + $userdata.id+ '&other_user_id=' + $rootScope.userComIdProvid,
      url: BASE_URL+'/view_user_detail',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).success(function(response){
      console.log(response);
      $scope.otherProData = response.data;
      $ionicLoading.hide();
    }).error(function(error){
      $ionicLoading.hide();
      console.log(error.Message);
    });
  }

  $scope.show = false;

  $scope.rateProvider = function(comment,question){
    if(question == undefined){
      $cordovaToast.showLongBottom("Please rate your provider").then(function(success) {
      },function (error) {
      });
      return;
    }
    $userdata = localStorageService.get('customer_data');
    $ionicLoading.show({template: '<ion-spinner icon="lines"></ion-spinner>'});
    $http({
      method: 'POST',
      data: 'user_token=' + $userdata.user_token + '&user_id=' + $userdata.id+ '&receiver_id=' + $rootScope.userComIdProvid+ '&job_id='+$rootScope.jobIdCo+ '&rating='+ $scope.question+ '&msg='+ comment,
      url: BASE_URL+'add_rating',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).success(function(response){
      console.log(response);
      $ionicLoading.hide();
      $state.go('tab.home');
      $cordovaToast.showLongBottom("Succesfully Ratted").then(function(success) {
      },function (error) {
      })
    }).error(function(error){
      $ionicLoading.hide();
      console.log(error.Message);
      console.log("Error-message");
    });
  }

})


.controller('recieptCtrl', function($ionicPlatform,$filter,$cordovaToast,$ionicHistory,$scope, $rootScope, $timeout, $ionicActionSheet, $state, $ionicPopup, $cordovaCamera, $ionicLoading, $http, BASE_URL, localStorageService, $cordovaFileTransfer) {
    
  $ionicPlatform.registerBackButtonAction(function(event) {
    $ionicHistory.goBack();
  },200);

  $scope.myGoBack = function() {
    $ionicHistory.goBack();
  }

  $scope.chat_go = function() {
    $state.go('job_detail_completed');
  }

  $scope.value = function(){
    console.log("value");
  }

  var token = localStorageService.get('user_token');
  var status = localStorageService.get('user_status');
  var job_status = localStorageService.get('job_status_user');
  var ratting_status = localStorageService.get('rating_status');

  $scope.receiptIn = function(){
    console.log($rootScope.jobIdCo);
    $userdata = localStorageService.get('customer_data');
    console.log($userdata);
    $ionicLoading.show({template: '<ion-spinner icon="lines"></ion-spinner>'});
    $http({
      method: 'POST',
      data: 'user_token=' + $userdata.user_token+ '&user_id=' + $userdata.id+ '&job_id=' + $rootScope.jobIdCo,
      url: BASE_URL+'getReceipt',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).success(function(response){
      $ionicLoading.hide();
      console.log(response);
      $scope.receiptData = response.data;
      $scope.rateCheck = response;
      console.log($scope.rateCheck);
      $scope.s_job = $scope.receiptData.start_job;
      $scope.e_job = $scope.receiptData.end_job;
      $scope.s_job = $filter('date')(new Date($scope.s_job.split('-').join('/')), "d MMMM yyyy");
      $scope.e_job = $filter('date')(new Date($scope.e_job.split('-').join('/')), "d MMMM yyyy");
      // $cordovaToast.showLongBottom(response.message).then(function(success) {
      //   console.log(success);
      // },function (error) {
      //   console.log(error);
      // });
    }).error(function(error){
      $ionicLoading.hide();
      console.log(error.Message);
    }); 
  }

  ///////////// payment api //////////////
  $scope.go_payment = function(id,total_amount) {
    
    if(total_amount == "0"){
      $cordovaToast.showLongBottom("No Amount").then(function(success) {
      }, function(error) {
      });
      return;
    }

    var payM = localStorageService.get('customer_data');
    console.log(payM);
    if(payM.client_token != '' ){
      BraintreePlugin.initialize(payM.client_token, function() {
      console.log("braintree");
    }, 
    function(error) {
      console.log(error);
    })
    }else{
      BraintreePlugin.initialize("sandbox_sy672pf7_tgwqcbt74d873v92", function() {
      }, 
      function(error) {
        console.log(error);
      })
    }

    $userdata = localStorageService.get('customer_data');
    $scope.amount = total_amount;
    var options = { amount: $scope.amount, primaryDescription: "Purchase"};
    BraintreePlugin.presentDropInPaymentUI(options, function(result) {
      console.log(result);
      if (result.userCancelled) {
        return;
        console.log("User cancelled payment dialog."); 
      } else {
        console.log("Payment Nonce:" + result.nonce);
        $scope.nonce = result.nonce;
        $ionicLoading.show({template: '<ion-spinner icon="lines"></ion-spinner>'});
        $http({
          method: 'POST',
          data: 'user_token=' + $userdata.user_token + '&user_id=' + $userdata.id+ '&job_id=' + $rootScope.jobIdCo+ '&nonce=' + $scope.nonce + '&amount=' + total_amount,
          url: BASE_URL+'make_payment_after_complete_job/',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function(response){
          console.log(response);
          $ionicLoading.hide();
          $cordovaToast.showLongBottom("Succesfully paymented").then(function(success) {
          },function (error) {
          });
          $state.go('rating');
        }).error(function(error){
          $ionicLoading.hide();
          $cordovaToast.showLongBottom(response.message).then(function(success) {
          },function (error) {
          });
        }); 
      }
    })
  }

  $scope.gorate = function(){
    console.log($rootScope.jobIdCo);
    $state.go("rating");
  }
  // console.log(id);
  // $rootScope.jId = id;
  // $state.go('payment_option');

})

///////////////////paypal controller//////////////////
.controller('makePayAddCardCtrl', function($ionicPlatform,$ionicLoading,BASE_URL,$http,$location,$scope, $state, $ionicHistory,$cordovaToast,$rootScope,localStorageService) {

  $ionicPlatform.registerBackButtonAction(function(event) {
    $ionicHistory.goBack();
  },200);

  $scope.myGoBack = function() {
    $ionicHistory.goBack();
  }

  $scope.addCardMakePay = function(data){
    console.log($rootScope.creJobData);
    console.log(data);
  }

})

.controller('newcardCtrl', function($ionicPlatform,localStorageService,$ionicLoading,BASE_URL,$http,$location,$scope, $state, $ionicHistory,$cordovaToast,$rootScope) {
  
  $ionicPlatform.registerBackButtonAction(function(event) {
    $ionicHistory.goBack();
  },200);

  console.log("newCardCtrl");

})

.controller('settingCtrl', function($ionicPlatform,$cordovaToast,$rootScope,localStorageService,$ionicLoading,BASE_URL,$http,$location,$scope, $state, $ionicHistory) {
 
  $ionicPlatform.registerBackButtonAction(function(event) {
    $ionicHistory.goBack();
  },200);


  $userdata = localStorageService.get('customer_data');
   console.log($userdata);

  if($userdata.notification == 'n') {
    $scope.pushNotification = {checked: false};
  } else {
    $scope.pushNotification = {checked: true};
  }

  $scope.pushNotificationChange = function(pushNotification) {
    console.log(pushNotification);
    if (pushNotification == true) {
      val = 'y'
    } else {
      val = 'n'
    }
    $userdata = localStorageService.get('customer_data');
    console.log($userdata);
    $ionicLoading.show({template: '<ion-spinner icon="lines"></ion-spinner>'});
    $http({
      method: 'POST',
      data: 'user_token=' + $userdata.user_token + '&user_id=' + $userdata.id + '&notification=' + val,
      url: BASE_URL + 'notification',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).success(function(response) {
      $ionicLoading.hide();
      console.log(response);
      localStorageService.set('customer_data',response.data);
    }).error(function(error) {
      console.log(error);
      $ionicLoading.hide();
      console.log(error.Message);
    });
  }



})


////////////////user profile/////////////
.controller('otherProfileCtrl', function($ionicPlatform,IMG_URL,$cordovaToast,$rootScope,localStorageService,$ionicLoading,BASE_URL,$http,$location,$scope, $state, $ionicHistory) {

  $ionicPlatform.registerBackButtonAction(function(event) {
    $ionicHistory.goBack();
  },200);

  $scope.img_url = IMG_URL;
  $scope.base_url = BASE_URL;
  
  $scope.otherPro = "";
  $scope.getOtherPro = function(){
    $userdata = localStorageService.get('customer_data');
    $ionicLoading.show({template: '<ion-spinner icon="lines"></ion-spinner>'});
    $http({
      method: 'POST',
      data: 'user_token=' + $userdata.user_token + '&user_id=' + $userdata.id+ '&other_user_id=' + $rootScope.other_user_id,
      url: BASE_URL+'/view_user_detail',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).success(function(response){
      console.log(response);
      $ionicLoading.hide();
      $scope.otherPro = response.data;
      $scope.rewiew = response;
    }).error(function(error){
      $ionicLoading.hide();
      console.log(error.Message);
    }); 
  }

  $scope.hireProvider = function(id){
    //var other_user_id = $location.search().other_user_id;
    console.log($rootScope.jobid);
    $userdata = localStorageService.get('customer_data');
    console.log($userdata);
    $ionicLoading.show({template: '<ion-spinner icon="lines"></ion-spinner>'});
    $http({
      method: 'POST',
      data: 'user_token=' + $userdata.user_token + '&user_id=' + $userdata.id+ '&job_id=' + $rootScope.jobid+ '&other_user_id=' + $rootScope.other_user_id,
      url: BASE_URL+'hire_service_provider',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).success(function(response){
      console.log(response);
      $ionicLoading.hide();
      $cordovaToast.showLongBottom(response.message).then(function(success) {
      },function (error) {
      });
      $state.go('tab.History');
    }).error(function(error){
        console.log(error.Message);
        $ionicLoading.hide();
    }); 
  }

  $scope.goReview = function(id){
    $rootScope.proReview = id;
    $state.go("review");
  }

  $scope.messageProvider = function(id){
    console.log(id);
    $rootScope.usreId = id;
    $state.go('conversations');
  }


})


.controller('reviewProfileCtrl', function($ionicPlatform,IMG_URL,$cordovaToast,$rootScope,localStorageService,$ionicLoading,BASE_URL,$http,$location,$scope, $state, $ionicHistory) {

  $ionicPlatform.registerBackButtonAction(function(event) {
    $ionicHistory.goBack();
  },200);

  $scope.myGoBack = function() {
    $ionicHistory.goBack();
  }

  $scope.img_url = IMG_URL;
  $scope.base_url = BASE_URL;

  $scope.readReview = function(){
    $ionicLoading.show({template: '<ion-spinner icon="lines"></ion-spinner>'});
    $userdata = localStorageService.get('customer_data');
    $http({
      method: 'POST',
      data: 'user_token=' + $userdata.user_token + '&user_id=' + $userdata.id + '&receiver_id=' + $rootScope.proReview,
      url: BASE_URL+'get_rating',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).success(function(response){
      $ionicLoading.hide();
      if(response.status == false){
        $cordovaToast.showLongBottom(response.message).then(function(success) {
        },function(error) {
        });
      }else{
        $ionicLoading.hide();
        $scope.allReviews = response.data;
        console.log($scope.allReviews);
      }
    }).error(function(error){
      $ionicLoading.hide();
      console.log(error.Message);
    });
  }

  $scope.go_profile = function() {
    $state.go('profile');
  }

  $scope.go_message = function() {
    $state.go('message');
  }


})


/////////////Message contrpller/////////////
.controller('MessageCtrl', function($cordovaToast,IMG_URL,$ionicPlatform,$ionicScrollDelegate,$scope, $state, BASE_URL, localStorageService, $rootScope, $ionicHistory, $ionicLoading, $http, $ionicPopup) {
      
  $ionicPlatform.registerBackButtonAction(function(event) {
    $ionicHistory.goBack();
  },200);

  $scope.myGoBack = function() {
    $ionicHistory.goBack();
  }

  $scope.img_url = IMG_URL;

  $scope.Getmessages = function(){
    $ionicLoading.show({template: '<ion-spinner icon="lines"></ion-spinner>'});
      $userdata = localStorageService.get('customer_data');
      $http({
        method: 'POST',
        data: 'user_token=' + $userdata.user_token + '&user_id=' + $userdata.id,
        url: BASE_URL+'getLastChat',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }).success(function(response){
        $ionicLoading.hide();
        if(response.status == false){
          $cordovaToast.showLongBottom(response.message).then(function(success) {
          }, function(error) {
          });
        }else{
          $ionicLoading.hide();
          $scope.allMessages = response.data;
          console.log($scope.allMessages);
          $ionicLoading.hide();
        }
      }).error(function(error){
        $ionicLoading.hide();
        console.log(error.Message);
      });
  }

  $scope.doRefresh = function() {
    $userdata = localStorageService.get('customer_data');
    $http({
      method: 'POST',
      data: 'user_token=' + $userdata.user_token + '&user_id=' + $userdata.id,
      url: BASE_URL+'getLastChat',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).success(function(response){
      if(response.status == false){
        $ionicLoading.hide();
        $cordovaToast.showLongBottom(response.message).then(function(success) {
        }, function(error) {
        });
      }else{
        $scope.allMessages = response.data;
      }
    }).error(function(error){
      console.log(error);
    }).finally(function() {
      $scope.$broadcast('scroll.refreshComplete');
    }) 
  }

  $scope.chat_go = function(id) {
    $rootScope.usreId = id;
    $state.go('conversations');
  }


})


.controller('ChatsCtrl', function($ionicScrollDelegate,$timeout,$interval,$ionicPlatform,$ionicScrollDelegate,$scope, $state, BASE_URL, localStorageService, $rootScope, $ionicHistory, $ionicLoading, $http, $ionicPopup) {
    
  $ionicPlatform.registerBackButtonAction(function(event) {
    $ionicHistory.goBack();
  },200);

  $scope.myGoBack = function() {
    $ionicHistory.goBack();
  }

  // var intervalPromise = $interval(function() {
  //   console.log($rootScope.usreId);
  //   $scope.othr_id = $rootScope.usreId;
  //   $userdata = localStorageService.get('customer_data');
  //   $scope.my_id = $userdata.id;
  //   $http({
  //     method: 'POST',
  //     data: 'user_token=' + $userdata.user_token + '&reciver_id=' + $rootScope.usreId+ '&sender_id=' + $userdata.id,
  //     url: BASE_URL+'/getChat',
  //     headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  //   }).success(function(response){
  //     console.log(response);
  //     $scope.chatDta = response.data;
  //     $ionicScrollDelegate.scrollBottom();
  //   }).error(function(error){
  //     console.log(error.Message);
  //   })
  // },6000);

  $rootScope.chatConverCus = function(){
    $ionicScrollDelegate.scrollBottom(true);
    console.log($rootScope.usreId);
    $scope.othr_id = $rootScope.usreId;
    $userdata = localStorageService.get('customer_data');
    $scope.my_id = $userdata.id;
    $http({
      method: 'POST',
      data: 'user_token=' + $userdata.user_token + '&reciver_id=' + $rootScope.usreId+ '&sender_id=' + $userdata.id,
      url: BASE_URL+'getChat',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).success(function(response){
      $ionicLoading.hide();
      console.log(response);
      $scope.chatDta = response.data;
      $ionicScrollDelegate.scrollBottom(true);
    }).error(function(error){
      $ionicLoading.hide();
      console.log(error.Message);
    })
  }

  $scope.sendMessage = function(data){
    $userdata = localStorageService.get('customer_data');
    $http({
      method: 'POST',
      data: 'user_token=' + $userdata.user_token + '&reciver_id=' + $rootScope.usreId+ '&sender_id=' + $userdata.id+ '&message=' + data,
      url: BASE_URL+'chat',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).success(function(response){
      $ionicLoading.hide();
      console.log(response);
      $scope.chatDta = response.data;
      $ionicScrollDelegate.scrollBottom(true);
      // $rootScope.chatConverCus();
    }).error(function(error){
      $ionicLoading.hide();
      console.log(error.Message);
    }); 
  }

  $scope.inputUp = function(){
    $timeout(function(){
      $ionicScrollDelegate.scrollBottom(true);
    }, 1000);
  }

  $scope.inputDown = function(){
    $timeout(function(){
      $ionicScrollDelegate.resize();
    }, 1000);
  }

  // var ionicLoading = {{template: '<ion-spinner icon="lines"></ion-spinner>'}}

})


//////////////payment controller//////////////
.controller('paymentCtrl', function($ionicPlatform,$ionicScrollDelegate,$scope, $state, BASE_URL, localStorageService, $rootScope, $ionicHistory, $ionicLoading, $http, $ionicPopup) {
    
  $ionicPlatform.registerBackButtonAction(function(event) {
    $ionicHistory.goBack();
  },200);

  $scope.myGoBack = function() {
    $ionicHistory.goBack();
  }

  $scope.go_card = function() {
    $state.go('make_pay_add_card');
  }

  $scope.go_paypal1 = function() {
      
  }

  $scope.rValue = function(value){
    console.log(value);
    $scope.lastDi = value;
  }

})


.controller('notificationCtrl', function(IMG_URL,$interval,$ionicPlatform,$ionicScrollDelegate,$scope, $state, BASE_URL, localStorageService, $rootScope, $ionicHistory, $ionicLoading, $http, $ionicPopup) {
    
  $ionicPlatform.registerBackButtonAction(function(event) {
    $ionicHistory.goBack();
  },200);

  $scope.img_url = IMG_URL;

  $scope.myGoBack = function() {
    $ionicHistory.goBack();
  }

  $scope.go_profile = function() {
    $state.go('profile');
  }

  $scope.go_message = function() {
    $state.go('message');
  }

  $scope.GetNotification = function(){
    $userdata = localStorageService.get('customer_data');
    $http({
      method: 'POST',
      data: 'user_token=' + $userdata.user_token + '&user_id=' + $userdata.id,
      url: BASE_URL+'notification_history',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).success(function(response){
      console.log(response);
      $ionicLoading.hide();
      $scope.notiHis = response.data;
    }).error(function(error){
      $ionicLoading.hide();
      console.log(error.Message);
    })
  }

  $scope.goHis = function(id){
    $userdata = localStorageService.get('customer_data');
    $http({
      method: 'POST',
      data: 'user_token=' + $userdata.user_token + '&user_id=' + $userdata.id + '&notification_id=' + id,
      url: BASE_URL+'read_notification',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).success(function(response){
      console.log(response);
      $ionicLoading.hide();
       $state.go("tab.History");
    }).error(function(error){
      $ionicLoading.hide();
      console.log(error.Message);
    })
   
  }

  $scope.goHome = function(id){
    $userdata = localStorageService.get('customer_data');
    $http({
      method: 'POST',
      data: 'user_token=' + $userdata.user_token + '&user_id=' + $userdata.id + '&notification_id=' + id,
      url: BASE_URL+'read_notification',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).success(function(response){
      console.log(response);
      $ionicLoading.hide();
      $state.go('tab.home');
    }).error(function(error){
      $ionicLoading.hide();
      console.log(error.Message);
    })
  }

  $scope.goChat = function(id){
    $userdata = localStorageService.get('customer_data');
    $http({
      method: 'POST',
      data: 'user_token=' + $userdata.user_token + '&user_id=' + $userdata.id + '&notification_id=' + id,
      url: BASE_URL+'read_notification',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).success(function(response){
      console.log(response);
      $ionicLoading.hide();
      $state.go("message");
    }).error(function(error){
      $ionicLoading.hide();
      console.log(error.Message);
    })
  }

})
//////////////////////////////////////////////////////////////////////////////////////


