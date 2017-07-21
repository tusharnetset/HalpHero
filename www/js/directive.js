// appControllers
//     .directive('pwCheck', [function() {
//         return {
//             require: 'ngModel',
//             link: function(scope, elem, attrs, ctrl) {
//                 var firstPassword = '#' + attrs.pwCheck;
//                 elem.add(firstPassword).on('keyup', function() {
//                     scope.$apply(function() {
//                         ctrl.$setValidity('pwmatch', elem.val() === $(firstPassword).val());
//                     });
//                 });
//             }
//         }
//     }])

// .directive('sameValueAs', function () {
//     return {
//       require: 'ngModel',
//       link: function (scope, elm, attrs, ctrl) {
//         ctrl.$validators.sameValueAs = function (modelValue, viewValue) {
//             if (ctrl.$isEmpty(modelValue) || attrs.sameValueAs === viewValue) {
//                 return true;
//             }
//             return false;
//         };
//       }
//     };
// })


// .directive('starRating',function() {
//   return {
//     restrict : 'A',
//     template : '<ul class="rating">'+ ' <li ng-repeat="star in stars" ng-class="star" ng-click="toggle($index)">'+ '  <i class="fa fa-star-o"></i>'+ ' </li>'+ '</ul>',
//     scope : {
//       ratingValue : '=',
//       max : '=',
//       onRatingSelected : '&'
//     },
//     link : function(scope, elem, attrs) {
//       var updateStars = function() {
//         scope.stars = [];
//         for ( var i = 0; i < scope.max; i++) {
//           scope.stars.push({
//             filled : i < scope.ratingValue
//           });
//         }
//       };
//       scope.toggle = function(index) {
//         scope.ratingValue = index + 1;
//         scope.onRatingSelected({
//           rating : index + 1
//         });
//       };
//       scope.$watch('ratingValue',
//       function(oldVal, newVal) {
//         if (newVal) {
//           updateStars();
//         }
//       });
//     }
//   };
// })

// .directive('googleplace', [ function() {
//     return {
//         require: 'ngModel',
//         link: function(scope, element, attrs, model) {
//             var options = {
//                 types: [],
//                 componentRestrictions: {  country:'IN' }
//             };

//             scope.gPlace = new google.maps.places.Autocomplete(element[0], options);
//             google.maps.event.addListener(scope.gPlace, 'place_changed', function() {
//                 var geoComponents = scope.gPlace.getPlace();
//                 var latitude = geoComponents.geometry.location.lat();
//                 console.log(latitude);
//                 var longitude = geoComponents.geometry.location.lng();
//                 console.log(longitude);
//                 var addressComponents = geoComponents.address_components;
//                 // scope.myLat = latitude;
//                 callFunctionHello(latitude,longitude);
//                 addressComponents = addressComponents.filter(function(component){
//                     switch (component.types[0]) {
//                         case "locality": // city
//                             return true;
//                         case "administrative_area_level_1": // state
//                             return true;
//                         case "country": // country
//                             return true;
//                         default:
//                             return false;
//                     }
//                 }).map(function(obj) {
//                     return obj.long_name;
//                 });

//                 addressComponents.push(latitude, longitude);

//                 scope.$apply(function() {
//                     scope.details = addressComponents; // array containing each location component
//                     model.$setViewValue(element.val());  
//                 });
//             });
//         }
//     };
// }])

// function callFunctionHello(latitude, longitude){
//   angular.element(document.getElementById('idLatitude')).scope().setLatLong(latitude,longitude); 
// }


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