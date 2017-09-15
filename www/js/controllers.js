angular.module('starter.controllers', ['LocalStorageModule'])

.controller('loginCtrl', function($ionicPopup,$ionicModal,$cordovaCamera, $ionicActionSheet, $ionicPlatform, $cordovaToast, $ionicPopup, $cordovaOauth, $scope, $state, $ionicPopup, $ionicLoading, $http, BASE_URL, localStorageService) {
    $ionicPlatform.registerBackButtonAction(function(event) {
        if ($state.current.name == "login") {
            $ionicPopup.confirm({
                title: 'EXIT',
                template: 'Are you sure you want to Exit?'
            }).then(function(res) {
                if (res) {
                    ionic.Platform.exitApp();
                }
            })
        }
    }, 200);

    $check = localStorageService.get('customer_data');
    console.log($check);
    if (!$check) {
        $state.go("login");
    } else {
        if ($check.user_type == "c") {
            if ($check.city == "") {
                $state.go("createprofile");
            } else {
                $state.go("tab.customer_home");
            }
        } else {
            ($check.user_type == "sp");
            if ($check.DOB == "" || $check.DOB == '0000-00-00') {
                $state.go("createprofile_provider");
            } else if ($check.bank_status == false) {
                $state.go('add_account');
            } else if ($check.purchase == 'n') {
                $state.go("purchase");
            } else {
                $state.go("tab1.home");
            }
        }
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
            var Url = BASE_URL + 'login';
            $http({
                method: 'POST',
                data: 'email=' + $dataa.email + '&password=' + $dataa.password + '&device_id=' + device_token + '&device_type=' + $scope.currentPlatform,
                url: Url,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function(data) {
                console.log(data);
                if (data.status == true) {
                    $ionicLoading.hide();
                    localStorageService.set('customer_data', data.data);
                    if(data.data.user_type == "c"){
                        if (data.data.city == "") {
                            $state.go("create_profile");
                        } else {
                            $state.go("tab.customer_home");
                        } 
                    } else {
                        if(data.data.user_type == "sp"){
                            if (data.data.DOB == "" || data.data.DOB == '0000-00-00') {
                                $state.go("createprofile_provider");
                            } else if (data.data.bank_status == false) {
                                $state.go('add_account');
                            } else if (data.data.purchase == 'n') {
                                $state.go("purchase");
                            } else {
                                $state.go("tab1.home");
                            }
                        }
                    }  
                } else {
                    console.log(data);
                    $ionicLoading.hide();
                    $cordovaToast.showLongBottom(data.message).then(function(success) {}, function(error) {});
                    if (data.type == 'email'){
                        $scope.errorUserName = data.message;
                    }
                    else if (data.type == 'password'){
                        $scope.errorPassword = data.message;
                    }
                    else{
                      console.log("controller");  
                    } 
                }
            })
            .error(function(data) {
                $ionicLoading.hide();
                $cordovaToast.showLongBottom(data.message).then(function(success) {}, function(error) {});
            });
        } else {
            $ionicLoading.hide();
            $cordovaToast.showLongBottom("Please fill required fields").then(function(success) {}, function(error) {});
        }
    }

    $scope.forgotPass = function() {
        $state.go("forgot_password");
    }

    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

    $scope.googleLogin = function(value) {
        $scope.modal.hide();
        $scope.modal.remove();
        if (typeof String.prototype.startsWith != 'function') {
            String.prototype.startsWith = function(str) {
                return this.indexOf(str) == 0;
            };
        }
        var clientId = "435140076880-livfr98i03vcu0khll90olj3b2qto9rg.apps.googleusercontent.com";
        var clientSecret = 'HhUCQyowk6vb86uBZ-UF69Vl';
        var ref = window.open('https://accounts.google.com/o/oauth2/auth?client_id=' + clientId + '&redirect_uri=http://localhost/callback&scope=https://www.googleapis.com/auth/userinfo.email&https://www.googleapis.com/auth/userinfo.profile&https://www.googleapis.com/auth/urlshortener&approval_prompt=force&response_type=code&access_type=offline', '_blank', 'location=no');
        ref.addEventListener('loadstart', function(event) {
            if ((event.url).startsWith("http://localhost/callback")) {
                requestToken = (event.url).split("code=")[1];
                $http({ method: "post", url: "https://accounts.google.com/o/oauth2/token", data: "client_id=" + clientId + "&client_secret=" + clientSecret + "&redirect_uri=http://localhost/callback" + "&grant_type=authorization_code" + "&code=" + requestToken })
                    .success(function(data) {
                        $scope.accessToken = data.access_token;
                        $http.get('https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' + $scope.accessToken, {
                        params: { format: 'json' }
                        }).then(function(result) {
                            $scope.g_Id = result.data.id;
                            $scope.guserData = result.data;
                            $ionicLoading.show({ template: '<ion-spinner icon="lines"></ion-spinner>' });
                            var device_token = localStorageService.get('device_token');
                            var device_type = ionic.Platform.device().platform;
                            var Url = BASE_URL + 'register';
                            $http({
                                method: 'POST',
                                data: 'other_reg_type_login_id=' + $scope.g_Id + '&registration_type=' + 'G' + '&device_id=' + device_token + '&device_type=' + device_type + '&user_type=' + value + '&first_name=' + $scope.guserData.name + '&last_name=' + '' + '&email=' + $scope.guserData.email,
                                url: Url,
                                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                            }).success(function(data) {
                                if (data.status == true) {
                                    localStorageService.set('customer_data', data.data);
                                    $ionicLoading.hide();
                                    if(data.data.user_type == "c"){
                                       if (data.data.city == "") {
                                            $state.go("createprofile");
                                        } else {
                                            $state.go("tab.customer_home");
                                        } 
                                    } else {
                                        if(data.data.user_type == "sp"){
                                            if (data.data.DOB == "" || data.data.DOB == '0000-00-00') {
                                                $state.go("createprofile_provider");
                                            } else if (data.data.bank_status == false) {
                                                $state.go('add_account');
                                            } else if (data.data.purchase == 'n') {
                                                $state.go("purchase");
                                            } else {
                                                $state.go("tab1.home");
                                            }
                                        }
                                    }  
                                } else {
                                    $ionicLoading.hide();
                                    $cordovaToast.showLongBottom(data.message).then(function(success) {}, function(error) {});
                                }
                            })
                            .error(function(data) {
                                $ionicLoading.hide();
                                $cordovaToast.showLongBottom(data.message).then(function(success) {}, function(error) {});
                            });
                        })
                        .error(function(data, status) {
                            $ionicLoading.hide();
                            $cordovaToast.showLongBottom(data.message).then(function(success) {}, function(error) {});
                        })
                    })
                ref.close();
            }
        });
    }

    if (typeof String.prototype.startsWith != 'function') {
        String.prototype.startsWith = function(str) {
            return this.indexOf(str) == 0;
        };
    }

    $scope.facebookLogin = function(value) {
        $scope.modal.hide();
        $scope.modal.remove();
        var fb_app_id = '255319991593527';
        $cordovaOauth.facebook(fb_app_id, ["email", "public_profile"], { redirect_uri: "https://customer-a1fee.firebaseapp.com/__/auth/handler" }).then(function(result) {
            var access_token = result;
            console.log(access_token);
            var re_id = result;
            // https://igotevent-82f2d.firebaseapp.com/__/auth/handler
            $http.get("https://graph.facebook.com/v2.2/me", {
                params: { access_token: result.access_token, fields: "id,name,gender,first_name,last_name,email,location,picture", format: "json" }
            }).then(function(result) {
                $scope.u_id = result.data.id;
                $scope.uData = result.data;
                $ionicLoading.show({ template: '<ion-spinner icon="lines"></ion-spinner>' });
                var device_token = localStorageService.get('device_token');
                var device_type = ionic.Platform.device().platform;
                var Url = BASE_URL + 'register';
                $http({
                        method: 'POST',
                        data: 'other_reg_type_login_id=' + $scope.u_id + '&registration_type=' + 'F' + '&device_id=' + device_token + '&device_type=' + device_type + '&user_type=' + value + '&first_name=' + $scope.uData.first_name + '&last_name=' + $scope.uData.last_name + '&email=' + $scope.uData.email,
                        url: Url,
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                    }).success(function(data) {
                        if (data.status == true) {
                            $ionicLoading.hide();
                            localStorageService.set('customer_data', data.data);
                            if(data.data.user_type == "c"){
                               if (data.data.city == "") {
                                    $state.go("createprofile");
                                } else {
                                    $state.go("tab.customer_home");
                                } 
                            } else{
                                if(data.data.user_type == "sp"){
                                    if (data.data.DOB == "" || data.data.DOB == '0000-00-00') {
                                        $state.go("createprofile_provider");
                                    } else if (data.data.bank_status == false) {
                                        $state.go('add_account');
                                    } else if (data.data.purchase == 'n') {
                                        $state.go("purchase");
                                    } else {
                                        $state.go("tab1.home");
                                    }
                                }
                            }  
                        } else {
                            $ionicLoading.hide();
                            $cordovaToast.showLongBottom(data.message).then(function(success) {}, function(error) {});
                        }
                    })
                    .error(function(data) {
                        $ionicLoading.hide();
                        $cordovaToast.showLongBottom(data.message).then(function(success) {}, function(error) {});
                    });
            })
        })
    }


    $scope.signup = function() {
        $scope.showModal('signup-modal.html');
    }

    $scope.googleLoginM = function(){
        $scope.showModal('gmail-modal.html');
    }

    $scope.facebookLoginM = function(){
        $scope.showModal('facebook-modal.html');
    }

    $scope.showModal = function(templateUrl) {
        $ionicModal.fromTemplateUrl(templateUrl, {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
            $scope.modal.show();
        });
    }

    $scope.closeModal = function() {
        $scope.modal.hide();
        $scope.modal.remove();
    }

    $scope.$on('modal.hidden', function(event) {
        $scope.modal.remove();
        var isPassed = false;
        if (isPassed == false) {
            event.preventDefault();
        }
    })

    $scope.$on('$destroy', function() {
        $scope.modal.hide();
        $scope.modal.remove();
    });

    $scope.customerGo = function() {
        $state.go('signup', {}, { reload: true });
    }

    $scope.providerGo = function() {
        $state.go('signup_provider', {}, { reload: true });
    }

})


.controller('SignupCtrl', function($ionicHistory, $ionicPlatform, $cordovaToast, $scope, $state, $ionicPopup, $ionicLoading, $http, BASE_URL, localStorageService) {

    $ionicPlatform.registerBackButtonAction(function(event) {
        $ionicHistory.goBack();
    }, 200);

    $scope.loginG = function() {
        $state.go('login', {}, { reload: true });
    }


    $scope.privacySign = function() {
        var ref = window.open('http://halphero.com/privacy.html', '_blank', 'location=yes');
        // $state.go('privacy_policy');
    }

    $scope.termConditionS = function() {
        var ref = window.open('http://halphero.com/terms&condition.html', '_blank', 'location=yes');
        // $state.go('term_conditions');
    }


    $scope.create_profile = function($dataa, $valid) {
        var device_token = localStorageService.get('device_token');
        $scope.submitted = true;
        if ($valid) {
            $dataa.user_type = 'c';
            $dataa.registration_type = "O";
            $dataa.device_type = ionic.Platform.device().platform;
            $dataa.device_id = device_token;
            $ionicLoading.show({template: '<ion-spinner icon="lines"></ion-spinner>'});
            var Url = BASE_URL + 'register';
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
                if (data.status == true) {
                    $ionicLoading.hide();
                    $cordovaToast.showLongBottom(data.message).then(function(success) {}, function(error) {});
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
        } else {
            $ionicLoading.hide();
            $cordovaToast.showLongBottom("Please fill required fields").then(function(success) {}, function(error) {});
        }
    }
    
})


//////////////////////Create Profile Controller//////////////////

.controller('CreateProfileCtrl', function($ionicHistory, $ionicPlatform, $cordovaToast, $scope, $state, ionicTimePicker, $ionicPopup, $ionicLoading, $http, BASE_URL, localStorageService, $cordovaCamera, $ionicActionSheet, $cordovaFileTransfer, $rootScope, $timeout) {

    var userD = localStorageService.get('customer_data');
    $scope.user = {};
    
    $ionicPlatform.registerBackButtonAction(function(event) {
        //navigator.app.backHistory();
    }, 200);

    $scope.genDer = function(value) {
        $scope.gender = value;
    }

    $scope.disableTap = function() {
        container = document.getElementsByClassName('pac-container');
        angular.element(container).attr('data-tap-disabled', 'true');
        angular.element(container).on("click", function() {
            document.getElementById('searchTextField').blur();
        })
    }

    function initialize() {
        var input = document.getElementById('searchTextField');
        var options = {
            types: ['address']
        };
        var autocomplete = new google.maps.places.Autocomplete(input, options);
        google.maps.event.addListener(autocomplete, 'place_changed', function() {
            var place = autocomplete.getPlace();
            $scope.user.city = place.formatted_address;
            for (var i = 0; i < place.address_components.length; i++) {
                for (var j = 0; j < place.address_components[i].types.length; j++) {
                    if (place.address_components[i].types[j] == "country") {
                        $scope.country = place.address_components[i].long_name;
                    }
                }
            }
            // $scope.user.address = place.name;document.getElementById('city2').value = place.name;
            // document.getElementById('cityLat').value = place.geometry.location.lat();
            // document.getElementById('cityLng').value = place.geometry.location.lng();
            document.getElementById('country').value = $scope.country;
            $scope.user.country = $scope.country;
        });
    }
    google.maps.event.addDomListener(window, 'load', initialize);
    initialize();

    $scope.setLatLong = function(lat, long) {
        $scope.lat = lat;
        $scope.lng = long;
    }

    $scope.go_home = function($dataa, valid) {
        var device_token = localStorage.getItem('device_token');
        $scope.currentPlatform = ionic.Platform.platform();
        $scope.gender;
        $scope.gendEr = $scope.gender;
        $scope.submitted = true;
        $userdata = localStorageService.get('customer_data');
        if (valid) {
            $ionicLoading.show({ template: '<ion-spinner icon="lines"></ion-spinner>' });
            var url = BASE_URL + 'update_profile';
            if ($scope.my_profile_image) {
                var targetPath = $scope.my_profile_image;
                var filename = targetPath.split("/").pop();
                filename = filename.split('?');
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
                $cordovaFileTransfer.upload(url, targetPath, options).then(function(result) {
                    $ionicLoading.hide();
                    var hh = JSON.parse(result.response);
                    if (hh.status == true) {
                        $ionicLoading.hide();
                        localStorageService.set('customer_data', hh.data);
                        $state.go('tab.customer_home');
                    } else {
                        $ionicLoading.hide();
                        // $cordovaToast.showLongBottom(hh.data).then(function(success) {}, function(error) {});
                    }
                }, function(err) {
                    $ionicLoading.hide();
                    $scope.imgURI = undefined;
                }, function(progress) {
                    $ionicLoading.show({ template: '<ion-spinner icon="lines"></ion-spinner>' });
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
                        $state.go('tab.customer_home');
                    } else {
                        $ionicLoading.hide();
                    }
                }).error(function(data) {
                    $ionicLoading.hide();
                });
            }
        } else {
            $ionicLoading.hide();
            $cordovaToast.showLongBottom("Please fill required fields").then(function(success) {}, function(error) {});
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
            $cordovaToast.showLongBottom(err).then(function(success) {}, function(error) {});
        });
    }

    $scope.upload_document = function() {
        var options = {
            quality: 80,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY,
            mediaType: Camera.MediaType.ALLMEDIA,
            allowEdit: true,
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
        }, function(err) {
            $cordovaToast.showLongBottom(err).then(function(success) {}, function(error) {})
        })
    }

})

///////////////////////////////////////////////////////
.controller('homeCustomerCtrl', function($ionicPlatform, $cordovaToast, $scope, $rootScope, $state, $http, $location, BASE_URL, $ionicHistory, $ionicLoading, localStorageService, $ionicPopup) {

    $ionicPlatform.registerBackButtonAction(function(event) {
        if ($state.current.name == "tab.customer_home") {
            $ionicPopup.confirm({
                title: 'EXIT',
                template: 'Are you sure you want to exit?'
            }).then(function(res) {
                if (res) {
                    ionic.Platform.exitApp();
                }
            })
        }
    }, 200);

    $scope.title = "Home";
    $userdata = localStorageService.get('customer_data');
    $scope.cusdata = [];

    $scope.getjobs = function() {

        $ionicLoading.show({ template: '<ion-spinner icon="lines"></ion-spinner>' });
        $userdata = localStorageService.get('customer_data');
        $http({
            method: 'POST',
            data: 'user_token=' + $userdata.user_token + '&user_id=' + $userdata.id,
            url: BASE_URL + 'get_job_of_user',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function(response) {
            $ionicLoading.hide();
            if (response.status == false) {
                $ionicLoading.hide();
                if (response.message == "Session Expired!! Please login again.") {
                    $ionicLoading.hide();
                    $cordovaToast.showLongBottom("Session Expired!! Please login again.").then(function(success) {}, function(error) {});
                    localStorageService.remove('customer_data');
                    $ionicHistory.clearCache().then(function() {
                        $state.go('login');
                    })
                } else if (response.message == "No Data Found!") {
                    $ionicLoading.hide();
                    $scope.notFound = "img/result_found.jpg";
                }
            } else {
                $ionicLoading.hide();
                $scope.cusdata = response.data;
            }
        }).error(function(error) {
            $ionicLoading.hide();
        });
    }
    $scope.getjobs();

    $scope.doRefresh = function() {
        $userdata = localStorageService.get('customer_data');
        $http({
            method: 'POST',
            data: 'user_token=' + $userdata.user_token + '&user_id=' + $userdata.id,
            url: BASE_URL + 'get_job_of_user',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function(response) {
            if (response.status == false) {
                if (response.message == "Session Expired!! Please login again.") {
                    $cordovaToast.showLongBottom("Session Expired!! Please login again.").then(function(success) {}, function(error) {});
                    localStorageService.remove('customer_data');
                    $ionicHistory.clearCache().then(function() {
                        $state.go('login');
                    })
                }
            } else {
                $scope.cusdata = response.data;
            }
        }).error(function(error) {

        })
        .finally(function() {
            $scope.$broadcast('scroll.refreshComplete');
        })
    };

    $scope.go_detail_customer = function(id) {
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

//////////////////////////////////////////////////
.controller('JobDetailCustomer', function($ionicPlatform, $scope, $state, BASE_URL, localStorageService, $rootScope, $ionicHistory, $ionicLoading, $http, $ionicPopup) {

    $ionicPlatform.registerBackButtonAction(function(event) {
        $ionicHistory.goBack();
    }, 200);


    $scope.title = "Job Detail";

    $scope.myGoBack = function() {
        $ionicHistory.goBack();
    }

    $scope.go_job_applicants = function(id) {
        $rootScope.jo_id = id;
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
            'user_type': "c"
        }
        $ionicLoading.show({
            template: '<ion-spinner icon="lines"></ion-spinner>'
        });
        var Url = BASE_URL + 'get_job_detail';
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
            $ionicLoading.hide();
            if (data.status == false) {
                $ionicLoading.hide();
                if (response.message == "Session Expired!! Please login again.") {
                    $ionicLoading.hide();
                    $cordovaToast.showLongBottom("Session Expired!! Please login again.").then(function(success) {}, function(error) {});
                    localStorageService.remove('customer_data');
                    $ionicHistory.clearCache().then(function() {
                        $state.go('login');
                    })
                }
            } else {
                $ionicLoading.hide();
                $scope.jobdata = data.data;
                $rootScope.jobtype = $scope.jobdata.price_type;
            }
        }).error(function(data) {
            $ionicLoading.hide();
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

    $scope.dataTypeCustomer = function() {}

})

///////////////////////////////////////////////
.controller('historyAlljobsCtrl', function($ionicPlatform, $cordovaToast, $rootScope, $scope, $state, BASE_URL, $cordovaDatePicker, localStorageService, $ionicHistory, $http, $ionicLoading, $ionicPopup, $ionicPlatform, ionicTimePicker) {

    $ionicPlatform.registerBackButtonAction(function(event) {
        $ionicHistory.goBack();
    }, 200);

    $scope.historyIn = function() {
        $ionicLoading.show({ template: '<ion-spinner icon="lines"></ion-spinner>' });
        $userdata = localStorageService.get('customer_data');
        $http({
            method: 'POST',
            data: 'user_token=' + $userdata.user_token + '&c_id=' + $userdata.id,
            url: BASE_URL + 'getJobStatusClient',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function(response) {
            $ionicLoading.hide();
            if (response.status == false) {
                $ionicLoading.hide();             
                if (response.message == "Session Expired!! Please login again.") {
                    $cordovaToast.showLongBottom(response.message).then(function(success) {
                    }, function(error) {
                    });
                    localStorageService.remove('customer_data');
                    $ionicHistory.clearCache().then(function() {
                        $state.go('login');
                    })
                }
            } else {
                $ionicLoading.hide();
                $scope.historydata = response.data;
            }
        }).error(function(error) {
            $ionicLoading.hide();
        });
    }

    $scope.doRefresh = function() {
        $userdata = localStorageService.get('customer_data');
        $http({
            method: 'POST',
            data: 'user_token=' + $userdata.user_token + '&c_id=' + $userdata.id,
            url: BASE_URL + 'getJobStatusClient/',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function(response) {
            $ionicLoading.hide();
            if (response.status == false) {
                $ionicLoading.hide();
                if (response.message == "Session Expired!! Please login again.") {
                    $cordovaToast.showLongBottom(response.message).then(function(success) {
                    },function(error) {
                    });
                    localStorageService.remove('customer_data');
                    $ionicHistory.clearCache().then(function() {
                        $state.go('login');
                    })
                }
            } else {
                $ionicLoading.hide();
                $scope.historydata = response.data;
            }
        }).error(function(error) {
            $ionicLoading.hide();
        }).finally(function() {
            $scope.$broadcast('scroll.refreshComplete');
        })
    }

    $scope.job_detail_upcoming = function(id) {
        $rootScope.jo_id = id;
        $state.go('History_detail');
    }

    $scope.inProgressC = function(id) {
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

///////////////////////////////////////////////
.controller('historyjobsDetailsCtrl', function(IMG_URL, $ionicPlatform, $rootScope, $scope, $state, BASE_URL, $cordovaDatePicker, localStorageService, $ionicHistory, $http, $ionicLoading, $ionicPopup, $ionicPlatform, ionicTimePicker) {

    $ionicPlatform.registerBackButtonAction(function(event) {
        $ionicHistory.goBack();
    }, 200);

    $scope.myGoBack = function() {
        $ionicHistory.goBack();
    }

    $scope.img_url = IMG_URL;

    $userdata = localStorageService.get('customer_data');

    $scope.hisJobDetail = function() {
        $userdata = localStorageService.get('customer_data');
        $scope.submitted = true;
        $scope.user_token = $userdata.user_token;
        var params = {
            'user_token': $userdata.user_token,
            'user_id': $userdata.id,
            'job_id': $rootScope.jo_id,
            'user_type': "c"
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
            $ionicLoading.hide();
            if (data.status == false) {
                $ionicLoading.hide();
                if (response.message == "Session Expired!! Please login again.") {
                    $ionicLoading.hide();
                    $cordovaToast.showLongBottom(data.message).then(function(success) {}, function(error) {});
                    localStorageService.remove('customer_data');
                    $ionicHistory.clearCache().then(function() {
                        $state.go('login');
                    })
                }
            } else {
                $ionicLoading.hide();
                $scope.jobdata = data.data;
                $scope.servicePdata = data.serviceprovider;
            }
        }).error(function(data) {
            $ionicLoading.hide();
        });
    }

    $scope.goMessageHis = function(id) {
        $rootScope.usreId = id;
        $state.go('conversations');
    }


})


//////////////////////////////////////////////
.controller('historyjobsDetailsCompleteCtrl', function(IMG_URL, $ionicPlatform, $rootScope, $scope, $state, BASE_URL, $cordovaDatePicker, localStorageService, $ionicHistory, $http, $ionicLoading, $ionicPopup, $ionicPlatform, ionicTimePicker) {

    $ionicPlatform.registerBackButtonAction(function(event) {
        $ionicHistory.goBack();
    }, 200);

    $scope.myGoBack = function() {
        $ionicHistory.goBack();
    }

    $scope.img_url = IMG_URL;
    $userdata = localStorageService.get('customer_data');

    $scope.hisJobDetailCompleted = function() {
        $userdata = localStorageService.get('customer_data');
        $scope.submitted = true;
        $scope.user_token = $userdata.user_token;
        var params = {
            'user_token': $userdata.user_token,
            'user_id': $userdata.id,
            'job_id': $rootScope.jo_id,
            'user_type': "c"
        }
        $ionicLoading.show({
            template: '<ion-spinner icon="lines"></ion-spinner>'
        });
        var Url = BASE_URL + 'get_job_detail';
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
            $ionicLoading.hide();
            if (data.status == false) {
                $ionicLoading.hide();
                if (response.message == "Session Expired!! Please login again.") {
                    $ionicLoading.hide();
                    $cordovaToast.showLongBottom(data.message).then(function(success) {}, function(error) {});
                    localStorageService.remove('customer_data');
                    $ionicHistory.clearCache().then(function() {
                        $state.go('login');
                    })
                }
            } else {
                $ionicLoading.hide();
                $scope.jobdata = data.data;
                $scope.servicePdata = data.serviceprovider;
            }
        }).error(function(data) {
            $ionicLoading.hide();
        });
    }


    $scope.goMessageHisCom = function(id) {
        $rootScope.usreId = id;
        $state.go('conversations');
    }

    $scope.viewServCompleted = function(id, u_id) {
        $rootScope.userComIdProvid = u_id;
        $rootScope.jobIdCo = id;
        $state.go('reciept');
    }

})

//////////////////////////////////////////////////
.controller('postJobCtrl', function($ionicPlatform, $filter, $rootScope, $cordovaToast, $scope, $state, BASE_URL, $cordovaDatePicker, localStorageService, $ionicHistory, $http, $ionicLoading, $ionicPopup, $ionicPlatform, ionicTimePicker) {

    $ionicPlatform.registerBackButtonAction(function(event) {
        $ionicHistory.goBack();
    }, 200);

    $scope.user = {};
    $scope.disableTap = function() {
        container = document.getElementsByClassName('pac-container');
        angular.element(container).attr('data-tap-disabled', 'true');
        angular.element(container).on("click", function() {
            document.getElementById('address').blur();
        })
    }

    $scope.setLatLong = function(lat, long) {
        $scope.lat = lat;
        $scope.lng = long;
    }


    function initialize() {
        var input = document.getElementById('searchTextField');
        var options = {
            types: ['address']
                /*componentRestrictions: {  country:'IE' }*/
        };
        var autocomplete = new google.maps.places.Autocomplete(input, options);
        google.maps.event.addListener(autocomplete, 'place_changed', function() {
            var place = autocomplete.getPlace();
            console.log(place);
            $scope.user.location = place.formatted_address;
            for (var i = 0; i < place.address_components.length; i++) {
                var component = place.address_components[i];
                switch(component.types[0]) {
                    case 'locality':
                        $scope.city = component.long_name;
                        break;
                    case 'neighborhood':
                        $scope.city = component.long_name;
                        break;
                    case 'administrative_area_level_2':
                        $scope.city = component.long_name;
                        break;
                    case 'country':
                        $scope.country = component.long_name;
                        break;
                }
            }
            // for (var i = 0; i < place.address_components.length; i++) {
            //     for (var j = 0; j < place.address_components[i].types.length; j++) {
            //         if (place.address_components[i].types[j] == "country") {
            //             $scope.country = place.address_components[i].long_name;
            //         }
            //         if (place.address_components[i].types[j] == "locality") {
            //             $scope.city = place.address_components[i].long_name;   
            //         } else if (place.address_components[i].types[j] == "administrative_area_level_2") {
            //             $scope.city = place.address_components[i].long_name;
            //         }
            //         // document.getElementById('cityLat').value = place.geometry.location.lat();
            //         // document.getElementById('cityLng').value = place.geometry.location.lng();
            //         // $scope.user.lat = place.geometry.location.lat();
            //         // $scope.user.lng = place.geometry.location.lng();
            //     }
            // }
            document.getElementById('country').value = $scope.country;
            $scope.user.country = $scope.country;
            if($scope.city == undefined){
                document.getElementById('city').value = "";
            }else{
                document.getElementById('city').value = $scope.city;
            }
            $scope.user.city = $scope.city;
        });
    }
    google.maps.event.addDomListener(window, 'load', initialize);
    initialize();

    document.getElementById("date").classList.add("dateclass");

    var selectedDate;
    $scope.checkDate = function() {
        document.getElementById("date").classList.remove("dateclass");
        var selectedText = document.getElementById('date').value;
        $rootScope.selectedDate = new Date(selectedText);
        var date = new Date();
        date.setHours(0, 0, 0, 0);
        $rootScope.now = date;
        if ($rootScope.selectedDate < $rootScope.now) {
            $cordovaToast.showLongBottom("Start date should not be before today").then(function(success) {}, function(error) {})
        }
    }

    $scope.checkTime = function() {
        document.getElementById("time").classList.remove("dateclass");
    }

    $scope.create_job = function($dataa, $valid) {
        $userdata = localStorageService.get('customer_data');
        $scope.submitted = true;
        var tknd = localStorageService.get('customer_data');
        if ($valid) {
            if ($rootScope.selectedDate < $rootScope.now) {
                $cordovaToast.showLongBottom("Start date should not be before today").then(function(success) {}, function(error) {})
                $dataa.job_date = "";
                return;
            }
            if (tknd.client_token != '') {
                BraintreePlugin.initialize(tknd.client_token, function() {},
                    function(error) {
                        console.log(error);
                    })
            } else {
                BraintreePlugin.initialize("sandbox_sy672pf7_tgwqcbt74d873v92", function() {},
                function(error) { 
                })
            }
            if($userdata.account_activate == '0'){
                var options = { amount: "5€", primaryDescription: "Purchase" };
                BraintreePlugin.presentDropInPaymentUI(options, function(result) {
                    if (result.userCancelled) {
                        return;
                    } else {
                        $scope.nonce = result.nonce;
                        swal({
                            title: "Are you sure?",
                            text: "You want to post a job",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#DD6B55",
                            confirmButtonText: "Yes, post!",
                            cancelButtonText: "No, cancel please!",
                            closeOnConfirm: false,
                            closeOnCancel: false
                        },
                        function(isConfirm) {
                            if (isConfirm) {
                                swal("Post job!", "Successfully posted.", "success");
                                $rootScope.creJobData = $dataa;
                                $userdata = localStorageService.get('customer_data');
                                $dataa.user_token = $userdata.user_token;
                                $dataa.user_id = $userdata.id;
                                $dataa.nonce = $scope.nonce;
                                $dataa.job_date = $filter('date')($dataa.job_date, "yyyy-MM-dd");
                                $dataa.job_time = $dataa.job_time.getHours() + ':' + $dataa.job_time.getMinutes() + ':' + $dataa.job_time.getMilliseconds();
                                $dataa.job_type = $dataa.jtyp;
                                $dataa.price = $dataa.price;
                                $dataa.price_type = $dataa.price_type;
                                $dataa.location = $dataa.location;
                                $dataa.city = $dataa.city;
                                $dataa.country = $dataa.country;
                                $dataa.job_desc = $dataa.job_desc;
                                $dataa.job_name = $dataa.job_name;
                                $ionicLoading.show({ template: '<ion-spinner icon="lines"></ion-spinner>' });
                                var Url = BASE_URL + 'create_job';
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
                                    if (data.status == false) {
                                        $ionicLoading.hide();
                                        if (response.message == "Session Expired!! Please login again.") {
                                            $ionicLoading.hide();
                                            $cordovaToast.showLongBottom(data.message).then(function(success) {}, function(error) {});
                                            localStorageService.remove('customer_data');
                                            $ionicHistory.clearCache().then(function() {
                                                $state.go('login');
                                            })
                                        }
                                    } else {
                                        $ionicLoading.hide();
                                        $cordovaToast.showLongBottom(data.message).then(function(success) {}, function(error) {});
                                        localStorageService.set('customer_data', data.data);
                                        $state.go('tab.customer_home');
                                    }
                                }).error(function(err) {
                                    $ionicLoading.hide();
                                });
                            }else {
                                swal("Cancelled", "", "error");
                            }
                        })
                    }   
                })
            }else{
                swal('Please verify your account and login again')
            }
        } else {
            // $cordovaToast.showLongBottom("Please fill required field").then(function(success) {
            // }, function(error) {
            // });
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

///////////////////////////////////////////////////
.controller('JobApplicants', function($ionicPlatform, $cordovaToast, $location, $ionicHistory, BASE_URL, $http, $ionicLoading, $rootScope, localStorageService, $scope, $state, $ionicHistory) {

    $ionicPlatform.registerBackButtonAction(function(event) {
        $ionicHistory.goBack();
    }, 200);

    $scope.myGoBack = function() {
        $ionicHistory.goBack();
    };

    $scope.go_other = function(id) {
        $rootScope.other_user_id = id;
        $location.url('other_profile');
    }

    $scope.appliCiants = function() {
        $userdata = localStorageService.get('customer_data');
        $ionicLoading.show({ template: '<ion-spinner icon="lines"></ion-spinner>' });
        $http({
            method: 'POST',
            data: 'user_token=' + $userdata.user_token + '&user_id=' + $userdata.id + '&job_id=' + $rootScope.jo_id,
            url: BASE_URL + '/view_job_applicants',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function(response) {
            $ionicLoading.hide();
            if (response.status == false) {
                $cordovaToast.showLongBottom("There is no Applicant").then(function(success) {}, function(error) {});
                if (response.message == "Session Expired!! Please login again.") {
                    $cordovaToast.showLongBottom(response.message).then(function(success) {}, function(error) {});
                    localStorageService.remove('customer_data');
                    $ionicHistory.clearCache().then(function() {
                        $state.go('login');
                    })
                } else if (response.message == "Data not Found") {
                    $scope.notFoundJ = "img/result_found.jpg";
                }
            } else {
                $ionicLoading.hide();
                $scope.applicAnts = response.data;
            }
        }).error(function(error) {
            $ionicLoading.hide();
        });
    }

    $scope.doRefresh = function() {
        $userdata = localStorageService.get('customer_data');
        $http({
            method: 'POST',
            data: 'user_token=' + $userdata.user_token + '&user_id=' + $userdata.id + '&job_id=' + $rootScope.jo_id,
            url: BASE_URL + '/view_job_applicants',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function(response) {
            if (response.status == false) {
                $cordovaToast.showLongBottom("There Is no Applicants").then(function(success) {}, function(error) {});
                if (response.message == "Session Expired!! Please login again.") {
                    $cordovaToast.showLongBottom(response.message).then(function(success) {}, function(error) {});
                    localStorageService.remove('customer_data');
                    $ionicHistory.clearCache().then(function() {
                        $state.go('login');
                    })
                }
            } else {
                console.log(response.status);
                $scope.applicAnts = response.data;
            }
        }).error(function(error) {
            console.log(error);
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

    $scope.setRating = function(question, val) {
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

/////////////////////////////////////////////////
.controller('profileCtrl', function($ionicPopup, $ionicPlatform, IMG_URL, $scope, $state, $rootScope, localStorageService, $ionicHistory) {
    $scope.img_url = IMG_URL;

    $ionicPlatform.registerBackButtonAction(function(event) {
        $ionicHistory.goBack();
    }, 200);


    $scope.myGoBack = function() {
        $ionicHistory.goBack();
    };

    $scope.go_edit_profile = function() {
        $state.go('edit_profile');
    }

    $scope.profiledata = function() {
        $scope.userdataa = localStorageService.get('customer_data');
        console.log($scope.userdataa);
    }

    // $scope.logout = function() {
    //     var confirmPopup = $ionicPopup.confirm({
    //         title: 'Logout',
    //         cssClass: 'logout_popup',
    //         template: 'Are you sure you want to logout'
    //     });
    //     confirmPopup.then(function(res) {
    //         if (res) {
    //             localStorageService.remove('customer_data');
    //             $ionicHistory.clearCache().then(function() {
    //                 $state.go('login');
    //             })
    //         } else {}
    //     })
    // }

    $scope.logout = function() {
        // var get_t = localStorage.getItem("device_token");
    	swal({
            title: "Are you sure?",
            text: "You want to Logout!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, Logout!",
            cancelButtonText: "No, cancel please!",
            closeOnConfirm: false,
            closeOnCancel: false
        },
        function(isConfirm) {
            if (isConfirm) {
            	swal("Logout!", "Successfully logout.", "success");
            	localStorageService.remove('customer_data');
                $ionicHistory.clearCache().then(function() {
                    $state.go('login');
                })
            } else {
                swal("Cancelled", "", "error");
            }
        })
    }

    $scope.changePassword = function() {
        $state.go('change_password');
    }

})


.controller('editprofileCtrl', function($ionicHistory, $ionicPlatform, IMG_URL, $scope, $rootScope, $timeout, $ionicActionSheet, $state, $ionicPopup, $cordovaCamera, $ionicLoading, $http, BASE_URL, localStorageService, $cordovaFileTransfer) {

    $ionicPlatform.registerBackButtonAction(function(event) {
        $ionicHistory.goBack();
    }, 200);

    $scope.user = {};
    $scope.img_url = IMG_URL;

    $scope.base_url = BASE_URL;
    $scope.userdataa = localStorageService.get('customer_data');
    $scope.user = $scope.userdataa;

    function initialize() {
        var input = document.getElementById('searchTextField');
        var options = {
            types: ['address']
        };
        var autocomplete = new google.maps.places.Autocomplete(input, options);
        google.maps.event.addListener(autocomplete, 'place_changed', function() {
            var place = autocomplete.getPlace();
            $scope.user.city = place.formatted_address;
            for (var i = 0; i < place.address_components.length; i++) {
                for (var j = 0; j < place.address_components[i].types.length; j++) {
                    if (place.address_components[i].types[j] == "country") {
                        $scope.country = place.address_components[i].long_name;
                    }
                    if (place.address_components[i].types[j] == "administrative_area_level_2") {
                        $scope.city = place.address_components[i].long_name;
                    }
                }
            }
        });
    }
    google.maps.event.addDomListener(window, 'load', initialize);
    initialize();

    $scope.disableTap = function() {
        container = document.getElementsByClassName('pac-container');
        angular.element(container).attr('data-tap-disabled', 'true');
        angular.element(container).on("click", function() {
            document.getElementById('searchTextField').blur();
        })
    }

    $scope.setLatLong = function(lat, long) {
        $scope.lat = lat;
        $scope.lng = long;
    }

    $scope.edit_profile = function($dataa, $valid) {
        $userdata = localStorageService.get('customer_data');
        $scope.submitted = true;
        $ionicLoading.show({
            template: '<ion-spinner icon="lines"></ion-spinner>'
        });
        var url = BASE_URL + 'update_profile/';
        if ($valid) {
            if ($rootScope.my_profile_image) {
                var targetPath = $rootScope.my_profile_image;
                var filename = targetPath.split("/").pop();
                filename = filename.split('?');
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
                params.first_name = $dataa.first_name;
                params.last_name = $dataa.last_name;
                params.phone_nbr = $dataa.phone_nbr;
                params.user_type = $dataa.user_type;
                params.about_me = $dataa.about_me;
                params.city = $dataa.city;
                options.params = params;
                $cordovaFileTransfer.upload(url, targetPath, options).then(function(result) {
                    var hh = JSON.parse(result.response);
                    if (hh.status == true) {
                        $ionicLoading.hide();
                        localStorageService.set('customer_data', hh.data);
                        $state.go('profile');
                    } else {
                        $ionicLoading.hide();
                        return false;
                    }
                }, function(err) {
                    $scope.imgURI = undefined;
                    $ionicLoading.hide();
                }, function(progress) {
                    $ionicLoading.show({
                        template: '<ion-spinner icon="lines"></ion-spinner>'
                    });
                    $timeout(function() {
                        $scope.downloadProgress = (progress.loaded / progress.total) * 100;
                    })
                });
            } else {
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
                        $state.go('profile');
                    } else {
                        $ionicLoading.hide();
                    }
                }).error(function(data) {
                    $ionicLoading.hide();
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
                } else if (index == 1) {
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
            $rootScope.my_profile_image = imageURI;
        }, function(err) {

        });
    }


})


////////////////change password////////////////////
.controller('changePassCtrl', function($ionicPlatform, $cordovaToast, $ionicHistory, $scope, $rootScope, $timeout, $ionicActionSheet, $state, $ionicPopup, $cordovaCamera, $ionicLoading, $http, BASE_URL, localStorageService, $cordovaFileTransfer) {

    $ionicPlatform.registerBackButtonAction(function(event) {
        $ionicHistory.goBack();
    }, 200);

    $scope.myGoBack = function() {
        $ionicHistory.goBack();
    }

    $userdata = localStorageService.get('customer_data');

    $scope.changePassword = function(data, valid) {
        $scope.submitted = true;
        if (valid) {
            $ionicLoading.show({ template: '<ion-spinner icon="lines"></ion-spinner>' });
            $userdata = localStorageService.get('customer_data');
            $http({
                method: 'POST',
                data: 'user_token=' + $userdata.user_token + '&user_id=' + $userdata.id + '&oldPassword=' + data.oldPassword + '&newPassword=' + data.newPassword,
                url: BASE_URL + 'changePassword',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function(response) {
                $ionicLoading.hide();
                if (response.status == false) {
                    $cordovaToast.showLongBottom(response.message).then(function(success) {}, function(error) {});
                } else {
                    $ionicLoading.hide();
                    $state.go('profile');
                }
            }).error(function(error) {
                $ionicLoading.hide();
            });
        } else {
            $cordovaToast.showLongBottom("Please fill required fields").then(function(success) {}, function(error) {});
        }
    }


})


////////////////////////////////////////////////////
.controller('forgotPasswordCtrl', function($ionicPlatform, $cordovaToast, $ionicHistory, $scope, $rootScope, $timeout, $ionicActionSheet, $state, $ionicPopup, $cordovaCamera, $ionicLoading, $http, BASE_URL, localStorageService, $cordovaFileTransfer) {

    $ionicPlatform.registerBackButtonAction(function(event) {
        $ionicHistory.goBack();
    }, 200);

    $scope.myGoBack = function() {
        $ionicHistory.goBack();
    }

    $scope.forgotPassword = function(data, valid) {
        $scope.submitted = true;
        if (valid) {
            $ionicLoading.show({ template: '<ion-spinner icon="lines"></ion-spinner>' });
            $http({
                method: 'POST',
                data: 'email=' + data.email,
                url: BASE_URL + 'forgot_password',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function(response) {
                $ionicLoading.hide();
                if (response.status == false) {
                    $ionicLoading.hide();
                    $cordovaToast.showLongBottom(response.message).then(function(success) {}, function(error) {});
                    if (response.message == "Session Expired!! Please login again.") {
                        $ionicLoading.hide();
                        $cordovaToast.showLongBottom(response.message).then(function(success) {}, function(error) {});
                        localStorageService.remove('customer_data');
                        $ionicHistory.clearCache().then(function() {
                            $state.go('login');
                        })
                    }
                } else {
                    $cordovaToast.showLongBottom(response.message).then(function(success) {}, function(error) {});
                    $ionicLoading.hide();
                    $state.go('login');
                }
            }).error(function(error) {
                $ionicLoading.hide();
            });
        } else {
            $cordovaToast.showLongBottom("Please fill required fields").then(function(success) {}, function(error) {});
        }
    }

})

////////////////////////////////////////////////////
.controller('RatingCtrl', function(IMG_URL, $ionicPlatform, $filter, $rootScope, $cordovaToast, $scope, $state, BASE_URL, $cordovaDatePicker, localStorageService, $ionicHistory, $http, $ionicLoading, $ionicPopup, $ionicPlatform, ionicTimePicker) {

    $scope.img_url = IMG_URL;

    $ionicPlatform.registerBackButtonAction(function(event) {
        $ionicHistory.goBack();
    }, 200);

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

    $scope.setRating = function(question, val) {
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


    $scope.getProviderData = function() {
        $userdata = localStorageService.get('customer_data');
        $ionicLoading.show({ template: '<ion-spinner icon="lines"></ion-spinner>' });
        $http({
            method: 'POST',
            data: 'user_token=' + $userdata.user_token + '&user_id=' + $userdata.id + '&other_user_id=' + $rootScope.userComIdProvid,
            url: BASE_URL + '/view_user_detail',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function(response) {
            $ionicLoading.hide();
            if (response.status == false) {
                $ionicLoading.hide();
                if (response.message == "Session Expired!! Please login again.") {
                    $ionicLoading.hide();
                    $cordovaToast.showLongBottom(response.message).then(function(success) {}, function(error) {});
                    localStorageService.remove('customer_data');
                    $ionicHistory.clearCache().then(function() {
                        $state.go('login');
                    })
                }
            } else {
                $ionicLoading.hide();
                $scope.otherProData = response.data;
            }
        }).error(function(error) {
            $ionicLoading.hide();
        });
    }

    $scope.show = false;

    $scope.rateProvider = function(comment, question) {
        if (question == undefined) {
            $cordovaToast.showLongBottom("Please rate your provider").then(function(success) {}, function(error) {});
            return;
        }
        $userdata = localStorageService.get('customer_data');
        $ionicLoading.show({ template: '<ion-spinner icon="lines"></ion-spinner>' });
        $http({
            method: 'POST',
            data: 'user_token=' + $userdata.user_token + '&user_id=' + $userdata.id + '&receiver_id=' + $rootScope.userComIdProvid + '&job_id=' + $rootScope.jobIdCo + '&rating=' + $scope.question + '&msg=' + comment,
            url: BASE_URL + 'add_rating',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function(response) {
            $ionicLoading.hide();
            $state.go('tab.customer_home');
            $cordovaToast.showLongBottom("Succesfully Rated").then(function(success) {}, function(error) {})
        }).error(function(error) {
            $ionicLoading.hide();
        });
    }

})

///////////////////////////////////////////////
.controller('recieptCtrl', function($ionicPlatform, $filter, $cordovaToast, $ionicHistory, $scope, $rootScope, $timeout, $ionicActionSheet, $state, $ionicPopup, $cordovaCamera, $ionicLoading, $http, BASE_URL, localStorageService, $cordovaFileTransfer) {

    $ionicPlatform.registerBackButtonAction(function(event) {
        $ionicHistory.goBack();
    }, 200);

    $scope.myGoBack = function() {
        $ionicHistory.goBack();
    }

    $scope.chat_go = function() {
        $state.go('job_detail_completed');
    }

    $scope.value = function() {
        console.log("value");
    }

    var token = localStorageService.get('user_token');
    var status = localStorageService.get('user_status');
    var job_status = localStorageService.get('job_status_user');
    var ratting_status = localStorageService.get('rating_status');

    $scope.receiptIn = function() {
        $userdata = localStorageService.get('customer_data');
        $ionicLoading.show({ template: '<ion-spinner icon="lines"></ion-spinner>' });
        $http({
            method: 'POST',
            data: 'user_token=' + $userdata.user_token + '&user_id=' + $userdata.id + '&job_id=' + $rootScope.jobIdCo,
            url: BASE_URL + 'getReceipt',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function(response) {
            $ionicLoading.hide();
            $scope.receiptData = response.data;
            $scope.rateCheck = response;
            $scope.s_job = $scope.receiptData.start_job;
            $scope.e_job = $scope.receiptData.end_job;
            $scope.s_job = $filter('date')(new Date($scope.s_job.split('-').join('/')), "d MMMM yyyy");
            $scope.e_job = $filter('date')(new Date($scope.e_job.split('-').join('/')), "d MMMM yyyy");
        }).error(function(error) {
            $ionicLoading.hide();
        });
    }

///////////// payment api //////////////

    $scope.go_payment = function(id, total_amount) {
        console.log($rootScope.jobIdCo);
        console.log(id);
        console.log(total_amount);
        if (total_amount == "0") {
            $cordovaToast.showLongBottom("No Amount").then(function(success) {}, function(error) {});
            return;
        }
        var payM = localStorageService.get('customer_data');
        if (payM.client_token != '') {
            BraintreePlugin.initialize(payM.client_token, function() {
            },
            function(error) {
                console.log(JSON.stringify(error));
            })
        } else {
            BraintreePlugin.initialize("sandbox_sy672pf7_tgwqcbt74d873v92", function() {
            },
            function(error) {
                console.log(JSON.stringify(error));
            })
        }
        $userdata = localStorageService.get('customer_data');
        $scope.amount = total_amount;
        var options = { amount: $scope.amount, primaryDescription: "Purchase" };
        BraintreePlugin.presentDropInPaymentUI(options, function(result) {
            if (result.userCancelled) {
                return;
            } else {
                $scope.nonce = result.nonce;
                console.log($scope.nonce);
                swal({
                    title: "Are you sure?",
                    text:  "You want to Pay of! " +  $scope.amount  + "€",
                    type:  "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Yes, Payment!",
                    cancelButtonText: "No, cancel please!",
                    closeOnConfirm: false,
                    closeOnCancel: false
                },
                function(isConfirm) {
                    if (isConfirm) {
                        $ionicLoading.show({ template: '<ion-spinner icon="lines"></ion-spinner>' });
                        $http({
                            method: 'POST',
                            data: 'user_token=' + $userdata.user_token + '&user_id=' + $userdata.id + '&job_id=' + $rootScope.jobIdCo + '&nonce=' + $scope.nonce + '&amount=' + total_amount,
                            url: BASE_URL + 'make_payment_after_complete_job/',
                            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                        }).success(function(response) {
                            $ionicLoading.hide();
                            console.log(response);
                            if(response.status == false){
                                swal("Error!" + response.message);
                                $cordovaToast.showLongBottom(response.message).then(function(success) {}, function(error) {});
                            }else{
                                swal("Payment!", "Successfully Paymented.", "success");
                                $state.go('rating');
                            }
                        }).error(function(error) {
                            $ionicLoading.hide();
                        });
                    } else {
                        swal("Cancelled", "", "error");
                    }
                })
            }
        })
    }

    $scope.gorate = function() {
        $state.go("rating");
    }

})

///////////////////paypal controller//////////////////
.controller('makePayAddCardCtrl', function($ionicPlatform, $ionicLoading, BASE_URL, $http, $location, $scope, $state, $ionicHistory, $cordovaToast, $rootScope, localStorageService) {

    $ionicPlatform.registerBackButtonAction(function(event) {
        $ionicHistory.goBack();
    }, 200);

    $scope.myGoBack = function() {
        $ionicHistory.goBack();
    }

    $scope.addCardMakePay = function(data) {
        alert(data);
    }

})

.controller('newcardCtrl', function($ionicPlatform, localStorageService, $ionicLoading, BASE_URL, $http, $location, $scope, $state, $ionicHistory, $cordovaToast, $rootScope) {

    $ionicPlatform.registerBackButtonAction(function(event) {
        $ionicHistory.goBack();
    }, 200);

})

.controller('settingCtrl', function($ionicPlatform, $cordovaToast, $rootScope, localStorageService, $ionicLoading, BASE_URL, $http, $location, $scope, $state, $ionicHistory) {

    $ionicPlatform.registerBackButtonAction(function(event) {
        $ionicHistory.goBack();
    }, 200);

    $scope.myGoBack = function() {
        $ionicHistory.goBack();
    }

    $userdata = localStorageService.get('customer_data');

    if ($userdata.notification == 'n') {
        $scope.pushNotification = { checked: false };
    } else {
        $scope.pushNotification = { checked: true };
    }

    $scope.pushNotificationChange = function(pushNotification) {
        if (pushNotification == true) {
            val = 'y'
        } else {
            val = 'n'
        }
        $userdata = localStorageService.get('customer_data');
        $http({
            method: 'POST',
            data: 'user_token=' + $userdata.user_token + '&user_id=' + $userdata.id + '&notification=' + val,
            url: BASE_URL + 'notification',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function(response) {
            localStorageService.set('customer_data', response.data);
        }).error(function(error) {
            console.log(error);
        });
    }

    $scope.aboutUs = function() {
        $state.go('about_us');
    }

    $scope.contactUs = function() {
        $state.go('contact_us');
    }

    $scope.privacyPolicy = function() {
        var ref = window.open('http://halphero.com/privacy.html', '_blank', 'location=yes');
    }

    $scope.termCondition = function() {
        var ref = window.open('http://halphero.com/terms&condition.html', '_blank', 'location=yes');
    }

})


.controller('otherProfileCtrl', function($ionicPlatform, IMG_URL, $cordovaToast, $rootScope, localStorageService, $ionicLoading, BASE_URL, $http, $location, $scope, $state, $ionicHistory) {

    $ionicPlatform.registerBackButtonAction(function(event) {
        $ionicHistory.goBack();
    }, 200);

    $scope.img_url = IMG_URL;
    $scope.base_url = BASE_URL;

    $scope.otherPro = "";
    $scope.getOtherPro = function() {
        $userdata = localStorageService.get('customer_data');
        $ionicLoading.show({ template: '<ion-spinner icon="lines"></ion-spinner>' });
        $http({
            method: 'POST',
            data: 'user_token=' + $userdata.user_token + '&user_id=' + $userdata.id + '&other_user_id=' + $rootScope.other_user_id,
            url: BASE_URL + '/view_user_detail',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function(response) {
            $ionicLoading.hide();
            $scope.otherPro = response.data;
            $scope.rewiew = response;
        }).error(function(error) {
            $ionicLoading.hide();
        });
    }

    $scope.hireProvider = function(id) {
        swal({
            title: "Are you sure?",
            text: "You want to hire provider!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, Hire it!",
            cancelButtonText: "No, cancel please!",
            closeOnConfirm: false,
            closeOnCancel: false
        },
        function(isConfirm) {
            if (isConfirm) {
                swal("Hired!", "Successfully Hired.", "success");
                $userdata = localStorageService.get('customer_data');
                $ionicLoading.show({ template: '<ion-spinner icon="lines"></ion-spinner>' });
                $http({
                    method: 'POST',
                    data: 'user_token=' + $userdata.user_token + '&user_id=' + $userdata.id + '&job_id=' + $rootScope.jobid + '&other_user_id=' + $rootScope.other_user_id,
                    url: BASE_URL + 'hire_service_provider',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                }).success(function(response) {
                    $ionicLoading.hide();
                    $cordovaToast.showLongBottom(response.message).then(function(success) {}, function(error) {});
                    $state.go('tab.History');
                }).error(function(error) {
                    $ionicLoading.hide();
                });
            } else {
                swal("Cancelled", "", "error");
            }
        })
    }

    $scope.goReview = function(id) {
        $rootScope.proReview = id;
        $state.go("review");
    }

    $scope.messageProvider = function(id) {
        $rootScope.usreId = id;
        $state.go('conversations');
    }


})


.controller('reviewProfileCtrl', function($ionicPlatform, IMG_URL, $cordovaToast, $rootScope, localStorageService, $ionicLoading, BASE_URL, $http, $location, $scope, $state, $ionicHistory) {

    $ionicPlatform.registerBackButtonAction(function(event) {
        $ionicHistory.goBack();
    }, 200);

    $scope.myGoBack = function() {
        $ionicHistory.goBack();
    }

    $scope.img_url = IMG_URL;
    $scope.base_url = BASE_URL;

    $scope.readReview = function() {
        $ionicLoading.show({ template: '<ion-spinner icon="lines"></ion-spinner>' });
        $userdata = localStorageService.get('customer_data');
        $http({
            method: 'POST',
            data: 'user_token=' + $userdata.user_token + '&user_id=' + $userdata.id + '&receiver_id=' + $rootScope.proReview,
            url: BASE_URL + 'get_rating',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function(response) {
            $ionicLoading.hide();
            if (response.status == false) {
                $cordovaToast.showLongBottom(response.message).then(function(success) {}, function(error) {});
                if (response.message == "Session Expired!! Please login again.") {
                    $ionicLoading.hide();
                    localStorageService.remove('customer_data');
                    $ionicHistory.clearCache().then(function() {
                        $state.go('login');
                    })
                }
            } else {
                $ionicLoading.hide();
                $scope.allReviews = response.data;
            }
        }).error(function(error) {
            $ionicLoading.hide();
        });
    }

    $scope.go_profile = function() {
        $state.go('profile');
    }

    $scope.go_message = function() {
        $state.go('message');
    }


})


.controller('MessageCtrl', function($cordovaToast, IMG_URL, $ionicPlatform, $ionicScrollDelegate, $scope, $state, BASE_URL, localStorageService, $rootScope, $ionicHistory, $ionicLoading, $http, $ionicPopup) {

    $ionicPlatform.registerBackButtonAction(function(event) {
        $ionicHistory.goBack();
    }, 200);

    $scope.myGoBack = function() {
        $ionicHistory.goBack();
    }

    $scope.img_url = IMG_URL;

    $scope.Getmessages = function() {
        $ionicLoading.show({ template: '<ion-spinner icon="lines"></ion-spinner>' });
        $userdata = localStorageService.get('customer_data');
        $http({
            method: 'POST',
            data: 'user_token=' + $userdata.user_token + '&user_id=' + $userdata.id,
            url: BASE_URL + 'getLastChat',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function(response) {
            $ionicLoading.hide();
            if (response.status == false) {
                $ionicLoading.hide();
                if (response.message == "Session Expired!! Please login again.") {
                    $ionicLoading.hide();
                    $cordovaToast.showLongBottom(response.message).then(function(success) {}, function(error) {});
                    localStorageService.remove('customer_data');
                    $ionicHistory.clearCache().then(function() {
                        $state.go('login');
                    })
                } else if (response.message == "Data not found") {
                    $ionicLoading.hide();
                    $scope.noDataF = "img/result_found.jpg"
                }
            } else {
                $ionicLoading.hide();
                $scope.allMessages = response.data;
                $ionicLoading.hide();
            }
        }).error(function(error) {
            $ionicLoading.hide();
        });
    }

    $scope.doRefresh = function() {
        $userdata = localStorageService.get('customer_data');
        $http({
            method: 'POST',
            data: 'user_token=' + $userdata.user_token + '&user_id=' + $userdata.id,
            url: BASE_URL + 'getLastChat',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function(response) {
            if (response.status == false) {
                $ionicLoading.hide();
                if (response.message == "Session Expired!! Please login again.") {
                    $ionicLoading.hide();
                    $cordovaToast.showLongBottom(response.message).then(function(success) {}, function(error) {});
                    localStorageService.remove('customer_data');
                    $ionicHistory.clearCache().then(function() {
                        $state.go('login');
                    })
                }
            } else {
                $scope.allMessages = response.data;
            }
        }).error(function(error) {
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


.controller('ChatsCtrl', function($cordovaToast,$ionicScrollDelegate, $timeout, $interval, $ionicPlatform, $ionicScrollDelegate, $scope, $state, BASE_URL, localStorageService, $rootScope, $ionicHistory, $ionicLoading, $http, $ionicPopup) {

    $ionicPlatform.registerBackButtonAction(function(event) {
        $ionicHistory.goBack();
    }, 200);

    $userdata = localStorageService.get('customer_data');
    console.log($userdata);

    if($userdata.device_id == "null"){
        var interval = $interval(function () {
            $rootScope.chatConverCus();
        }, 5000);
    }else{
        console.log("All is well");
    } 
    
    $scope.$on('$destroy',function(){
    if(interval)
        $interval.cancel(interval);   
    });

    $scope.myGoBack = function() {
        $ionicHistory.goBack();
    }

    var tz = jstz.determine();
    var timezone = tz.name();
    console.log(timezone);

    $rootScope.chatConverCus = function() {
        $ionicScrollDelegate.scrollBottom(true);
        $scope.othr_id = $rootScope.usreId;
        $scope.my_id = $userdata.id;
        $http({
            method: 'POST',
            data: 'user_token=' + $userdata.user_token + '&reciver_id=' + $rootScope.usreId + '&sender_id=' + $userdata.id + '&timezone=' + timezone,
            url: BASE_URL + 'getChat',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function(response) {
            if (response.status == false) {
                if (response.message == "Session Expired!! Please login again.") {
                    $cordovaToast.showLongBottom(response.message).then(function(success) {}, function(error) {});
                    localStorageService.remove('customer_data');
                    $ionicHistory.clearCache().then(function() {
                        $state.go('login');
                    })
                }
            } else {
                $scope.chatDta = response.data;
                $ionicScrollDelegate.scrollBottom(true);
            }
        }).error(function(error) {
            console.log(error);
        })
    }

    $scope.sendMessage = function(data) {
        console.log(data);
        // $userdata = localStorageService.get('customer_data');
        $http({
            method: 'POST',
            data: 'user_token=' + $userdata.user_token + '&reciver_id=' + $rootScope.usreId + '&sender_id=' + $userdata.id + '&message=' + data + '&timezone=' + timezone,
            url: BASE_URL + 'chat',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function(response) {
            $ionicLoading.hide();
            if (response.status == false) {
                if (response.message == "Session Expired!! Please login again.") {
                    $ionicLoading.hide();
                    $cordovaToast.showLongBottom(response.message).then(function(success) {}, function(error) {});
                    localStorageService.remove('customer_data');
                    $ionicHistory.clearCache().then(function() {
                        $state.go('login');
                    })
                }
            } else {
                $scope.chatDta = response.data;
                $ionicScrollDelegate.scrollBottom(true);
            }
        }).error(function(error) {
            $ionicLoading.hide();
        });
    }

    $scope.inputUp = function() {
        $timeout(function() {
            $ionicScrollDelegate.scrollBottom(true);
        }, 1000);
    }

    $scope.inputDown = function() {
        $timeout(function() {
            $ionicScrollDelegate.resize();
        }, 1000);
    }

})


.controller('paymentCtrl', function($ionicPlatform, $ionicScrollDelegate, $scope, $state, BASE_URL, localStorageService, $rootScope, $ionicHistory, $ionicLoading, $http, $ionicPopup) {

    $ionicPlatform.registerBackButtonAction(function(event) {
        $ionicHistory.goBack();
    }, 200);

    $scope.myGoBack = function() {
        $ionicHistory.goBack();
    }

    $scope.go_card = function() {
        $state.go('make_pay_add_card');
    }

    $scope.go_paypal1 = function() {

    }

    $scope.rValue = function(value) {
        $scope.lastDi = value;
    }

})


.controller('notificationCtrl', function($cordovaToast,IMG_URL, $interval, $ionicPlatform, $ionicScrollDelegate, $scope, $state, BASE_URL, localStorageService, $rootScope, $ionicHistory, $ionicLoading, $http, $ionicPopup) {

    $ionicPlatform.registerBackButtonAction(function(event) {
        $ionicHistory.goBack();
    }, 200);

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

    $scope.GetNotification = function() {
        $userdata = localStorageService.get('customer_data');
        $ionicLoading.show({ template: '<ion-spinner icon="lines"></ion-spinner>' });
        $http({
            method: 'POST',
            data: 'user_token=' + $userdata.user_token + '&user_id=' + $userdata.id,
            url: BASE_URL + 'notification_history',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function(response) {
            $ionicLoading.hide();
            if (response.status == false) {
                $ionicLoading.hide();
                if (response.message == "Session Expired!! Please login again.") {
                    $ionicLoading.hide();
                    $cordovaToast.showLongBottom(response.message).then(function(success) {}, function(error) {});
                    localStorageService.remove('customer_data');
                    $ionicHistory.clearCache().then(function() {
                        $state.go('login');
                    })
                } else if (response.message == "Data not found") {
                    $ionicLoading.hide();
                    $scope.notFound = "img/result_found.jpg";
                }
            } else {
                $scope.notiHis = response.data;
            }
        }).error(function(error) {
            $ionicLoading.hide();
        })
    }

    $scope.goHis = function(id) {
        $userdata = localStorageService.get('customer_data');
        $http({
            method: 'POST',
            data: 'user_token=' + $userdata.user_token + '&user_id=' + $userdata.id + '&notification_id=' + id,
            url: BASE_URL + 'read_notification',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function(response) {
            $ionicLoading.hide();
            if (response.status == false) {
                $ionicLoading.hide();
                if (response.message == "Session Expired!! Please login again.") {
                    $ionicLoading.hide();
                    $cordovaToast.showLongBottom(response.message).then(function(success) {}, function(error) {});
                    localStorageService.remove('customer_data');
                    $ionicHistory.clearCache().then(function() {
                        $state.go('login');
                    })
                }
            } else {
                $state.go("tab.History");
            }
        }).error(function(error) {
            $ionicLoading.hide();
        })

    }

    $scope.goHome = function(id) {
        $userdata = localStorageService.get('customer_data');
        $http({
            method: 'POST',
            data: 'user_token=' + $userdata.user_token + '&user_id=' + $userdata.id + '&notification_id=' + id,
            url: BASE_URL + 'read_notification',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function(response) {
            $ionicLoading.hide();
             if (response.status == false) {
                $ionicLoading.hide();
                if (response.message == "Session Expired!! Please login again.") {
                    $ionicLoading.hide();
                    $cordovaToast.showLongBottom(response.message).then(function(success) {}, function(error) {});
                    localStorageService.remove('customer_data');
                    $ionicHistory.clearCache().then(function() {
                        $state.go('login');
                    })
                }
            } else {
                $state.go('tab.customer_home');
            }
        }).error(function(error) {
            $ionicLoading.hide();
        })
    }

    $scope.goChat = function(id) {
        $userdata = localStorageService.get('customer_data');
        $http({
            method: 'POST',
            data: 'user_token=' + $userdata.user_token + '&user_id=' + $userdata.id + '&notification_id=' + id,
            url: BASE_URL + 'read_notification',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function(response) {
            $ionicLoading.hide();
             if (response.status == false) {
                $ionicLoading.hide();
                if (response.message == "Session Expired!! Please login again.") {
                    $ionicLoading.hide();
                    $cordovaToast.showLongBottom(response.message).then(function(success) {}, function(error) {});
                    localStorageService.remove('customer_data');
                    $ionicHistory.clearCache().then(function() {
                        $state.go('login');
                    })
                }
            } else {
                $state.go("message");
            }
        }).error(function(error) {
            $ionicLoading.hide();
        })
    }

})

.controller('aboutCtrl', function($ionicPlatform, $cordovaToast, $rootScope, localStorageService, $ionicLoading, BASE_URL, $http, $location, $scope, $state, $ionicHistory) {

    $ionicPlatform.registerBackButtonAction(function(event) {
        $ionicHistory.goBack();
    }, 200);

    $scope.myGoBack = function() {
        $ionicHistory.goBack();
    }

})

.controller('contactCtrl', function($ionicPlatform, $cordovaToast, $rootScope, localStorageService, $ionicLoading, BASE_URL, $http, $location, $scope, $state, $ionicHistory) {

    $ionicPlatform.registerBackButtonAction(function(event) {
        $ionicHistory.goBack();
    }, 200);

    $scope.myGoBack = function() {
        $ionicHistory.goBack();
    }

    $scope.contactUsG = function(user, $valid) {
        $userdata = localStorageService.get('customer_data');
        $scope.submitted = true;
        if ($valid) {
            $ionicLoading.show({ template: '<ion-spinner icon="lines"></ion-spinner>' });
            $http({
                method: 'POST',
                data: 'user_token=' + $userdata.user_token + '&user_id=' + $userdata.id + '&email=' + user.email + '&subject=' + user.subject + '&message=' + user.message,
                url: BASE_URL + 'contactUs',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function(response) {
                $ionicLoading.hide();
                if (response.status == false) {
                    $ionicLoading.hide();
                    if (response.message == "Session Expired!! Please login again.") {
                        $cordovaToast.showLongBottom("Session Expired!! Please login again.").then(function(success) {}, function(error) {});
                        localStorageService.remove('customer_data');
                        $ionicHistory.clearCache().then(function() {
                            $state.go('login');
                        })
                    }
                } else {
                    $cordovaToast.showLongBottom(response.message).then(function(success) {}, function(error) {});
                    $state.go("tab.account");
                }
            }).error(function(error) {
                $cordovaToast.showLongBottom(error).then(function(success) {}, function(error) {});
                $ionicLoading.hide();
            })
        } else {
            $ionicLoading.hide();
            // $cordovaToast.showLongBottom("Please fill required fields").then(function(success) { }, function(error) {});
        }
    }

})

.controller('privacyCtrl', function($ionicPlatform, $cordovaToast, $rootScope, localStorageService, $ionicLoading, BASE_URL, $http, $location, $scope, $state, $ionicHistory) {

    $ionicPlatform.registerBackButtonAction(function(event) {
        $ionicHistory.goBack();
    }, 200);

    $scope.myGoBack = function() {
        $ionicHistory.goBack();
    }

})

.controller('termConCtrl', function($ionicPlatform, $cordovaToast, $rootScope, localStorageService, $ionicLoading, BASE_URL, $http, $location, $scope, $state, $ionicHistory) {

    $ionicPlatform.registerBackButtonAction(function(event) {
        $ionicHistory.goBack();
    }, 200);

    $scope.myGoBack = function() {
        $ionicHistory.goBack();
    }

})


//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////// Service Provider /////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////


.controller('SignupProviderCtrl', function($ionicPlatform, $ionicHistory, $cordovaToast, $scope, $state, $cordovaToast, $ionicPopup, $ionicLoading, $http, BASE_URL, localStorageService) {

    $ionicPlatform.registerBackButtonAction(function(event) {
        $ionicHistory.goBack();
    }, 200);

    $scope.myGoBack = function() {
        $ionicHistory.goBack();
    }

    $scope.loginGo = function() {
        $state.go('login', {}, { reload: true });
    }

    $scope.privacySign = function() {
        var ref = window.open('http://halphero.com/privacy.html', '_blank', 'location=yes');
    }

    $scope.termConditionS = function() {
        var ref = window.open('http://halphero.com/terms&condition.html', '_blank', 'location=yes');
    }


    $scope.create_profile = function($dataa, $valid) {
        var device_token = localStorageService.get('device_token');
        $scope.submitted = true;
        if ($valid) {
            $dataa.user_type = 'sp';
            $dataa.device_type = ionic.Platform.device().platform;
            $dataa.device_id = device_token;
            $dataa.registration_type = "O";
            $ionicLoading.show({ template: '<ion-spinner icon="lines"></ion-spinner>' });
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
                if (data.status == true) {
                    $ionicLoading.hide();
                    $cordovaToast.showLongBottom(data.message).then(function(success) {}, function(error) {
                    });
                    localStorageService.set('customer_data', data.data);
                    $state.go('createprofile_provider');
                } else {
                    $ionicLoading.hide();
                    if (data.type == 'email')
                        $scope.errorEmail = data.message;
                    else
                        $scope.errorMessages = data.message;
                }
            }).error(function(data) {
                $ionicPopup.alert({
                    title: 'Message',
                    template: data
                });
                $ionicLoading.hide();
            });
        } else {
            // $cordovaToast.showLongBottom("Please fill required fields").then(function(success) {
            // }, function(error) {
            // });
        }
    }

})


.controller('CreateProfileProviderCtrl', function($ionicHistory, $filter, $ionicPlatform, $cordovaToast, $scope, $state, $ionicPopup, $ionicLoading, $http, BASE_URL, localStorageService, $cordovaCamera, $ionicActionSheet, $cordovaFileTransfer, $rootScope, $timeout) {

    $ionicPlatform.registerBackButtonAction(function(event) {}, 200);

    $scope.user = {};

    $scope.disableTap = function() {
        container = document.getElementsByClassName('pac-container');
        angular.element(container).attr('data-tap-disabled', 'true');
        angular.element(container).on("click", function() {
            document.getElementById('searchTextField').blur();
        })
    }

    $scope.setLatLong = function(lat, long) {
        $scope.lat = lat;
        $scope.lng = long;
    }


    var selectedDate;
    $scope.checkDate = function(DOB) {
        $scope.DOB = DOB;
        var selectedText = document.getElementById('datepicker').value;
        $rootScope.selectedDate = new Date(selectedText);
        var date = new Date();
        date.setHours(0, 0, 0, 0);
        $rootScope.now = date;
        if ($rootScope.selectedDate > $rootScope.now) {
            alert("Date of birth should be before today.");
            $scope.DOB = "";
        }
    }


    function initialize() {
        var input = document.getElementById('searchTextField');
        var options = {
            types: ['address']
        };
        var autocomplete = new google.maps.places.Autocomplete(input, options);
        google.maps.event.addListener(autocomplete, 'place_changed', function() {
            var place = autocomplete.getPlace();
            console.log(place);
            $scope.user.city = place.formatted_address;
            for (var i = 0; i < place.address_components.length; i++) {
                for (var j = 0; j < place.address_components[i].types.length; j++) {
                    if (place.address_components[i].types[j] == "country") {
                        $scope.country = place.address_components[i].long_name;
                    }
                }
            }
            $scope.user.address = place.name;
            // document.getElementById('city2').value = place.name;
            // document.getElementById('cityLat').value = place.geometry.location.lat();
            // document.getElementById('cityLng').value = place.geometry.location.lng();
            document.getElementById('country').value = $scope.country;
            $scope.user.country = $scope.country;
            // document.getElementById('city').value = $scope.city;
        });
    }
    google.maps.event.addDomListener(window, 'load', initialize);
    initialize();


    $scope.go_home = function($dataa, $valid) {
        $dataa.DOB = $filter('date')($dataa.DOB, "yyyy-MM-dd");
        var device_token = localStorageService.get('device_token');
        $scope.currentPlatform = ionic.Platform.platform();
        $scope.submitted = true;
        $userdata = localStorageService.get('customer_data');
        if ($valid) {
            if ($rootScope.selectedDate > $rootScope.now) {
                $cordovaToast.showLongBottom("Date of birth should be before today.").then(function(success) {}, function(error) {});
                $dataa.DOB = "";
                return;
            } else {}
            $ionicLoading.show({ template: '<ion-spinner icon="lines"></ion-spinner>' });
            var url = BASE_URL + 'update_profile';
            if ($rootScope.my_profile_image) {
                var targetPath = $rootScope.my_profile_image;
                var filename = targetPath.split("/").pop();
                filename = filename.split('?');
                var options = {
                    fileKey: "pic",
                    fileName: filename[0],
                    chunkedMode: false,
                    mimeType: "image/jpg",
                };
                var params = {};
                params.user_token = $userdata.user_token;
                params.user_id = $userdata.id;
                params.country = $dataa.country;
                params.city = $dataa.city;
                params.device_id = device_token;
                params.device_type = $scope.currentPlatform;
                params.price = $dataa.price;
                params.experience = $dataa.experience;
                params.about_me = $dataa.about_me;
                params.job_type = $dataa.job_type;
                params.DOB = $filter('date')($dataa.DOB, "yyyy-MM-dd");
                options.params = params;
                $cordovaFileTransfer.upload(url, targetPath, options).then(function(result) {
                    $ionicLoading.hide();
                    var hh = JSON.parse(result.response);
                    if (hh.status == true) {
                        $ionicLoading.hide();
                        localStorageService.set('customer_data', hh.data);
                        $state.go('add_account');
                    } else {
                        $ionicLoading.hide();
                        $cordovaToast.showLongBottom(hh.message).then(function(success) {}, function(error) {})
                        return false;
                    }
                }, function(err) {
                    $ionicLoading.hide();
                    $scope.imgURI = undefined;
                    $cordovaToast.showLongBottom(err.msg).then(function(success) {}, function(error) {});
                }, function(progress) {
                    $ionicLoading.hide();
                    $ionicLoading.show({
                        template: '<ion-spinner icon="lines"></ion-spinner>'
                    });
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
                        $state.go('add_account');
                    } else {
                        $ionicLoading.hide();
                    }
                }).error(function(data) {
                    $ionicLoading.hide();
                    $cordovaToast.showLongBottom(data.message).then(function(success) {}, function(error) {});
                });
            }
        } else {
            $ionicLoading.hide();
            //  $cordovaToast.showLongBottom("Please fill required fields").then(function(success) {
            //      }, function(error) {
            //  });
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
                        quality: 100,
                        allowEdit: true,
                        targetWidth: 500,
                        targetHeight: 500,
                        sourceType: Camera.PictureSourceType.CAMERA,
                        correctOrientation: true,
                        encodingType: Camera.EncodingType.JPEG,
                        destinationType: Camera.DestinationType.FILE_URI
                    });
                } else if (index == 1) {
                    takePicture2({
                        quality: 100,
                        allowEdit: true,
                        targetWidth: 500,
                        targetHeight: 500,
                        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                        encodingType: Camera.EncodingType.JPEG,
                        correctOrientation: true,
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
            $rootScope.my_profile_image = imageURI;
        }, function(err) {});
    }

    $scope.upload_document = function() {
        options = {
            quality: 80,
            allowEdit: true,
            targetWidth: 400,
            targetHeight: 400,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            encodingType: Camera.EncodingType.JPEG,
            destinationType: Camera.DestinationType.FILE_URI,
            correctOrientation: true,
            MediaType: Camera.MediaType.ALLMEDIA
        };
        $cordovaCamera.getPicture(options).then(function(imageData) {
            $scope.imageUri = imageData;
            $rootScope.docs = imageData;
        }, function(err) {});
    }

})


.controller('accountCtrl', function($ionicPlatform, $ionicHistory, $cordovaToast, $scope, $state, $cordovaToast, $ionicPopup, $ionicLoading, $http, BASE_URL, localStorageService) {

    $ionicPlatform.registerBackButtonAction(function(event) {
        // $ionicHistory.goBack();
    }, 200);

    $scope.myGoBack = function() {
        $ionicHistory.goBack();
    }

    $scope.skipaccount = function(){
        $state.go('purchase');
    }

    $scope.addBankDetail = function(data, valid) {
        $userdata = localStorageService.get('customer_data');
        if (valid) {
            $ionicLoading.show({ template: '<ion-spinner icon="lines"></ion-spinner>' });
            $http({
                method: 'POST',
                data: 'user_token=' + $userdata.user_token + '&user_id=' + $userdata.id + '&bankName=' + data.bank_name + '&accountNumber=' + data.account_number + '&routingNumber=' + data.routing_number + '&accountName=' + data.account_name,
                url: BASE_URL + 'add_benificiary_account/',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function(response) {
                console.log(response);
                $ionicLoading.hide();
                if (response.status == true) {
                    $ionicLoading.hide();
                    localStorageService.set('customer_data', response.data);
                    $state.go('purchase');
                } else {
                    $ionicLoading.hide();
                    $cordovaToast.showLongBottom(response.message).then(function(success) {}, function(error) {});
                }
            }).error(function(error) {
                $ionicLoading.hide();
            });
        } else {
            $cordovaToast.showLongBottom("Please fill required fields").then(function(success) {}, function(error) {});
        }
    }

})


.controller('homeCtrl', function($ionicPopup, $ionicPlatform, $cordovaToast, $location, $scope, $rootScope, $state, $http, $location, BASE_URL, $ionicHistory, $ionicLoading, localStorageService) {

    $userdata = localStorageService.get('customer_data');
    if ($userdata.purchase == 'n') {
        $state.go("purchase");
    }

    $ionicPlatform.registerBackButtonAction(function(event) {
        if ($state.current.name == "tab1.home") {
            $ionicPopup.confirm({
                title: 'EXIT',
                template: 'Are you sure you want to Exit?'
            }).then(function(res) {
                if (res) {
                    ionic.Platform.exitApp();
                }
            })
        }
    }, 200);

    $scope.cusdata = [];
    $scope.getjobsProvider = function() {
        $userdata = localStorageService.get('customer_data');
        $scope.inapp = $userdata.purchase;
        var params = {
            'user_token': $userdata.user_token
        };
        $ionicLoading.show({ template: '<ion-spinner icon="lines"></ion-spinner>' });
        if($userdata.account_activate == '0'){
        var Url = BASE_URL + '/get_all_jobs';
        var config = {
            headers: {
                'Content-Type': 'application/json;'
            }
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
            $ionicLoading.hide();
            if (data.status == false) {
                $ionicLoading.hide();
                if (response.message == "Session Expired!! Please login again.") {
                    $ionicLoading.hide();
                    $cordovaToast.showLongBottom("Session Expired!! Please login again.").then(function(success) {}, function(error) {});
                    localStorageService.remove('customer_data');
                    $ionicHistory.clearCache().then(function() {
                        $state.go('login');
                    })
                }
            } else {
                $ionicLoading.hide();
                $scope.cusdata = data.data;
            }
        }).error(function(data) {
            $ionicLoading.hide();
            $cordovaToast.showLongBottom(data.message).then(function(success) {}, function(error) {});
        });
        }else{
            $ionicLoading.hide();
            swal('Please varify your account and login again')
        }
    }

    $scope.doRefresh = function() {
        if($userdata.account_activate == '0'){
        $userdata = localStorageService.get('customer_data');
        $scope.submitted = true;
        var params = {
            'user_token': $userdata.user_token
        };
        var Url = BASE_URL + 'get_all_jobs';
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
            if (data.status == false) {
                $ionicLoading.hide();
                if (response.message == "Session Expired!! Please login again.") {
                    $ionicLoading.hide();
                    $cordovaToast.showLongBottom("Session Expired!! Please login again.").then(function(success) {}, function(error) {});
                    localStorageService.remove('customer_data');
                    $ionicHistory.clearCache().then(function() {
                        $state.go('login');
                    })
                } else if (response.message == "Data not Found!") {
                    $ionicLoading.hide();
                    $scope.noDataF = "img/result_found.jpg"
                }
            } else {
                $ionicLoading.hide();
                $scope.cusdata = data.data;
            }
        }).error(function(data) {
            $ionicLoading.hide();
            $cordovaToast.showLongBottom(data.message).then(function(success) {}, function(error) {});
        }).finally(function() {
            $scope.$broadcast('scroll.refreshComplete');
        })
    }else{
       swal('Please varify your account and login again')
            return; 
    }
        
    };

    $scope.go_detail_customer = function(id) {
        $rootScope.jobid = id;
        $state.go('job_detail');
        // $location.url("job_detail?id");
        // $scope.job_dataa();
    }

    $scope.go_detail = function() {
        $state.go('job_detail');
    }

    $scope.go_profile = function() {
        $state.go('profile_provider');
    }

    $scope.go_message = function() {
        $state.go('message_provider');
    }


})


.controller('JobDetailCtrl', function($ionicPlatform, IMG_URL, $cordovaToast, $scope, $state, BASE_URL, localStorageService, $rootScope, $ionicHistory, $ionicLoading, $http, $ionicPopup) {

    $userdata = localStorageService.get('customer_data');
    if ($userdata.purchase == 'n') {
        $state.go("purchase");
    }

    $ionicPlatform.registerBackButtonAction(function(event) {
        $ionicHistory.goBack();
    }, 200);

    $scope.myGoBack = function() {
        $ionicHistory.goBack();
    }

    $scope.img_url = IMG_URL;

    $scope.go_job_applicants = function() {
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
            'user_type': 'sp'
        }
        $ionicLoading.show({ template: '<ion-spinner icon="lines"></ion-spinner>' });
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
            $ionicLoading.hide();
            if (data.status == false) {
                $ionicLoading.hide();
                if(response.message == "Session Expired!! Please login again.") {
                    $ionicLoading.hide();
                    $cordovaToast.showLongBottom("Session Expired!! Please login again.").then(function(success) {}, function(error) {});
                    localStorageService.remove('customer_data');
                    $ionicHistory.clearCache().then(function() {
                        $state.go('login');
                    })
                }
                // $rootScope.jobtype = $scope.jobdata.price_type;
            } else {
                $ionicLoading.hide();
                $scope.status = data;
                $scope.creater = data.job_creater;
                $scope.jobdata = data.data;
            }
        }).error(function(data) {
            $ionicLoading.hide();
            $cordovaToast.showLongBottom(data.message).then(function(success) {}, function(error) {});
        });
    }
    $scope.job_dataa();


    $scope.job_type = function() {
        if ($rootScope.jobtype == 'F') {
            $scope.pricetype = 'Fixed';
        } else {
            $scope.pricetype = 'Hourly';
        }
    }
    $scope.job_type();


    $scope.applyJob = function(id, user_id) {
        swal({
            title: "Are you sure?",
            text: "You want to Apply this job!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, Apply it!",
            cancelButtonText: "No, cancel please!",
            closeOnConfirm: false,
            closeOnCancel: false
        },
        function(isConfirm) {
            if (isConfirm) {
                swal("Start!", "Successfully started.", "success");
                $userdata = localStorageService.get('customer_data');
                $ionicLoading.show({ template: '<ion-spinner icon="lines"></ion-spinner>' });
                $http({
                    method: 'POST',
                    data: 'user_token=' + $userdata.user_token + '&user_id=' + $userdata.id + '&job_id=' + id + '&user_type=' + 'sp',
                    url: BASE_URL + '/apply_for_job',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                }).success(function(response) {
                    $ionicLoading.hide();
                    console.log(response);
                    if (response.status == false) {
                        $cordovaToast.showLongBottom(response.message).then(function(success) {}, function(error) {});
                    } else {
                        $ionicLoading.hide();
                        $scope.job_dataa();
                        $cordovaToast.showLongBottom("Successfully Applied").then(function(success) {}, function(error) {});
                        $scope.datU = response.job_creator_details;
                    }
                }).error(function(error) {
                    $ionicLoading.hide();
                });
            } else {
                swal("Cancelled", "", "error");
            }
        })
    }


    $scope.startJob = function(job_id) {
        swal({
            title: "Are you sure?",
            text: "You want to start this job!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, start it!",
            cancelButtonText: "No, cancel please!",
            closeOnConfirm: false,
            closeOnCancel: false
        },
        function(isConfirm) {
            if (isConfirm) {
                swal("Start!", "Successfully started.", "success");
                $userdata = localStorageService.get('customer_data');
                $ionicLoading.show({ template: '<ion-spinner icon="lines"></ion-spinner>' });
                $http({
                    method: 'POST',
                    data: 'user_token=' + $userdata.user_token + '&sp_id=' + $userdata.id + '&job_id=' + job_id,
                    url: BASE_URL + 'start_job',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                }).success(function(response) {
                    $ionicLoading.hide();
                    if (response.status == false) {
                        $ionicLoading.hide();
                        if (response.message == "Session Expired!! Please login again.") {
                            $ionicLoading.hide();
                            $cordovaToast.showLongBottom(response.message).then(function(success) {}, function(error) {});
                            localStorageService.remove('customer_data');
                            $ionicHistory.clearCache().then(function() {
                                $state.go('login');
                            })
                        }
                    } else {
                        $ionicLoading.hide();
                        $state.go('tab1.myjobs');
                        $cordovaToast.showLongBottom("Successfully Started").then(function(success) {}, function(error) {});
                    }
                }).error(function(error) {
                    $ionicLoading.hide();
                });
            } else {
                swal("Cancelled", "", "error");
            }
        })
    }

    $scope.canceljob = function(job_id) {
        swal({
            title: "Are you sure?",
            text: "You want to Cancel this job!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, start it!",
            cancelButtonText: "No, cancel please!",
            closeOnConfirm: false,
            closeOnCancel: false
        },
        function(isConfirm) {
            if (isConfirm) {
                swal("Cancel!", "Successfully Cancelled.", "success");
                $userdata = localStorageService.get('customer_data');
                $ionicLoading.show({ template: '<ion-spinner icon="lines"></ion-spinner>' });
                $http({
                    method: 'POST',
                    data: 'user_token=' + $userdata.user_token + '&sp_id=' + $userdata.id + '&job_id=' + job_id,
                    url: BASE_URL + 'reject_job/',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                }).success(function(response) {
                    $ionicLoading.hide();
                    if (response.status == false) {
                        $ionicLoading.hide();
                        if (response.message == "Session Expired!! Please login again.") {
                            $ionicLoading.hide();
                            $cordovaToast.showLongBottom(response.message).then(function(success) {}, function(error) {});
                            localStorageService.remove('customer_data');
                            $ionicHistory.clearCache().then(function() {
                                $state.go('login');
                            })
                        }
                    } else {
                        $ionicLoading.hide();
                        $state.go('tab1.home');
                        $cordovaToast.showLongBottom("Successfully Canceled").then(function(success) {}, function(error) {});
                    }
                }).error(function(error) {
                    $ionicLoading.hide();
                });
            } else {
                swal("Cancelled", "", "error");
            }
        })
    }

    $scope.messageG = function(id) {
        $rootScope.ch_id_cus = id;
        $state.go('conversations_provider');
    }


})


.controller('MyjobsCtrl', function($ionicPlatform, $cordovaToast, $scope, $state, BASE_URL, localStorageService, $rootScope, $ionicHistory, $ionicLoading, $http, $ionicPopup) {

    $userdata = localStorageService.get('customer_data');
    if ($userdata.purchase == 'n') {
        $state.go("purchase");
    }

    $ionicPlatform.registerBackButtonAction(function(event) {
        $ionicHistory.goBack();
    }, 200);

    $scope.myGoBack = function() {
        $ionicHistory.goBack();
    };

    $scope.myJob = "My Jobs";

    $scope.myJobsIn = function() {
        $userdata = localStorageService.get('customer_data');
        $ionicLoading.show({ template: '<ion-spinner icon="lines"></ion-spinner>' });
        $http({
            method: 'POST',
            data: 'user_token=' + $userdata.user_token + '&sp_id=' + $userdata.id,
            url: BASE_URL + 'getJobstatus/',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function(response) {
            $ionicLoading.hide();
            if (response.status == false) {
                $ionicLoading.hide();
                $cordovaToast.showLongBottom(response.message).then(function(success) {}, function(error) {});
                if (response.message == "Session Expired!! Please login again.") {
                    $ionicLoading.hide();
                    $cordovaToast.showLongBottom("Session Expired!! Please login again.").then(function(success) {}, function(error) {});
                    localStorageService.remove('customer_data');
                    $ionicHistory.clearCache().then(function() {
                        $state.go('login');
                    })
                }
            } else {
                $ionicLoading.hide();
                $scope.allJobSt = response.data;
            }
        }).error(function(error) {
            $ionicLoading.hide();
        });
    }


    $scope.doRefresh = function() {
        $userdata = localStorageService.get('customer_data');
        $http({
            method: 'POST',
            data: 'user_token=' + $userdata.user_token + '&sp_id=' + $userdata.id,
            url: BASE_URL + '/getJobstatus',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function(response) {
            $ionicLoading.hide();
            if (response.status == false) {
                $ionicLoading.hide();
                $cordovaToast.showLongBottom(response.message).then(function(success) {}, function(error) {});
                if (response.message == "Session Expired!! Please login again.") {
                    $ionicLoading.hide();
                    $cordovaToast.showLongBottom("Session Expired!! Please login again.").then(function(success) {}, function(error) {});
                    localStorageService.remove('customer_data');
                    $ionicHistory.clearCache().then(function() {
                        $state.go('login');
                    })
                }
            } else {
                $ionicLoading.hide();
                $scope.allJobSt = response.data;
            }
        }).finally(function() {
            $scope.$broadcast('scroll.refreshComplete');
        })
    }

    $scope.jobDetailsUpcoming = function(id) {
        $rootScope.job_i = id;
        $state.go('job_detail_applied');
    }

    $scope.jobDetailWaiting = function(id) {
        $rootScope.job_i = id;
        $state.go('job_detail_applied');
    }

    $scope.jobDetailInprogress = function(id) {
        $rootScope.job_i = id;
        $state.go('job_detail_applied');
    }

    $scope.go_profile = function() {
        $state.go('profile_provider');
    }

    $scope.go_message = function() {
        $state.go('message_provider');
    }

})


.controller('CompletedjobsCtrl', function($ionicPlatform, $cordovaToast, $scope, $state, BASE_URL, localStorageService, $rootScope, $ionicHistory, $ionicLoading, $http, $ionicPopup) {

    $userdata = localStorageService.get('customer_data');
    if ($userdata.purchase == 'n') {
        $state.go("purchase");
    }

    $ionicPlatform.registerBackButtonAction(function(event) {
        $ionicHistory.goBack();
    }, 200);


    $scope.compJob = function() {
        $userdata = localStorageService.get('customer_data');
        $ionicLoading.show({ template: '<ion-spinner icon="lines"></ion-spinner>' });
        $http({
            method: 'POST',
            data: 'user_token=' + $userdata.user_token + '&sp_id=' + $userdata.id,
            url: BASE_URL + 'getJobstatus',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function(response) {
            $ionicLoading.hide();
            if (response.status == false) {
                $ionicLoading.hide();
                if (response.message == "Session Expired!! Please login again.") {
                    $ionicLoading.hide();
                    $cordovaToast.showLongBottom(response.message).then(function(success) {}, function(error) {});
                    localStorageService.remove('customer_data');
                    $ionicHistory.clearCache().then(function() {
                        $state.go('login');
                    })
                }
            } else {
                $ionicLoading.hide();
                $scope.completeJ = response.data;
            }
            $ionicLoading.hide();
        }).error(function(error) {
            $ionicLoading.hide();
        });
    }

    $scope.doRefresh = function() {
        $userdata = localStorageService.get('customer_data');
        $http({
            method: 'POST',
            data: 'user_token=' + $userdata.user_token + '&sp_id=' + $userdata.id,
            url: BASE_URL + '/getJobstatus',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function(response) {
            if (response.status == false) {
                if (response.message == "Session Expired!! Please login again.") {
                    $ionicLoading.hide();
                    $cordovaToast.showLongBottom(response.message).then(function(success) {}, function(error) {});
                    localStorageService.remove('customer_data');
                    $ionicHistory.clearCache().then(function() {
                        $state.go('login');
                    })
                }
            } else {
                $scope.completeJ = response.data;
            }
        }).finally(function() {
            $scope.$broadcast('scroll.refreshComplete');
        })
    }

    $scope.job_detail_completed = function(id) {
        $rootScope.jo_id = id;
        $state.go('job_detail_completed');
    }

    $scope.go_profile = function() {
        $state.go('profile_provider');
    }

    $scope.go_message = function() {
        $state.go('message_provider');
    }

})


.controller('JobDetailCompletedCtrl', function($ionicPlatform, IMG_URL, $cordovaToast, $scope, $state, BASE_URL, localStorageService, $rootScope, $ionicHistory, $ionicLoading, $http, $ionicPopup) {

    $userdata = localStorageService.get('customer_data');
    if ($userdata.purchase == 'n') {
        $state.go("purchase");
    }

    $ionicPlatform.registerBackButtonAction(function(event) {
        $ionicHistory.goBack();
    }, 200);

    $scope.img_url = IMG_URL;
    $scope.com = "completed Job Detail";

    $scope.myGoBack = function() {
        $ionicHistory.goBack();
    };

    $scope.jDetailsCom = function() {
        $userdata = localStorageService.get('customer_data');
        $ionicLoading.show({ template: '<ion-spinner icon="lines"></ion-spinner>' });
        $http({
            method: 'POST',
            data: 'user_token=' + $userdata.user_token + '&user_id=' + $userdata.id + '&job_id=' + $rootScope.jo_id + '&user_type=' + 'sp',
            url: BASE_URL + '/get_job_detail',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function(response) {
            $ionicLoading.hide();
            if (response.status == false) {
                $ionicLoading.hide();
                if (response.message == "Session Expired!! Please login again.") {
                    $ionicLoading.hide();
                    $cordovaToast.showLongBottom(response.message).then(function(success) {}, function(error) {});
                    localStorageService.remove('customer_data');
                    $ionicHistory.clearCache().then(function() {
                        $state.go('login');
                    })
                }
            } else {
                $ionicLoading.hide();
                $scope.allJobDetailsComplet = response.data;
                $scope.jobCreatrCompleteJo = response.job_creater;
            }
        }).error(function(error) {
            $ionicLoading.hide();
        });
    }

    $scope.compJmessage = function(id) {
        $rootScope.ch_id_cus = id
        $state.go('conversations_provider');
    }

    $scope.viewServRec = function(id, user_id) {
        $rootScope.viSerRe = id;
        $rootScope.rateOtherUser = user_id;
        $state.go("receipt_provider");
    }


})


.controller('JobDetailApplied', function($ionicPlatform, IMG_URL, localStorageService, $rootScope, $ionicHistory, $ionicLoading, $http, $ionicPopup, $cordovaToast, $scope, $state, BASE_URL) {

    $userdata = localStorageService.get('customer_data');
    if ($userdata.purchase == 'n') {
        $state.go("purchase");
    }

    $ionicPlatform.registerBackButtonAction(function(event) {
        $ionicHistory.goBack();
    }, 200);

    $scope.img_url = IMG_URL;
    $scope.jobDetails = "Job Detail";

    $scope.myGoBack = function() {
        $ionicHistory.goBack();
    };

    $scope.Alljodetail = function() {
        $userdata = localStorageService.get('customer_data');
        $ionicLoading.show({ template: '<ion-spinner icon="lines"></ion-spinner>' });
        $http({
            method: 'POST',
            data: 'user_token=' + $userdata.user_token + '&user_id=' + $userdata.id + '&job_id=' + $rootScope.job_i + '&user_type=' + 'sp',
            url: BASE_URL + 'get_job_detail/',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function(response) {
            $ionicLoading.hide();
            if (response.status == false) {
                $ionicLoading.hide();
                if (response.message == "Session Expired!! Please login again.") {
                    $ionicLoading.hide();
                    $cordovaToast.showLongBottom(response.message).then(function(success) {}, function(error) {});
                    localStorageService.remove('customer_data');
                    $ionicHistory.clearCache().then(function() {
                        $state.go('login');
                    })
                }
            } else {
                $ionicLoading.hide();
                $scope.allJobDetails = response.data;
                $scope.jobCreatr = response.job_creater;
            }
        }).error(function(error) {
            $ionicLoading.hide();
        });
    }


    $scope.startJobDe = function(job_id_de) {
        swal({
                title: "Are you sure?",
                text: "You want to start this job!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, start it!",
                cancelButtonText: "No, cancel please!",
                closeOnConfirm: false,
                closeOnCancel: false
            },
            function(isConfirm) {
                if (isConfirm) {
                    swal("Start!", "Successfully started.", "success");
                    $userdata = localStorageService.get('customer_data');
                    $ionicLoading.show({ template: '<ion-spinner icon="lines"></ion-spinner>' });
                    $http({
                        method: 'POST',
                        data: 'user_token=' + $userdata.user_token + '&sp_id=' + $userdata.id + '&job_id=' + job_id_de,
                        url: BASE_URL + 'start_job/',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                    }).success(function(response) {
                        $ionicLoading.hide();
                        if (response.status == false) {
                            $ionicLoading.hide();
                            if (response.message == "Session Expired!! Please login again.") {
                                $ionicLoading.hide();
                                $cordovaToast.showLongBottom(response.message).then(function(success) {}, function(error) {});
                                localStorageService.remove('customer_data');
                                $ionicHistory.clearCache().then(function() {
                                    $state.go('login');
                                })
                            }
                        } else {
                            $ionicLoading.hide();
                            $cordovaToast.showLongBottom(response.message).then(function(success) {}, function(error) {});
                            $state.go('tab1.myjobs');
                        }
                    }).error(function(error) {
                        $ionicLoading.hide();
                    });
                } else {
                    swal("Cancelled", " :)", "error");
                }
            })
    }

    $scope.canceljobA = function(job_id) {
        swal({
                title: "Are you sure?",
                text: "You want to cancel this job!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, end it!",
                cancelButtonText: "No, cancel please!",
                closeOnConfirm: false,
                closeOnCancel: false
            },
            function(isConfirm) {
                if (isConfirm) {
                    swal("Cancel!", "Successfully Cancelled.", "success");
                    $userdata = localStorageService.get('customer_data');
                    $ionicLoading.show({ template: '<ion-spinner icon="lines"></ion-spinner>' });
                    $http({
                        method: 'POST',
                        data: 'user_token=' + $userdata.user_token + '&sp_id=' + $userdata.id + '&job_id=' + job_id,
                        url: BASE_URL + 'reject_job/',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                    }).success(function(response) {
                        console.log(response);
                        $ionicLoading.hide();
                        if (response.status == false) {
                            $ionicLoading.hide();
                            if (response.message == "Session Expired!! Please login again.") {
                                $ionicLoading.hide();
                                $cordovaToast.showLongBottom(response.message).then(function(success) {}, function(error) {});
                                localStorageService.remove('customer_data');
                                $ionicHistory.clearCache().then(function() {
                                    $state.go('login');
                                })
                            }
                        } else {
                            $ionicLoading.hide();
                            $cordovaToast.showLongBottom(response.message).then(function(success) {}, function(error) {});
                            $state.go('tab1.home');
                        }
                    }).error(function(error) {
                        $ionicLoading.hide();
                    });
                } else {
                    swal("Cancelled", "", "error");
                }
            })
    }

    $scope.endJob = function(job_id_E) {
        swal({
            title: "Are you sure?",
            text: "You want to end this job!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, end it!",
            cancelButtonText: "No, cancel please!",
            closeOnConfirm: false,
            closeOnCancel: false
        },
        function(isConfirm) {
            if (isConfirm) {
                swal("End!", "Successfully Ended.", "success");
                $userdata = localStorageService.get('customer_data');
                $ionicLoading.show({ template: '<ion-spinner icon="lines"></ion-spinner>' });
                $http({
                    method: 'POST',
                    data: 'user_token=' + $userdata.user_token + '&sp_id=' + $userdata.id + '&job_id=' + job_id_E,
                    url: BASE_URL + '/end_job',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                }).success(function(response) {
                    $ionicLoading.hide();
                    if (response.status == false) {
                        $ionicLoading.hide();
                        if (response.message == "Session Expired!! Please login again.") {
                            $ionicLoading.hide();
                            $cordovaToast.showLongBottom(response.message).then(function(success) {}, function(error) {});
                            localStorageService.remove('customer_data');
                            $ionicHistory.clearCache().then(function() {
                                $state.go('login');
                            })
                        }
                    } else {
                        $ionicLoading.hide();
                        $cordovaToast.showLongBottom(response.message).then(function(success) {}, function(error) {});
                        $state.go('tab1.completed_jobs');
                    }
                }).error(function(error) {
                    $ionicLoading.hide();
                });
            } else {
                swal("Cancelled", "", "error");
            }
        })
    }

    $scope.goMessageAp = function(id) {
        $rootScope.ch_id_cus = id;
        $state.go('conversations_provider');
    }

})


.controller('profileProviderCtrl', function($rootScope,$ionicPopup, $ionicPlatform, IMG_URL, $scope, $state, $window, $ionicHistory, localStorageService) {

    $userdata = localStorageService.get('customer_data');
    // if ($userdata.purchase == 'n') {
    //     $state.go("purchase");
    // }

    $ionicPlatform.registerBackButtonAction(function(event) {
        $ionicHistory.goBack();
    }, 200);


    $scope.img_url = IMG_URL;

    $scope.go_edit_profile = function() {
        $state.go('edit_profile_provider');
    }

    $scope.profiledata = function() {
        $scope.userdataa = localStorageService.get('customer_data');
        console.log($scope.userdataa);
    }

    $scope.logoutPro = function() {
    	swal({
            title: "Are you sure?",
            text: "You want to logout!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, Logout!",
            cancelButtonText: "No, cancel please!",
            closeOnConfirm: false,
            closeOnCancel: false
        },
        function(isConfirm) {
            if (isConfirm) {
            	swal("Logout!", "Successfully Logout.", "success");
            	localStorageService.remove('customer_data');
                $ionicHistory.clearCache().then(function() {
                    $state.go('login');
                })
            } else {
                swal("Cancelled", "", "error");
            }
        })
    }

    $scope.myGoBack = function() {
        $ionicHistory.goBack();
    }

    $scope.changePasswordG = function() {
        $state.go('change_password_provider');
    }

    $scope.checkReview = function(id) {
        $rootScope.selfReviewId = id;
        $state.go("review_provider");
    }

})

.controller('providerReviewCtrl', function($ionicHistory, $ionicPlatform, IMG_URL, $scope, $rootScope, $timeout, $ionicActionSheet, $state, $ionicPopup, $cordovaCamera, $ionicLoading, $http, BASE_URL, localStorageService, $cordovaFileTransfer) {

    $userdata = localStorageService.get('customer_data');
    if ($userdata.purchase == 'n') {
        $state.go("purchase");
    }

    $scope.myGoBack = function() {
        $ionicHistory.goBack();
    }

    $ionicPlatform.registerBackButtonAction(function(event) {
        $ionicHistory.goBack();
    }, 200);

    $scope.img_url = IMG_URL;
    $scope.base_url = BASE_URL;

    $scope.readReview = function() {
        $ionicLoading.show({ template: '<ion-spinner icon="lines"></ion-spinner>' });
        $userdata = localStorageService.get('customer_data');
        $http({
            method: 'POST',
            data: 'user_token=' + $userdata.user_token + '&user_id=' + $userdata.id + '&receiver_id=' + $rootScope.selfReviewId,
            url: BASE_URL + 'get_rating',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function(response) {
            $ionicLoading.hide();
            if (response.status == false) {
                $ionicLoading.hide();
                if (response.message == "Session Expired!! Please login again.") {
                    $ionicLoading.hide();
                    $cordovaToast.showLongBottom(response.message).then(function(success) {}, function(error) {});
                    localStorageService.remove('customer_data');
                    $ionicHistory.clearCache().then(function() {
                        $state.go('login');
                    })
                } else if (response.message == "Data not Found") {
                    $ionicLoading.hide();
                    $scope.noDtaFoMesRevi = "img/result_found.jpg"
                }
            } else {
                $ionicLoading.hide();
                $scope.allReviews = response.data;
            }
        }).error(function(error) {
            $ionicLoading.hide();
        });
    }
})


.controller('editprofileProviderCtrl', function($ionicHistory, $ionicPlatform, IMG_URL, $scope, $rootScope, $timeout, $ionicActionSheet, $state, $ionicPopup, $cordovaCamera, $ionicLoading, $http, BASE_URL, localStorageService, $cordovaFileTransfer) {

    $ionicPlatform.registerBackButtonAction(function(event) {
        $ionicHistory.goBack();
    }, 200);

    $scope.user = {};

    $scope.img_url = IMG_URL;
    $userdata = localStorageService.get('customer_data');
    $scope.user = $userdata;

    if ($userdata.purchase == 'n') {
        $state.go("purchase");
    }

    function initialize() {
        var input = document.getElementById('searchTextField');
        var options = {
            types: ['address']
        };
        var autocomplete = new google.maps.places.Autocomplete(input, options);
        google.maps.event.addListener(autocomplete, 'place_changed', function() {
            var place = autocomplete.getPlace();
            $scope.user.city = place.formatted_address;
            for (var i = 0; i < place.address_components.length; i++) {
                for (var j = 0; j < place.address_components[i].types.length; j++) {
                    if (place.address_components[i].types[j] == "country") {
                        $scope.country = place.address_components[i].long_name;
                    }
                    if (place.address_components[i].types[j] == "administrative_area_level_2") {
                        $scope.city = place.address_components[i].long_name;
                    }
                }
            }
            // $scope.user.address = place.name;document.getElementById('city2').value = place.name;
            // document.getElementById('cityLat').value = place.geometry.location.lat();
            // document.getElementById('cityLng').value = place.geometry.location.lng();
            // document.getElementById('country').value = $scope.country;
            // document.getElementById('city').value = $scope.city;
            // $scope.user.lat = $scope.country;
        });
    }
    google.maps.event.addDomListener(window, 'load', initialize);
    initialize();

    $scope.disableTap = function() {
        container = document.getElementsByClassName('pac-container');
        angular.element(container).attr('data-tap-disabled', 'true');
        angular.element(container).on("click", function() {
            document.getElementById('searchTextField').blur();
        })
    }

    $scope.setLatLong = function(lat, long) {
        $scope.lat = lat;
        $scope.lng = long;
    }

    $scope.edit_profile = function($dataa, $valid) {
        $scope.submitted = true;
        $userdata = localStorageService.get('customer_data');
        var url = BASE_URL + '/update_profile';
        if ($valid) {
            if ($rootScope.my_profile_image) {
                var targetPath = $rootScope.my_profile_image;
                var filename = targetPath.split("/").pop();
                filename = filename.split('?');
                var options = {
                    fileKey: "pic",
                    fileName: filename[0],
                    chunkedMode: false,
                    mimeType: "image/jpg",
                };
                var params = {};
                params.email = $dataa.email;
                params.user_token = $dataa.user_token;
                params.user_id = $dataa.id;
                params.first_name = $dataa.first_name;
                params.last_name = $dataa.last_name;
                params.phone_nbr = $dataa.phone_nbr;
                params.user_type = $dataa.user_type;
                params.city = $dataa.city;
                params.about_me = $dataa.about_me;
                params.experience = $dataa.experience;
                params.price = $dataa.price;
                params.job_type = $dataa.job_type;
                params.pic = $rootScope.my_profile_image;
                options.params = params;
                $cordovaFileTransfer.upload(url, targetPath, options).then(function(result) {
                        var hh = JSON.parse(result.response);
                        if (hh.status == true) {
                            $ionicLoading.hide();
                            localStorageService.set('customer_data', hh.data);
                            $state.go('profile_provider');
                        } else {
                            $ionicLoading.hide();
                            return false;
                        }
                    },
                    function(err) {
                        $scope.imgURI = undefined;
                        $ionicLoading.hide();
                    },
                    function(progress) {
                        $ionicLoading.show({
                            template: '<ion-spinner icon="lines"></ion-spinner>'
                        });
                        $timeout(function() {
                            $scope.downloadProgress = (progress.loaded / progress.total) * 100;
                        })
                    });
            } else {
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
                        $state.go('profile_provider');
                    } else {
                        $ionicLoading.hide();
                    }
                }).error(function(data) {
                    $ionicLoading.hide();
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
                        quality: 100,
                        allowEdit: true,
                        targetWidth: 500,
                        targetHeight: 500,
                        sourceType: Camera.PictureSourceType.CAMERA,
                        encodingType: Camera.EncodingType.JPEG,
                        destinationType: Camera.DestinationType.FILE_URI
                    });
                } else if (index == 1) {
                    takePicture2({
                        quality: 100,
                        allowEdit: true,
                        targetWidth: 500,
                        targetHeight: 500,
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
        })
    }
    var takePicture2 = function(options) {
        $cordovaCamera.getPicture(options).then(function(imageURI) {
            $scope.imageURI = imageURI;
            $rootScope.my_profile_image = imageURI;
        }, function(err) {
            console.log(err);
        });
    }

})


.controller('MessageProviderCtrl', function($cordovaToast, $ionicPlatform, $ionicHistory, IMG_URL, $ionicScrollDelegate, $scope, $rootScope, $timeout, $ionicActionSheet, $state, $ionicPopup, $cordovaCamera, $ionicLoading, $http, BASE_URL, localStorageService, $cordovaFileTransfer) {

    $userdata = localStorageService.get('customer_data');
    if ($userdata.purchase == 'n') {
        $state.go("purchase");
    }

    $ionicPlatform.registerBackButtonAction(function(event) {
        $ionicHistory.goBack();
    }, 200);

    $scope.img_url = IMG_URL;

    $scope.myGoBack = function() {
        $ionicHistory.goBack();
    }

    $scope.getLastConver = function() {
        $ionicLoading.show({ template: '<ion-spinner icon="lines"></ion-spinner>' });
        $userdata = localStorageService.get('customer_data');
        $http({
            method: 'POST',
            data: 'user_token=' + $userdata.user_token + '&user_id=' + $userdata.id,
            url: BASE_URL + 'getLastChat/',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function(response) {
            $ionicLoading.hide();
            if (response.status == false) {
                $ionicLoading.hide();
                if (response.message == "Session Expired!! Please login again.") {
                    $ionicLoading.hide();
                    $cordovaToast.showLongBottom(response.message).then(function(success) {}, function(error) {});
                    localStorageService.remove('customer_data');
                    $ionicHistory.clearCache().then(function() {
                        $state.go('login');
                    })
                } else if (response.message == "Data not Found") {
                    $ionicLoading.hide();
                    $scope.noDtaFoMes = "img/result_found.jpg"
                }
            } else {
                $ionicLoading.hide();
                $scope.allMessages = response.data;
            }
        }).error(function(error) {
            $ionicLoading.hide();
        });
    }

    $scope.doRefresh = function() {
        $userdata = localStorageService.get('customer_data');
        $http({
            method: 'POST',
            data: 'user_token=' + $userdata.user_token + '&user_id=' + $userdata.id,
            url: BASE_URL + 'getLastChat/',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function(response) {
            $ionicLoading.hide();
            if (response.status == false) {
                $ionicLoading.hide();
                if (response.message == "Session Expired!! Please login again.") {
                    $ionicLoading.hide();
                    $cordovaToast.showLongBottom(response.message).then(function(success) {}, function(error) {});
                    localStorageService.remove('customer_data');
                    $ionicHistory.clearCache().then(function() {
                        $state.go('login');
                    })
                }
            } else {
                $ionicLoading.hide();
                $scope.allMessages = response.data;
            }
        }).error(function(error) {
            $ionicLoading.hide();
        }).finally(function() {
            $scope.$broadcast('scroll.refreshComplete');
        })
    }

    $scope.chat_go = function(id) {
        $rootScope.ch_id_cus = id;
        $state.go('conversations_provider');
    }

})

// var interval = null;

.controller('conversationsProviderCtrl', function($ionicHistory, $ionicScrollDelegate, $timeout, $ionicPlatform, $interval, IMG_URL, $ionicScrollDelegate, $scope, $rootScope, $timeout, $ionicActionSheet, $state, $ionicPopup, $cordovaCamera, $ionicLoading, $http, BASE_URL, localStorageService, $cordovaFileTransfer) {

    $userdata = localStorageService.get('customer_data');
    
    if ($userdata.purchase == 'n') {
        $state.go("purchase");
    }

    if($userdata.device_id == "null"){
         var interval = $interval(function () {
            $rootScope.chatConver();
        }, 5000);
    }else {
        console.log("All is well");
    }

    $scope.$on('$destroy',function(){
    if(interval)
        $interval.cancel(interval);   
    });

    $ionicPlatform.registerBackButtonAction(function(event) {
        $ionicHistory.goBack();
    }, 200);

    $scope.myGoBack = function() {
        $ionicHistory.goBack();
    }

    var tz = jstz.determine();
    var timezone = tz.name();
    console.log(timezone);

    $rootScope.chatConver = function() {
        $ionicScrollDelegate.scrollBottom(true);
        $scope.othr_id = $rootScope.ch_id_cus;
        $userdata = localStorageService.get('customer_data');
        $scope.my_id = $userdata.id;
        // $ionicLoading.show({ template: '<ion-spinner icon="lines"></ion-spinner>' });
        $http({
            method: 'POST',
            data: 'user_token=' + $userdata.user_token + '&reciver_id=' + $rootScope.ch_id_cus + '&sender_id=' + $userdata.id + '&timezone=' + timezone,
            url: BASE_URL + 'getChat',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function(response) {
            if (response.status == false) {
                if (response.message == "Session Expired!! Please login again.") {
                    $cordovaToast.showLongBottom(response.message).then(function(success) {}, function(error) {});
                    localStorageService.remove('customer_data');
                    $ionicHistory.clearCache().then(function() {
                        $state.go('login');
                    })
                }
            } else {
                $scope.chatDta = response.data;
                $ionicScrollDelegate.scrollBottom(true);
            }
        }).error(function(error) {
            console.log(error);
        })
    }

    $scope.sendMessage = function(data) {
        console.log(data);
        $userdata = localStorageService.get('customer_data');
        $http({
            method: 'POST',
            data: 'user_token=' + $userdata.user_token + '&reciver_id=' + $rootScope.ch_id_cus + '&sender_id=' + $userdata.id + '&message=' + data + '&timezone=' + timezone,
            url: BASE_URL + 'chat',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function(response) {
            console.log(response);
            $ionicLoading.hide();
            if (response.status == false) {
                $ionicLoading.hide();
                if (response.message == "Session Expired!! Please login again.") {
                    $ionicLoading.hide();
                    $cordovaToast.showLongBottom(response.message).then(function(success) {}, function(error) {});
                    localStorageService.remove('customer_data');
                    $ionicHistory.clearCache().then(function() {
                        $state.go('login');
                    })
                }
            } else {
                $scope.chatDta = response.data;
                console.log($scope.chatDta);
                $ionicScrollDelegate.scrollBottom(true);
            }
        }).error(function(error) {
            console.log();
            $ionicLoading.hide();
        })
    }

    $scope.inputUp = function() {
        $timeout(function() {
            $ionicScrollDelegate.scrollBottom(true);
        }, 1000);
    }

    $scope.inputDown = function() {
        $timeout(function() {
            $ionicScrollDelegate.resize();
        }, 1000);
    }


})


.controller('changePassProviderCtrl', function($cordovaToast, $ionicPlatform, $ionicHistory, $scope, $rootScope, $timeout, $ionicActionSheet, $state, $ionicPopup, $cordovaCamera, $ionicLoading, $http, BASE_URL, localStorageService, $cordovaFileTransfer) {

    $ionicPlatform.registerBackButtonAction(function(event) {
        $ionicHistory.goBack();
    }, 200);


    $scope.myGoBack = function() {
        $ionicHistory.goBack();
    }

    $userdata = localStorageService.get('customer_data');

    if ($userdata.purchase == 'n') {
        $state.go("purchase");
    }

    $scope.changePassword = function(data, valid) {
        $scope.submitted = true;
        if (valid) {
            $ionicLoading.show({ template: '<ion-spinner icon="lines"></ion-spinner>' });
            $userdata = localStorageService.get('customer_data');
            $http({
                method: 'POST',
                data: 'user_token=' + $userdata.user_token + '&user_id=' + $userdata.id + '&oldPassword=' + data.oldPassword + '&newPassword=' + data.newPassword,
                url: BASE_URL + 'changePassword',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function(response) {
                $ionicLoading.hide();
                if (response.status == false) {
                    $ionicLoading.hide();
                    $cordovaToast.showLongBottom(response.message).then(function(success) {}, function(error) {});
                    if (response.message == "Session Expired!! Please login again.") {
                        $ionicLoading.hide();
                        $cordovaToast.showLongBottom(response.message).then(function(success) {}, function(error) {});
                        localStorageService.remove('customer_data');
                        $ionicHistory.clearCache().then(function() {
                            $state.go('login');
                        })
                    }
                } else {
                    $ionicLoading.hide();
                    $state.go('profile_provider');
                }
            }).error(function(error) {
                $ionicLoading.hide();
            });
        } else {
            $cordovaToast.showLongBottom("Please fill required fields").then(function(success) {}, function(error) {});
        }
    }

})

.controller('receiptProviderCtrl', function($filter, IMG_URL, $ionicPlatform, $ionicHistory, $scope, $rootScope, $timeout, $ionicActionSheet, $state, $ionicPopup, $cordovaCamera, $ionicLoading, $http, BASE_URL, localStorageService, $cordovaFileTransfer) {

    $userdata = localStorageService.get('customer_data');
    if ($userdata.purchase == 'n') {
        $state.go("purchase");
    }

    $ionicPlatform.registerBackButtonAction(function(event) {
        $ionicHistory.goBack();
    }, 200);

    $scope.img_url = IMG_URL;

    $scope.myGoBack = function() {
        $ionicHistory.goBack();
    };

    $scope.receiptProvide = function() {
        $userdata = localStorageService.get('customer_data');
        $ionicLoading.show({ template: '<ion-spinner icon="lines"></ion-spinner>' });
        $http({
            method: 'POST',
            data: 'user_token=' + $userdata.user_token + '&user_id=' + $userdata.id + '&job_id=' + $rootScope.viSerRe,
            url: BASE_URL + '/getReceipt',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function(response) {
            $ionicLoading.hide();
            $scope.receiptData = response.data;
            $scope.s_job = $scope.receiptData.start_job;
            $scope.e_job = $scope.receiptData.end_job;
            $scope.s_job = $filter('date')(new Date($scope.s_job.split('-').join('/')), "d MMMM yyyy");
            $scope.e_job = $filter('date')(new Date($scope.e_job.split('-').join('/')), "d MMMM yyyy");
        }).error(function(error) {
            $ionicLoading.hide();
        });
    }

    $scope.go_paymentCom = function() {
        $state.go("rating");
    }

})


.controller('RatingServiCtrl', function($cordovaToast, IMG_URL, $ionicPlatform, $ionicHistory, $scope, $rootScope, $timeout, $ionicActionSheet, $state, $ionicPopup, $cordovaCamera, $ionicLoading, $http, BASE_URL, localStorageService, $cordovaFileTransfer) {

    $userdata = localStorageService.get('customer_data');
    if ($userdata.purchase == 'n') {
        $state.go("purchase");
    }

    $ionicPlatform.registerBackButtonAction(function(event) {
        $ionicHistory.goBack();
    }, 200);

    $scope.img_url = IMG_URL;

    $scope.myGoBack = function() {
        $ionicHistory.goBack();
    };

    $scope.rattingInit = function() {
        $userdata = localStorageService.get('customer_data');
        $ionicLoading.show({ template: '<ion-spinner icon="lines"></ion-spinner>' });
        $http({
            method: 'POST',
            data: 'user_token=' + $userdata.user_token + '&user_id=' + $userdata.id + '&other_user_id=' + $rootScope.rateOtherUser,
            url: BASE_URL + 'view_user_detail',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function(response) {
            $scope.otherProData = response.data;
            $ionicLoading.hide();
        }).error(function(error) {
            $ionicLoading.hide();
        });
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

    $scope.setRating = function(question, val) {
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

    $scope.rateSubmit = function(comment) {
        $userdata = localStorageService.get('customer_data');
        $ionicLoading.show({ template: '<ion-spinner icon="lines"></ion-spinner>' });
        $http({
            method: 'POST',
            data: 'user_token=' + $userdata.user_token + '&user_id=' + $userdata.id + '&receiver_id=' + $rootScope.rateOtherUser + '&rating=' + $scope.question + '&msg=' + comment,
            url: BASE_URL + 'add_rating',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function(response) {
            $ionicLoading.hide();
            $cordovaToast.showLongBottom(response.message).then(function(success) {}, function(error) {});
            $state.go('tab1.home');
        }).error(function(error) {
            $ionicLoading.hide();
        });
    }

})


.controller('settingProviderCtrl', function($ionicPlatform, $ionicHistory, $scope, $rootScope, $timeout, $ionicActionSheet, $state, $ionicPopup, $cordovaCamera, $ionicLoading, $http, BASE_URL, localStorageService, $cordovaFileTransfer) {

    $ionicPlatform.registerBackButtonAction(function(event) {
        $ionicHistory.goBack();
    }, 200);

    $scope.myGoBack = function() {
        $ionicHistory.goBack();
    };


    $userdata = localStorageService.get('customer_data');

    if ($userdata.purchase == 'n') {
        $state.go("purchase");
    }

    if ($userdata.notification == 'n') {
        $scope.pushNotification = { checked: false };
    } else {
        $scope.pushNotification = { checked: true };
    }

    $scope.pushNotificationChange = function(pushNotification) {
        if (pushNotification == true) {
            val = 'y'
        } else {
            val = 'n'
        }
        $userdata = localStorageService.get('customer_data');

        $http({
            method: 'POST',
            data: 'user_token=' + $userdata.user_token + '&user_id=' + $userdata.id + '&notification=' + val,
            url: BASE_URL + 'notification',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function(response) {
            localStorageService.set('customer_data', response.data);
        }).error(function(error) {});
    }

    $scope.aboutUs = function() {
        $state.go('about_us_provider');
    }

    $scope.contactUs = function() {
        $state.go('contact_us_provider');
    }

    $scope.hide = false;
    $scope.show = true;

    $scope.privacyPolicy = function() {
        var ref = window.open('http://halphero.com/privacy.html', '_blank', 'location=yes');
        // $state.go('privacy_policy');
    }

    $scope.termCondition = function() {
        var ref = window.open('http://halphero.com/terms&condition.html', '_blank', 'location=yes');
        // $state.go('term_conditions');
    }


})


.controller('notificationProviderCtrl', function($ionicHistory, $ionicPlatform, IMG_URL, $cordovaToast, $scope, $state, BASE_URL, localStorageService, $rootScope, $ionicHistory, $ionicLoading, $http, $ionicPopup) {

    $userdata = localStorageService.get('customer_data');
    if ($userdata.purchase == 'n') {
        $state.go("purchase");
    }

    $ionicPlatform.registerBackButtonAction(function(event) {
        $ionicHistory.goBack();
    }, 200);

    $scope.img_url = IMG_URL;

    $scope.myGoBack = function() {
        $ionicHistory.goBack();
    };

    $scope.go_profile = function() {
        $state.go('profile_provider');
    }

    $scope.go_message = function() {
        $state.go('message_provider');
    }

    $scope.GetNotification = function() {
        $ionicLoading.show({ template: '<ion-spinner icon="lines"></ion-spinner>' });
        $userdata = localStorageService.get('customer_data');
        $http({
            method: 'POST',
            data: 'user_token=' + $userdata.user_token + '&user_id=' + $userdata.id,
            url: BASE_URL + 'notification_history',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function(response) {
            $ionicLoading.hide();
            if (response.status == false) {
                $ionicLoading.hide();
                if (response.message == "Session Expired!! Please login again.") {
                    $ionicLoading.hide();
                    $cordovaToast.showLongBottom(response.message).then(function(success) {}, function(error) {});
                    localStorageService.remove('customer_data');
                    $ionicHistory.clearCache().then(function() {
                        $state.go('login');
                    })
                } else if (response.message == "Data not found") {
                    $ionicLoading.hide();
                    $scope.noDtaFo = "img/result_found.jpg"
                }
            } else {
                $scope.notiHis = response.data;
            }
        }).error(function(error) {
            $ionicLoading.hide();
        })
    }

    $scope.goChat = function(id) {
        $userdata = localStorageService.get('customer_data');
        $http({
            method: 'POST',
            data: 'user_token=' + $userdata.user_token + '&user_id=' + $userdata.id + '&notification_id=' + id,
            url: BASE_URL + 'read_notification',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function(response) {
            $ionicLoading.hide();
            if (response.status == false) {
                $ionicLoading.hide();
                if (response.message == "Session Expired!! Please login again.") {
                    $ionicLoading.hide();
                    $cordovaToast.showLongBottom(response.message).then(function(success) {}, function(error) {});
                    localStorageService.remove('customer_data');
                    $ionicHistory.clearCache().then(function() {
                        $state.go('login');
                    })
                }
            } else {
                $state.go("message");
            }
        }).error(function(error) {
            $ionicLoading.hide();
        })
    }

    $scope.gohome = function(id) {
        $userdata = localStorageService.get('customer_data');
        $http({
            method: 'POST',
            data: 'user_token=' + $userdata.user_token + '&user_id=' + $userdata.id + '&notification_id=' + id,
            url: BASE_URL + 'read_notification',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function(response) {
            $ionicLoading.hide();
            if (response.status == false) {
                $ionicLoading.hide();
                if (response.message == "Session Expired!! Please login again.") {
                    $ionicLoading.hide();
                    $cordovaToast.showLongBottom(response.message).then(function(success) {}, function(error) {});
                    localStorageService.remove('customer_data');
                    $ionicHistory.clearCache().then(function() {
                        $state.go('login');
                    })
                }
            } else {
                $state.go("tab1.home");
            }
        }).error(function(error) {
            $ionicLoading.hide();
        })
    }

    $scope.goMyJ = function(id) {
        $userdata = localStorageService.get('customer_data');
        $http({
            method: 'POST',
            data: 'user_token=' + $userdata.user_token + '&user_id=' + $userdata.id + '&notification_id=' + id,
            url: BASE_URL + 'read_notification',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function(response) {
            $ionicLoading.hide();
            if (response.status == false) {
                $ionicLoading.hide();
                if (response.message == "Session Expired!! Please login again.") {
                    $ionicLoading.hide();
                    $cordovaToast.showLongBottom(response.message).then(function(success) {}, function(error) {});
                    localStorageService.remove('customer_data');
                    $ionicHistory.clearCache().then(function() {
                        $state.go('login');
                    })
                }
            } else {
                $state.go("tab1.myjobs");
            }
        }).error(function(error) {
            $ionicLoading.hide();
        })
    }


})


.controller('purchaseCtrl', function($cordovaToast, IMG_URL, $ionicPlatform, $ionicHistory, $scope, $rootScope, $timeout, $ionicActionSheet, $state, $ionicPopup, $cordovaCamera, $ionicLoading, $http, BASE_URL, localStorageService, $cordovaFileTransfer) {

    $userdata = localStorageService.get('customer_data');
    if ($userdata.purchase == 'y') {
        $state.go("tab1.home");
    }else{
    	$state.go("purchase");
        console.log("Current state");
    }

    $ionicPlatform.registerBackButtonAction(function(event) {
        if ($state.current.name == "purchase") {
            $ionicPopup.confirm({
                title: 'EXIT',
                template: 'Are you sure you want to Exit?'
            }).then(function(res) {
                if (res) {
                    ionic.Platform.exitApp();
                }
            })
        }
    }, 200);

    $scope.myGoBack = function() {
        $ionicHistory.goBack();
    };

    var device_typeB = ionic.Platform.platform();
    console.log(device_typeB);

    $scope.buy = function() {
        $userdata = localStorageService.get('customer_data');
        $ionicLoading.show({ template: '<ion-spinner icon="lines"></ion-spinner>' });
        inAppPurchase
        //.buy('com.halphero.provider.purchase')
        //.buy('com.halphero.provider.subscription')
        .buy('com.halphero.subscription')
        .then(function(data) {
            console.log(data);
            $scope.rec_da = JSON.parse(data.receipt);
            var data = {
                'user_token': $userdata.user_token,
                'user_id': $userdata.id,
                'android_token': $scope.rec_da.purchaseToken,
                'android_order_id': $scope.rec_da.orderId,
                'purchase_type': device_typeB
            }
            $ionicLoading.show({ template: '<ion-spinner icon="lines"></ion-spinner>' });
            var Url = BASE_URL + 'update_package';
            var config = {
                headers: { 'Content-Type': 'application/json;' }
            };
            $http({
                method: 'POST',
                url: Url,
                data: data,
                transformRequest: function(obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function(data) {
                $ionicLoading.hide();
                if (data.status == false) {
                    console.log(data);
                    $ionicLoading.hide();
                    if (data.message == "Session Expired!! Please login again.") {
                        $ionicLoading.hide();
                        $cordovaToast.showLongBottom("Session Expired!! Please login again.").then(function(success) {}, function(error) {});
                        localStorageService.remove('customer_data');
                        $ionicHistory.clearCache().then(function() {
                            $state.go('login');
                        })
                    }
                } else {
                    $ionicLoading.hide();
                    localStorageService.set('customer_data', data.data);
                    $state.go("tab1.home");
                }
            }).error(function(data) {
                console.log(data);
                $ionicLoading.hide();
                $cordovaToast.showLongBottom(data.message).then(function(success) {}, function(error) {});
            });
        })
        .catch(function(err) {
            console.log(err);
            $ionicLoading.hide();
        });
    }


})

//////////////////////Setting pages//////////////////////////////////

.controller('aboutProviderCtrl', function($ionicPlatform, $cordovaToast, $rootScope, localStorageService, $ionicLoading, BASE_URL, $http, $location, $scope, $state, $ionicHistory) {

    $userdata = localStorageService.get('customer_data');
    if ($userdata.purchase == 'n') {
        $state.go("purchase");
    }

    $ionicPlatform.registerBackButtonAction(function(event) {
        $ionicHistory.goBack();
    }, 200);

    $scope.myGoBack = function() {
        $ionicHistory.goBack();
    }

})

.controller('contactProviderCtrl', function($ionicPlatform, $cordovaToast, $rootScope, localStorageService, $ionicLoading, BASE_URL, $http, $location, $scope, $state, $ionicHistory) {

    $userdata = localStorageService.get('customer_data');
    if ($userdata.purchase == 'n') {
        $state.go("purchase");
    }

    $ionicPlatform.registerBackButtonAction(function(event) {
        $ionicHistory.goBack();
    }, 200);

    $scope.myGoBack = function() {
        $ionicHistory.goBack();
    }

    $scope.contactUsGP = function(user, $valid) {
        $scope.submitted = true;
        if ($valid) {
            $ionicLoading.show({ template: '<ion-spinner icon="lines"></ion-spinner>' });
            $userdata = localStorageService.get('customer_data');
            $http({
                method: 'POST',
                data: 'user_token=' + $userdata.user_token + '&user_id=' + $userdata.id + '&email=' + user.email + '&subject=' + user.subject + '&message=' + user.message,
                url: BASE_URL + 'contactUs',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function(response) {
                $ionicLoading.hide();
                 console.log(response);
                if (response.status == false) {
                    $ionicLoading.hide();
                    if (response.message == "Session Expired!! Please login again.") {
                        $ionicLoading.hide();
                        $cordovaToast.showLongBottom("Session Expired!! Please login again.").then(function(success) {}, function(error) {});
                        localStorageService.remove('customer_data');
                        $ionicHistory.clearCache().then(function() {
                            $state.go('login');
                        })
                    }
                } else {
                    $ionicLoading.hide();
                    $cordovaToast.showLongBottom(response.message).then(function(success) {}, function(error) {});
                    $state.go("tab1.account");
                }
            }).error(function(error) {
                $ionicLoading.hide();
                $cordovaToast.showLongBottom(error).then(function(success) {}, function(error) {});
            })
        } else {
            // $cordovaToast.showLongBottom("Please fill required fields").then(function(success) {
            // }, function(error) {
            // });
        }
    }

})

.controller('privacyProviderCtrl', function($ionicPlatform, $cordovaToast, $rootScope, localStorageService, $ionicLoading, BASE_URL, $http, $location, $scope, $state, $ionicHistory) {

    $userdata = localStorageService.get('customer_data');
    if ($userdata.purchase == 'n') {
        $state.go("purchase");
    }

    $ionicPlatform.registerBackButtonAction(function(event) {
        $ionicHistory.goBack();
    }, 200);

    $scope.myGoBack = function() {
        $ionicHistory.goBack();
    }

})

.controller('termConProviderCtrl', function($ionicPlatform, $cordovaToast, $rootScope, localStorageService, $ionicLoading, BASE_URL, $http, $location, $scope, $state, $ionicHistory) {

    $userdata = localStorageService.get('customer_data');
    if ($userdata.purchase == 'n') {
        $state.go("purchase");
    }

    $ionicPlatform.registerBackButtonAction(function(event) {
        $ionicHistory.goBack();
    }, 200);

    $scope.myGoBack = function() {
        $ionicHistory.goBack();
    };

})


