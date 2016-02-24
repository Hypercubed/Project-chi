import './app.css!';

import angular from 'angular';
import 'angular-route';
import 'angular-animate';
import 'angular-cookies';

import 'angular-bootstrap';

import angularMarked from 'angular-marked';
import 'ui-codemirror';
import 'angular-downloadsvg-directive';

import dataServices from 'common/services/datapackage/index';
import dataPackageEditor from 'components/editor/editor';

import routes from 'components/routes';

import footerHTML from 'common/partials/footer.html!text';
import introHTML from 'common/partials/intro.html!text';

import 'angular-loading-bar';
import 'angular-loading-bar/build/loading-bar.css!';

import 'angular-growl/build/angular-growl.js';
import 'angular-growl/build/angular-growl.css!';

export default angular
  .module('projectX', [
    'ngRoute',
    'ngAnimate',
    'ngCookies',
    // 'ngSanitize',
    // 'ngTouch',
    'hc.downloader',
    'ui.bootstrap',
    routes.name,
    angularMarked,
    dataServices,
    dataPackageEditor,
    'ui.codemirror',
    'angular-loading-bar',
    'angular-growl'
  ])
  .config(['$logProvider', function ($logProvider) {
    $logProvider.debugEnabled(false);
  }])
  .run(['$rootScope', '$location', function isPath ($rootScope, $location) {
    $rootScope.isPath = (path) => path === $location.path();
  }])
  .run(['$templateCache', function ($templateCache) {
    $templateCache.put('common/partials/footer.html', footerHTML);
    $templateCache.put('common/partials/intro.html', introHTML);
  }])
  .run(['$rootScope', '$location', 'growl', function ($rootScope, $location, growl) {
    $rootScope.$on('$routeChangeError', function (event, curr, prev, rej) {
      growl.error(`failed to change routes ${rej.status} ${rej.statusText}`);
    });
  }])
  .config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
    cfpLoadingBarProvider.latencyThreshold = 32;
  }])
  .directive('onResize', ['$window', function ($window) {
    return {
      scope: {
        onResize: '&'
      },
      link: function (scope) {
        var timeout = null;
        function debounceRedraw () {
          if (timeout) { clearTimeout(timeout); }
          timeout = setTimeout(function () {
            scope.onResize();
          }, 500);
        }

        function resize () {
          scope.onResize();
        }

        angular.element($window).on('resize', debounceRedraw);
        if ('matchMedia' in window) {
          window.matchMedia('print').addListener(resize);
        }

        scope.$on('$destroy', function () {
          angular.element($window).off('resize', debounceRedraw);
          if ('matchMedia' in window) {
            window.matchMedia('print').removeListener(resize);
          }
        });
      }
    };
  }]);
