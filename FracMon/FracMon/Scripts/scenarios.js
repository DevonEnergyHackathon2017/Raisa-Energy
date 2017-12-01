
var currentPhase = 0;
var lastPropConcentration = null;
var pumpedProp = 0;
var stageProp = 258552;
var designLaborCost = 42500;
var stageMinutes = 100;
var laberMinuteCost = designLaborCost / stageMinutes;
var clayActual = 0;
var clayCost = 63.10, sufactantCost = 82.89, frCost = 68.27;
var clayProjected = 0, probProjected = 0, bioActual = 0, bioProjected = 0;
var surfActual = 0, surfProjected = 0, frActual = 0, frProjected = 0, probCost = .1, biocideCost = 100.57;
var pvPerStage = 50000;

var currentScenario = {
    SlurryRate: [16.2, 38, 38, 38, 38, 38, 38, 38],
    PropConcentration: [0.001, 1, 2, 2.5, 3, 3.5, 4, 0.001],

    FrictionReducer: [0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4],
    ClayStay: [1, 1, 1, 1, 1, 1, 1, 1],
    Surfacant: [2, 2, 2, 2, 2, 2, 2, 2],
    Biocide: [0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2],

    Pressure: [10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000],
    FluidVolume: [18438, 30324, 17556, 15960, 17556, 15960, 11172, 4788],
    PropVolume: [0, 30324, 35112, 39900, 52668, 55860, 44688, 0]
};

function fillScenarioData() {

}

function resetPhase() {
    currentPhase = 0;
}

function updatePhase(wellDataPoint) {
    if (lastPropConcentration == null)
        lastPropConcentration = wellDataPoint.PropConcentration;

    if (lastPropConcentration != wellDataPoint.PropConcentration) {
        currentPhase += 1;
        if (currentPhase >= currentScenario.SlurryRate.length)
            currentPhase = currentScenario.SlurryRate.length - 1;

        lastPropConcentration = wellDataPoint.PropConcentration
    }
    
}

function checkDataPoint(wellDataPoint, stageNumber) {
    return;

    if (wellDataPoint.Pressure > 15) {
        showOverlay("PressureOverlay", 12);
    } else {
        hideOverlay("PressureOverlay");
    }
}

function resetScenarioVariables() {
    pumpedProp = 0;
    stageProp = 258552;
    designLaborCost = 42500;
    stageMinutes = 100;
    laberMinuteCost = designLaborCost / stageMinutes;
    clayActual = 0;
    clayCost = 63.10;
    sufactantCost = 82.89;
    frCost = 68.27;
    clayProjected = 0;
    probProjected = 0;
    bioActual = 0;
    bioProjected = 0;
    surfActual = 0;
    surfProjected = 0;
    frActual = 0;
    frProjected = 0;
    probCost = .1;
    biocideCost = 100.57;
    pvPerStage = 50000;
}

function getTimeRemaining(wellDataPoint) {
    var sum = 0;
    for(var i=currentPhase;i<currentScenario.PropVolume.length;i++)
    {
        var currentPropVolume = currentScenario.PropVolume[i];
        var currentPropConc = currentScenario.PropConcentration[i];
        sum += currentPropVolume / currentPropConc;
    }

    var tempVal = wellDataPoint.SlurryRate / currentScenario.SlurryRate[currentPhase];

    sum = sum / (42 * 38 * tempVal);

    return sum;
}

function calculateCost(wellDataPoint, stageNumber) {
    pumpedProp += (wellDataPoint.PropConcentration * wellDataPoint.SlurryRate * 42);
    var remaningProp = stageProp - pumpedProp;
    var timeRemaining = 100 - wellDataPoint.TimeInMinute;
    if (wellDataPoint.PropConcentration * wellDataPoint.SlurryRate > 0)
        timeRemaining = getTimeRemaining(wellDataPoint);//remaningProp / (wellDataPoint.PropConcentration * wellDataPoint.SlurryRate * 42);
    var laborCost = timeRemaining * laberMinuteCost;
    var remainingLaborCost = designLaborCost - wellDataPoint.TimeInMinute * laberMinuteCost;
    var additionalLaborCost = laborCost - remainingLaborCost;
    clayActual += (wellDataPoint.ClayStay * wellDataPoint.SlurryRate * clayCost * 42) / 1000;
    clayProjected += (currentScenario.FrictionReducer[currentPhase] * currentScenario.SlurryRate[currentPhase] * clayCost * 42) / 1000;
    surfActual += (wellDataPoint.SlurryRate * wellDataPoint.Surfacant * sufactantCost * 42) / 1000;
    surfProjected += currentScenario.SlurryRate[currentPhase] * currentScenario.Surfacant[currentPhase] * frCost * 42 / 1000;
    frActual += (wellDataPoint.FrictionReducer * wellDataPoint.SlurryRate * frCost * 42) / 1000;
    frProjected += (currentScenario.FrictionReducer[currentPhase] * currentScenario.SlurryRate[currentPhase] * frCost * 42) / 1000;
    var probActual = pumpedProp * probCost;
    probProjected += currentScenario.PropConcentration[currentPhase] * currentScenario.SlurryRate[currentPhase] * probCost;
    bioActual += (wellDataPoint.Biocide * wellDataPoint.SlurryRate * biocideCost * 42) / 1000;
    bioProjected += (currentScenario.SlurryRate[currentPhase] * currentScenario.Biocide[currentPhase] * 42 * biocideCost) / 1000;
    var chemicalDifference = (clayActual + surfActual + frActual + probActual + bioActual) - (clayProjected + surfProjected + frProjected + probProjected + bioProjected);
    var variance = chemicalDifference + additionalLaborCost;

    return pvPerStage - variance;
}
