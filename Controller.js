angular.module('PrintCenter', ['ui.calendar', 'ui.bootstrap']);
var ModalDemoCtrl = function ($scope, $modal, $timeout) {

    //$scope.items = ['item1', 'item2', 'item3'];

    // Open primary modal
    $scope.open = function () {

        var modalInstance = $modal.open({
            templateUrl: 'calModalContent.html',
            controller: ModalInstanceCtrl,
            resolve: {
                items: function () {
                    return $scope.items;
                }
            }
        });

        modalInstance.result.then(function () {
            return;
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    };


};

// Controller for primary modal
var ModalInstanceCtrl = function ($scope, $modal, $modalInstance, items) {

    $scope.items = items;
   /* $scope.selected = {
        item: $scope.items[0]
    };*/

    $scope.ok = function () {
        $modalInstance.close($scope.selected.item);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.open = function() {
        $scope.openModal();
    };

    // Open modal from modal
    $scope.openModal = function (eventObj) {
        console.log('Opening modal...');
        var modalInstance = $modal.open({
            templateUrl: 'newModalContent.html',
            controller: NewModalInstanceCtrl,
            backdrop: false,
            resolve: {
                event: function () {
                    return eventObj;
                }
            }
        });

        // Scope apply here to make modal show up
        $scope.$evalAsync(function() {
            modalInstance.result.then(
                function (event) {
                    console.log('Modal closed at: ' + new Date());
                    console.log(event);
                    $scope.events.push(event);
                },
                function () {
                    console.log('Modal dismissed at: ' + new Date());
                }
            );
        });

    };

    var date = new Date();var d = date.getDate();var m = date.getMonth();var y = date.getFullYear();
    /*$scope.events= [
        {type:'party',id: 999,title: 'Repeating Event 2',start: new Date(y, m, d - 3, 16, 0),allDay: false},
        {type:'party',id: 999,title: 'Repeating Event 2',start: new Date(y, m, d + 4, 16, 0),allDay: false},
        {type:'party',title: 'Meeting 2',start: new Date(y, m, d, 10, 30),allDay: false}
    ];*/

    $scope.eventSources = [$scope.events];

    $scope.uiConfig = {
        calendar: {
            dayClick: function(event) {console.log('Day clicking');$scope.openModal(event)}
        }
    };

    $scope.addEvent = function() {
        console.log('Adding event');
        $scope.events.push({type:'party',id: 34,title: 'Added with button',start: new Date(y, m, d + 1, 12, 0),allDay: false});
    };


};

// Controller for modal created from other modal
var NewModalInstanceCtrl = function ($scope, $modal,$modalInstance, event) {

    var date = new Date(event);var d = date.getDate();var m = date.getMonth();var y = date.getFullYear();

    $scope.printClick = function(file) {
        $scope.openModal(file);
    };

    $scope.openModal = function(file){
            var modalInstance = $modal.open({
                templateUrl: 'printModel.html',
                controller: 'printCntrl',
                backdrop: false,
                resolve: {
                    cat: function () {
                        return file;
                    }
                }
            });
    };


    $scope.ok = function () {
        $modalInstance.close({type:'party',id: 999,title: 'Added from modal',start: new Date(y, m, d, 16, 0),allDay: false});
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };


};
var respID= '';
var printCntrl = function ($scope, $http, $modal, $modalInstance) {
    console.log('from Print');
    var documents = {
        printArray: []
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    }

    $http.get("https://demo3662581.mockable.io/documents")
        .then(function (response) {
            $scope.docs = response.data;
            $scope.files = $scope.docs.documents.filename;
            console.log($scope.files);
            //console.log($scope.docs);
            //console.log(response.data);
        });


    $scope.getRow = function($event){
        if($event.target.checked === true){
            if(!documents.printArray.includes($event.target.getAttribute('file_name'))){
                documents.printArray.push($event.target.getAttribute('file_name'));
                //console.log(printArray);
            }
        };
        if($event.target.checked === false){
           documents.printArray.splice($event.target.getAttribute('file_index'),1);
        }
        console.log(documents);
    };

    $scope.printSubmit = printSubmit;

    function printSubmit(documents) {

        $http.put('https://demo3662581.mockable.io/print_jobs', documents)
            .then( function (response) {
                $scope.respID = response.data;

            });

    };

    $scope.deleteJob = deleteJob;
    function deleteJob(id) {
        $http.delete('https://demo3662581.mockable.io/print_jobs')
            .then(function (response) {
               $scope.msg = response.data;
            })
    }
};
