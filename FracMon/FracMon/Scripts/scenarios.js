
var currentPhase = 0;
var lastPropConcentration = null;

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
