var intervalId = null;
var chartsDataPressure = [];
var chartsDataSlurryRate = [];
var currentTopChart = null;
var currentTopChartOptions = null;
var topChartData = [];
var currentBottomChart = null;
var currentBottomChartOptions = null;
var bottomChartData = [];
var updateInterval = 1000;

var currentTopPerfChart = null;
var currentTopPerfChartOptions = null;
var topPerfChartData = [];

var currentBottomPerfChart = null;
var currentBottomPerfChartOptions = null;
var bottomPerfChartData = [];

var currentCostChart = null;
var currentCostChartOptions = null;
var costChartData = [];

function createTopChart(stageNumber) {
    topChartData[stageNumber] = new google.visualization.DataTable();
    topChartData[stageNumber].addColumn('number', 'Minutes');
    topChartData[stageNumber].addColumn('number', 'Pressure');
    topChartData[stageNumber].addColumn('number', 'Slurry Rate');
    topChartData[stageNumber].addColumn('number', 'Blender Prob Conc');
    topChartData[stageNumber].addColumn('number', 'Calc BH Prob Conc');

    currentTopChartOptions = {
        chart: {
            //title: 'Stage ' +stageNumber
        },
        width: '90%',
        height: '300px',
        vAxes: {
            0: {
                viewWindowMode: 'explicit',
                viewWindow: {
                    max: 12000,
                    min: 0
                },
                gridlines: { color: 'transparent' },
            },
            1: {
                viewWindowMode: 'explicit',
                viewWindow: {
                    max: 100,
                    min: 0
                },
                gridlines: { color: 'transparent' },
            }
        },
        series: {
            0: { targetAxisIndex: 0 },
            1: { targetAxisIndex: 1 },
            2: { targetAxisIndex: 1 },
            3: { targetAxisIndex: 1 },
        },
        backgroundColor: '#000000'
    };

    currentTopChart = new google.charts.Line(document.getElementById("stageChart" + stageNumber +"Top"));
}

function createBottomChart(stageNumber) {
    bottomChartData[stageNumber] = new google.visualization.DataTable();
    bottomChartData[stageNumber].addColumn('number', 'Minutes');
    bottomChartData[stageNumber].addColumn('number', 'Friction Reducer/Conc');
    bottomChartData[stageNumber].addColumn('number', 'Clay Stabilize/Conc');
    bottomChartData[stageNumber].addColumn('number', 'Surfacant/Conc');
    bottomChartData[stageNumber].addColumn('number', 'Biocide/Conc');

    currentBottomChartOptions = {
        chart: {
            //title: 'Stage ' +stageNumber
        },
        width: '90%',
        height: '300px',
        backgroundColor: '#000000'
    };

    currentBottomChart = new google.charts.Line(document.getElementById("stageChart" + stageNumber + "Bottom"));
}

function updateTopChart(point, wellPoint) {
    topChartData[currentStage].setColumnLabel(1, "Pressure \n" + wellPoint.Pressure + " psi");
    topChartData[currentStage].setColumnLabel(2, "Slurry Rate \n" + wellPoint.SlurryRate + " bbl/min");
    topChartData[currentStage].setColumnLabel(3, "Blender Prob Conc \n" + wellPoint.PropConcentration + " lb/US gal");
    topChartData[currentStage].setColumnLabel(4, "Calc BH Prob Conc \n" + wellPoint.BHCalcProb + " lb/US gal");
    topChartData[currentStage].addRow([wellPoint.TimeInMinute, wellPoint.Pressure, wellPoint.SlurryRate, wellPoint.PropConcentration, wellPoint.BHCalcProb]);
    currentTopChart.draw(topChartData[currentStage], google.charts.Line.convertOptions(currentTopChartOptions));

    checkDataPoint(wellPoint, currentStage);
}

function updateBottomChart(point, wellPoint) {
    bottomChartData[currentStage].setColumnLabel(1, "Friction Reducer/Conc \n" + wellPoint.FrictionReducer);
    bottomChartData[currentStage].setColumnLabel(2, "Clay Stabilize/Conc \n" + wellPoint.ClayStay);
    bottomChartData[currentStage].setColumnLabel(3, "Surfacant/Conc \n" + wellPoint.Surfacant);
    bottomChartData[currentStage].setColumnLabel(4, "Biocide/Conc \n" + wellPoint.Biocide);
    bottomChartData[currentStage].addRow([wellPoint.TimeInMinute, wellPoint.FrictionReducer, wellPoint.ClayStay, wellPoint.Surfacant, wellPoint.Biocide]);
    currentBottomChart.draw(bottomChartData[currentStage], google.charts.Line.convertOptions(currentBottomChartOptions));

    //checkDataPoint(wellPoint, currentStage);
}

function addStreamChartTab(stageNumber) {
    var dpsPressure = []; // dataPoints
    var dpsSlurryRate = []; // dataPoints
    chartsDataPressure[stageNumber - 1] = dpsPressure;
    chartsDataSlurryRate[stageNumber - 1] = dpsSlurryRate;

    createTopChart(stageNumber);
    createBottomChart(stageNumber);
    createTopPerformanceChart(stageNumber);
    createBottomPerformanceChart(stageNumber);
    createCostChart(stageNumber);

    /*
    var chart = new CanvasJS.Chart("stageChart" + stageNumber, {
        title: {
            text: "Stage " + stageNumber
        },
        axisY: {
            includeZero: false
        },
        data: [{
            type: "line",
            dataPoints: chartsDataPressure[stageNumber - 1]
        },
        {
            type: "line",
            dataPoints: chartsDataSlurryRate[stageNumber - 1]
        }]
    });

    var xVal = 0;
    var yVal = 100;
    var updateInterval = 1000;
    var dataLength = 20; // number of dataPoints visible at any point

    currentChart = chart;
    //updateChartFromServer();
    */
    intervalId = setInterval(function () { updateChartFromServer() }, updateInterval);
}

function updateChartFromServer() {
    var currentWellPoint = ajaxCall("GET", null, "/wells/" + currentWell + "/" + currentPoint);

    if (currentWellPoint == null) {
        clearInterval(intervalId);
        markStageDone(currentStage);
    } else {
        if (currentWellPoint.Stage == -1) {
            currentPoint = currentWellPoint.Id;
            updatePhase(currentWellPoint);
        } else if (currentWellPoint.Stage != currentStage) {
            markStageDone(currentStage);
            currentStage = currentWellPoint.Stage;
            clearInterval(intervalId);
            addStageChartTab(currentStage);
            addStreamChartTab(currentStage);
            resetPhase();
            return;
        } else {
            currentPoint = currentWellPoint.Id;
            updatePhase(currentWellPoint);
        }


        updateTopChart(currentPoint, currentWellPoint);
        updateBottomChart(currentPoint, currentWellPoint);
        updateTopPerfChart(currentPoint, currentWellPoint);
        updateBottomPerfChart(currentPoint, currentWellPoint);
        updateCostChart(currentPoint, currentWellPoint);
    }
};

function createTopPerformanceChart(stageNumber) {
    topPerfChartData[stageNumber] = new google.visualization.DataTable();
    topPerfChartData[stageNumber].addColumn('number', 'Minutes');
    topPerfChartData[stageNumber].addColumn('number', 'Slurry Rate');
    topPerfChartData[stageNumber].addColumn('number', 'Blender Prob Conc');

    currentTopPerfChartOptions = {
        chart: {
            //title: 'Stage ' +stageNumber
        },
        width: '90%',
        height: '300px',
        vAxes: {
            0: { format: 'percent' }
        },
        series: {
            0: { targetAxisIndex: 0 },
            1: { targetAxisIndex: 0 },
            2: { targetAxisIndex: 0 },
        },
        backgroundColor: '#FFFFFF'
    };

    currentTopPerfChart = new google.charts.Line(document.getElementById("perfStageChart" + stageNumber + "Top"));
}

function updateTopPerfChart(point, wellPoint) {
    topPerfChartData[currentStage].addRow([wellPoint.TimeInMinute, (wellPoint.SlurryRate - currentScenario.SlurryRate[currentPhase]) / currentScenario.SlurryRate[currentPhase],
                                                (wellPoint.PropConcentration - currentScenario.PropConcentration[currentPhase]) / currentScenario.PropConcentration[currentPhase]]);
    currentTopPerfChart.draw(topPerfChartData[currentStage], google.charts.Line.convertOptions(currentTopPerfChartOptions));
}

function createBottomPerformanceChart(stageNumber) {
    bottomPerfChartData[stageNumber] = new google.visualization.DataTable();
    bottomPerfChartData[stageNumber].addColumn('number', 'Minutes');
    bottomPerfChartData[stageNumber].addColumn('number', 'Friction Reducer/Conc');
    bottomPerfChartData[stageNumber].addColumn('number', 'Clay Stabilize/Conc');
    bottomPerfChartData[stageNumber].addColumn('number', 'Surfacant/Conc');
    bottomPerfChartData[stageNumber].addColumn('number', 'Biocide/Conc');

    currentBottomPerfChartOptions = {
        chart: {
            //title: 'Stage ' +stageNumber
        },
        width: '90%',
        height: '300px',
        vAxes: {
            0: { format: 'percent' }
        },
        series: {
            0: { targetAxisIndex: 0 },
            1: { targetAxisIndex: 0 },
            2: { targetAxisIndex: 0 },
            3: { targetAxisIndex: 0 },
        },
        backgroundColor: '#FFFFFF'
    };

    currentBottomPerfChart = new google.charts.Line(document.getElementById("perfStageChart" + stageNumber + "Bottom"));
}

function updateBottomPerfChart(point, wellPoint) {
    bottomPerfChartData[currentStage].addRow([
                                wellPoint.TimeInMinute,
                                (wellPoint.FrictionReducer - currentScenario.FrictionReducer[currentPhase]) / currentScenario.FrictionReducer[currentPhase],
                                (wellPoint.ClayStay - currentScenario.ClayStay[currentPhase]) / currentScenario.ClayStay[currentPhase],
                                (wellPoint.Surfacant - currentScenario.Surfacant[currentPhase]) / currentScenario.Surfacant[currentPhase],
                                (wellPoint.Biocide - currentScenario.Biocide[currentPhase]) / currentScenario.Biocide[currentPhase]
                                ]);
    currentBottomPerfChart.draw(bottomPerfChartData[currentStage], google.charts.Line.convertOptions(currentBottomPerfChartOptions));
}

function createCostChart(stageNumber) {
    costChartData[stageNumber] = new google.visualization.DataTable();
    costChartData[stageNumber].addColumn('number', 'Cost');
    costChartData[currentStage].addRow([0]);

    currentCostChartOptions = {
        chart: {
            //title: 'Stage ' +stageNumber
        },
        width: '300px',
        height: '300px',
        greenFrom: 0, greenTo: 50,
        redFrom: 75, redTo: 100,
        yellowFrom: 50, yellowTo: 75,
        minorTicks: 5
    };

    currentCostChart = new google.visualization.Gauge(document.getElementById("costStage" + stageNumber));
}

function updateCostChart(point, wellPoint) {
    costChartData[currentStage].setValue(0, 0, Math.round(100 * Math.random()));
    currentCostChart.draw(costChartData[currentStage], currentCostChartOptions);
}