function loadTabs() {
    jQuery('ul.tabs').each(function () {
        // For each set of tabs, we want to keep track of
        // which tab is active and it's associated content
        var $active, $content, $links = jQuery(this).find('a');

        // If the location.hash matches one of the links, use that as the active tab.
        // If no match is found, use the first link as the initial active tab.
        $active = jQuery($links.filter('[href="' + location.hash + '"]')[0] || $links[0]);
        //$active.addClass('active');
        $active.removeClass('ui-link');
        $active.removeClass('btn-default');
        $active.addClass('btn');
        $active.addClass('btn-primary');

        $content = $($active[0].hash);

        // Hide the remaining content
        $links.not($active).each(function () {
            jQuery(this.hash).hide();
        });

        // Bind the click event handler
        jQuery(this).on('click', 'a', function (e) {
            // Make the old tab inactive.
            //$active.removeClass('active');
            $active.removeClass('ui-link');
            $active.removeClass('btn-primary');
            $active.addClass('btn');
            $active.addClass('btn-default');
            $content.hide();

            // Update the variables with the new link and content
            $active = jQuery(this);
            $content = jQuery(this.hash);

            // Make the tab active.
            //$active.addClass('active');
            $active.addClass('btn-primary');
            $content.show();

            // Prevent the anchor's default click action
            e.preventDefault();
        });
    });
}

function addStageChartTab(stageNumber) {
    var tabToCreate = document.getElementById('stage' + stageNumber);
    if ((tabToCreate != null) && (tabToCreate != undefined))
        return;

    var tabs = $("#stageTabContainer").tabs();
    var ul = tabs.find("ul");

    var stageName = "stage" + stageNumber;
    var chartName = "stageChart" + stageNumber;
    var tabLink = '<li><a id="' + stageName + 'Tab" href="#' + stageName + '" class="btn btn-primary">Stage ' + stageNumber + '</a></li>';
    var tabContent = '<div id="' + stageName + '" style="width:920px;"><div id="' + chartName + 'Top" style="height: 300px; width:900px;"></div><div id="' + chartName + 'Bottom" style="height: 300px; width:900px;"></div></div>';
    $(tabLink).appendTo(ul);
    $(tabContent).appendTo(tabs);
    tabs.tabs("refresh");
    var newTabIndex = stageNumber - 1;
    console.log("New Tab" + newTabIndex);
    tabs.tabs({
        active: stageNumber - 1
    });

    ////////// Goal Tracking charts
    tabs = $("#stagePerformanceContainer").tabs();
    ul = tabs.find("ul");

    stageName = "perfStage" + stageNumber;
    chartName = "perfStageChart" + stageNumber;
    tabLink = '<li><a id="' + stageName + 'Tab" href="#' + stageName + '" class="btn btn-primary">Stage ' + stageNumber + '</a></li>';
    tabContent = '<div id="' + stageName + '" style="width:620px;"><div id="' + chartName + 'Top" style="height: 300px; width:600px;"></div><div id="' + chartName + 'Bottom" style="height: 300px; width:600px;"></div></div>';
    $(tabLink).appendTo(ul);
    $(tabContent).appendTo(tabs);
    tabs.tabs("refresh");
    newTabIndex = stageNumber - 1;
    tabs.tabs({
        active: stageNumber - 1
    });
}

function markStageDone(stageNumber) {
    var stageName = "stage" + stageNumber +"Tab";
    var stageTab = $("#" + stageName);
    stageTab.removeClass("btn-primary");
    stageTab.addClass("btn-success");

    stageName = "perfStage" + stageNumber + "Tab";
    stageTab = $("#" + stageName);
    stageTab.removeClass("btn-primary");
    stageTab.addClass("btn-success");
}
