var DashboardItem = {
  Context: null,
  itemSettings: null,
  Init: function(dashboardItemParam, targetElement, teamCityApi, dataStore, context) {
    this.itemSettings = dashboardItemParam;
    this.$targetElement = $(targetElement);
    this.teamCityApi = teamCityApi;
    this.dataStore = dataStore;
    this.Context = context;
    return this;
  },
  InitDashboardItemEventListeners: function($dashboardItemElement) {
    var that = this,
      resizerButtonsFadeTime = 500;
    $dashboardItemElement.hover(function(e) {
      e.stopPropagation();
      var $lowestTarget = $(this).hasClass("grid-item") ? $(this) : $(this).parents(".grid-item").first();
      $lowestTarget.children(".resizer-buttons").stop().animate({ opacity: 1 }, resizerButtonsFadeTime);
      $lowestTarget.parents(".grid-item").children(".resizer-buttons").stop().animate({ opacity: 0 }, resizerButtonsFadeTime);
    }, function(e) {
      var $lowestTarget = $(this).hasClass("grid-item") ? $(this) : $(this).parents(".grid-item").first();
      $lowestTarget.children(".resizer-buttons").stop().animate({ opacity: 0 }, resizerButtonsFadeTime);
      $lowestTarget.parents(".grid-item").first().children(".resizer-buttons").stop().animate({ opacity: 1 }, resizerButtonsFadeTime);
    });

    $dashboardItemElement.children(".resizer-buttons").children(".resizer-button").on("click", function() {
      that.ResizeDashboardItem($(this));
    });
  },
  SetItemWidth: function(dasboardItem) {
    dasboardItem.width = dasboardItem.width ? dasboardItem.width : "large";
    if (dasboardItem.width === "small") {
      dasboardItem.colSize = "col-xs-4 small";
    } else if (dasboardItem.width === "medium") {
      dasboardItem.colSize = "col-xs-6 medium";
    } else if (dasboardItem.width === "large") {
      dasboardItem.colSize = "col-xs-12 large";
    }

    return dasboardItem;
  },
  ResizeDashboardItem: function($clickedResizer) {
    var that = this,
      $thisGridItem = $clickedResizer.parents(".grid-item").first(),
      thisGridItemWidthBefore = $thisGridItem.outerWidth();

    $thisGridItem.removeClass("small")
      .removeClass("medium")
      .removeClass("large")
      .removeClass("col-xs-12")
      .removeClass("col-xs-6")
      .removeClass("col-xs-4");
    if ($clickedResizer.hasClass("small-resizer-button")) {
      $thisGridItem.addClass("small").addClass("col-xs-4");
      that.itemSettings.width = "small";
    } else if ($clickedResizer.hasClass("med-resizer-button")) {
      $thisGridItem.addClass("medium").addClass("col-xs-6");
      that.itemSettings.width = "medium";
    } else if ($clickedResizer.hasClass("large-resizer-button")) {
      $thisGridItem.addClass("large").addClass("col-xs-12");
      that.itemSettings.width = "large";
    }

    that.SaveSize();
    var thisGridItemWidthAfter = $thisGridItem.outerWidth();

    that.ReversePackery($("#dashboard-grid-container").find(".grid-item-contents"));
    var $packeryGrid = $("#dashboard-grid-container").packery();

    $thisGridItem.addClass("animating-grid-item");
    $thisGridItem.css("width", thisGridItemWidthBefore).animate({ width: thisGridItemWidthAfter }, 500, "easeOutExpo", function() {
      $thisGridItem.css("width", "");
    });

    $packeryGrid.on("layoutComplete", function() {
      if ($(event.currentTarget).hasClass("animating-grid-item")) {
        $(event.currentTarget).removeClass("animating-grid-item");
        $packeryGrid.off("layoutComplete");
        var originalScrollTop = $(window).scrollTop();
        var topOfLaidOutItem = $thisGridItem.offset().top;
        var bottomOfLaidOutItem = topOfLaidOutItem + $thisGridItem.outerHeight();
        var windowHeight = $(window).height();
        var newScrollTop = originalScrollTop >= topOfLaidOutItem ? topOfLaidOutItem : bottomOfLaidOutItem - (originalScrollTop + windowHeight);
        console.log(newScrollTop);
        $("body").animate({
          scrollTop: newScrollTop
        }, 500, "easeOutExpo");
      }
    });
  },
  ReversePackery: function(listOfContainers) {
    for (var i = listOfContainers.length - 1; i > -1; i--) {
      $(listOfContainers[i]).packery("layout");
    }
  }
}