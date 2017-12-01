var wellsList = null;  // List of WellDTO
var currentWell = null; // ID of the current selected well
var currentPoint = 0; // ID of the current data point
var currentStage = null; // Current Stage #
var stagesList = null; // list of stages for the current well

function loadWellsList() {
    wellsList = ajaxCall("GET", null, "/wells/");
    console.log(wellsList);
    showWells();
}

function showWells() {
    $('#wellsList')
    .find('option')
    .remove()
    .end()
    .append('<option value="-1">Select A Well</option>');
    //.val('whatever')

    for (var i = 0; i < wellsList.length; i++) {
        //$('#wellsList').append($('', { value: wellsList[i].Id, text: wellsList[i].Name }));
        $('#wellsList').append($("<option></option>")
                    .attr("value", wellsList[i].Id)
                    .text(wellsList[i].Name));
    }
}

function wellSelected() {
    var e = document.getElementById("wellsList");
    selectWell(e.options[e.selectedIndex].value);
}

function selectWell(wellId) {
    currentWell = wellId;
    stagesList = ajaxCall("GET", null, "/wells/" + currentWell +"/stages");
    console.log(stagesList);
    currentStage = 1;
    addStreamChartTab(currentStage);

    /*
    currentPoint = 0;
    var dps = []; // dataPoints
    var chart = new CanvasJS.Chart("stageChart1", {
        title: {
            text: "Dynamic Data"
        },
        axisY: {
            includeZero: false
        },
        data: [{
            type: "line",
            dataPoints: dps
        }]
    });

    var xVal = 0;
    var yVal = 100;
    var updateInterval = 1000;
    var dataLength = 20; // number of dataPoints visible at any point
    var intervalId = null;
    var updateChart = function (count) {

        count = count || 1;

        for (var j = 0; j < count; j++) {
            yVal = yVal + Math.round(5 + Math.random() * (-5 - 5));

            dps.push({
                x: xVal,
                y: yVal
            });
            xVal++;
        }

        if (dps.length > dataLength) {
            dps.shift();
        }

        chart.render();
    };

    var updateChartFromServer = function () {
        var currentWellPoint = ajaxCall("GET", null, "/wells/" + currentWell + "/" + currentPoint);

        if (currentWellPoint == null) {
            clearInterval(intervalId);
        } else {
            currentPoint = currentWellPoint.Id;
            if (currentWellPoint.Stage == -1) {
            } else if (currentWellPoint.Stage != currentStage) {
                if (currentStage != null)
                    dps.splice(0, dps.length);

                currentStage = currentWellPoint.Stage;
            }

            dps.push({
                x: currentPoint,
                y: currentWellPoint.Pressure
            });

            chart.render();
        }

    };

    //updateChart(dataLength);
    //setInterval(function () { updateChart() }, updateInterval);

    updateChartFromServer();
    intervalId = setInterval(function () { updateChartFromServer() }, updateInterval);
    */
}