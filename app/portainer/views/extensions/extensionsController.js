import moment from 'moment';

angular.module('portainer.app')
  .controller('ExtensionsController', ['$scope', '$state', 'ExtensionService', 'Notifications',
    function($scope, $state, ExtensionService, Notifications) {

      $scope.state = {
        actionInProgress: false,
        currentDate: moment().format('YYYY-MM-dd')
      };

      $scope.formValues = {
        License: ''
      };

      function initView() {
        ExtensionService.extensions(true)
          .then(function onSuccess(data) {
            $scope.extensions = data;
          })
          .catch(function onError(err) {
            $scope.extensions = [];
            Notifications.error('Failure', err, 'Unable to access extension store');
          });
      }

      $scope.enableExtension = function() {
        var license = $scope.formValues.License;

        $scope.state.actionInProgress = true;
        ExtensionService.enable(license)
          .then(function onSuccess() {
            ExtensionService.retrieveAndSaveEnabledExtensions();
            Notifications.success('Extension successfully enabled');
            $state.reload();
          })
          .catch(function onError(err) {
            Notifications.error('Failure', err, 'Unable to enable extension');
          })
          .finally(function final() {
            $scope.state.actionInProgress = false;
          });
      };


      $scope.isValidLicenseFormat = function(form) {
        var valid = true;

        if (!$scope.formValues.License) {
          return;
        }

        if (isNaN($scope.formValues.License[0])) {
          valid = false;
        }

        form.extension_license.$setValidity('invalidLicense', valid);
      };


      initView();
    }]);
