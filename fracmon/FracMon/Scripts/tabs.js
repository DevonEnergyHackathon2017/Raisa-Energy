function loadTabs() {
    jQuery('ul.tabs').each(function () {
        // For each set of tabs, we want to keep track of
        // which tab is active and it's associated content
        var $active, $content, $links = jQuery(this).find('a');

        // If the location.hash matches one of the links, use that as the active tab.
        // If no match is found, use the first link as the initial active tab.
        $active = jQuery($links.filter('[href="' + location.hash + '"]')[0] || $links[0]);
        $active.addClass('active');

        $content = $($active[0].hash);

        // Hide the remaining content
        $links.not($active).each(function () {
            jQuery(this.hash).hide();
        });

        // Bind the click event handler
        jQuery(this).on('click', 'a', function (e) {
            // Make the old tab inactive.
            $active.removeClass('active');
            $content.hide();

            // Update the variables with the new link and content
            $active = jQuery(this);
            $content = jQuery(this.hash);

            // Make the tab active.
            $active.addClass('active');
            $content.show();

            // Prevent the anchor's default click action
            e.preventDefault();
        });
    });
}

function addStageChartTab(stageNumber) {
    var tabs = $("#stageTabContainer").tabs();
    var ul = tabs.find("ul");

    var stageName = "stage" + stageNumber;
    var chartName = "stageChart" + stageNumber;
    var tabLink = '<li><a href="#' + stageName + '">Stage ' + stageNumber + '</a></li>';
    var tabContent = '<div id="' +stageName +'"><div id="' +chartName +'" style="height: 370px; width:100%;"></div></div>';
    $(tabLink).appendTo(ul);
    $(tabContent).appendTo(tabs);
    tabs.tabs("refresh");
}
