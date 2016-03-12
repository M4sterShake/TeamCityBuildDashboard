var DashboardItem = {
  Init: function (dashboardItemParam, targetElement, teamCityApi) {
    this.itemSettings = dashboardItemParam;
    this.$targetElement = $(targetElement);
    this.teamCityApi = teamCityApi;
    return this;
  },
  InitDashboardItemEventListeners: function ($dashboardItemElement) {
    var that = this,
      resizerButtonsFadeTime = 500;
    $dashboardItemElement.hover(function (e) {
      e.stopPropagation();
      var $lowestTarget = $(this).hasClass("grid-item") ? $(this) : $(this).parents(".grid-item").first();
      $lowestTarget.children(".resizer-buttons").stop().animate({ opacity: 1 }, resizerButtonsFadeTime);
      $lowestTarget.parents(".grid-item").children(".resizer-buttons").stop().animate({ opacity: 0 }, resizerButtonsFadeTime);
    }, function (e) {
      var $lowestTarget = $(this).hasClass("grid-item") ? $(this) : $(this).parents(".grid-item").first();
      $lowestTarget.children(".resizer-buttons").stop().animate({ opacity: 0 }, resizerButtonsFadeTime);
      $lowestTarget.parents(".grid-item").first().children(".resizer-buttons").stop().animate({ opacity: 1 }, resizerButtonsFadeTime);
    });

    $dashboardItemElement.children(".resizer-buttons").children(".resizer-button").on("click", function () {
      that.ResizeDashboardItem($(this));
    });
  },
  SetItemWidth: function (server) {
    server.width = server.width ? server.width : "large";
    if (server.width === "small") {
      server.colSize = "col-xs-4 small";
    } else if (server.width === "medium") {
      server.colSize = "col-xs-6 medium";
    } else if (server.width === "large") {
      server.colSize = "col-xs-12 large";
    }

    return server;
  },
  ResizeDashboardItem: function ($clickedResizer) {
    var that = this,
      $thisGridItem = $clickedResizer.parents(".grid-item").first();

    $thisGridItem.removeClass("small")
      .removeClass("medium")
      .removeClass("large")
      .removeClass("col-xs-12")
      .removeClass("col-xs-6")
      .removeClass("col-xs-4");
    if ($clickedResizer.hasClass("small-resizer-button")) {
      $thisGridItem.addClass("small").addClass("col-xs-4");
    } else if ($clickedResizer.hasClass("med-resizer-button")) {
      $thisGridItem.addClass("medium").addClass("col-xs-6");
    } else if ($clickedResizer.hasClass("large-resizer-button")) {
      $thisGridItem.addClass("large").addClass("col-xs-12");
    }

    that.ReversePackery($("#dashboard-grid-container").find(".grid-item-contents"));
    $("#dashboard-grid-container").packery();
  },
  ReversePackery: function (listOfContainers) {
    for (var i = listOfContainers.length -1; i > -1; i--) {
      $(listOfContainers[i]).packery("layout");
    }
  }
}