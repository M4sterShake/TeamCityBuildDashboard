var DashboardItem = {
  Init: function (dashboardItemParam, targetElement) {
    this.itemSettings = dashboardItemParam;
    this.$targetElement = $(targetElement);
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
  ResizeDashboardItem: function($clickedResizer) {
    var $thisGridItem = $clickedResizer.parents(".grid-item").first(),
      thisGridItemXBefore = $thisGridItem.position().left,
      thisGridItemYBefore = $thisGridItem.position().top,
      thisGridItemWidthBefore = $thisGridItem.outerWidth(),
      thisGridItemXAfter = null,
      thisGridItemYAfter = null,
      thisGridItemWidthAfter = null,
      positionsBefore = [],
      positionsAfter = [],
      thisOrChildrenSelector = function (index, element) {
        return $(element).is($thisGridItem) || $(element).is($thisGridItem.find(".grid-item")) ? true : false;
      };

    $('.grid-item').not(thisOrChildrenSelector).each(function (index, elem) {
      positionsBefore[index] = [$(elem).position().top, $(elem).position().left];
    });

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

    thisGridItemXAfter = $thisGridItem.position().left;
    thisGridItemYAfter = $thisGridItem.position().top;
    thisGridItemWidthAfter = $thisGridItem.outerWidth();
    $('.grid-item').not(thisOrChildrenSelector).each(function (index, elem) {
      positionsAfter[index] = [$(elem).position().top, $(elem).position().left];
    });

    $thisGridItem.css({ position: 'absolute', top: thisGridItemYBefore, left: thisGridItemXBefore, width: thisGridItemWidthBefore })
      .animate({ top: thisGridItemYAfter, left: thisGridItemXAfter, width: thisGridItemWidthAfter },
        750,
        "easeOutExpo",
        function () {
          $(this).css({ position: '', top: '', left: '', width: "" });
        });
    $('.grid-item').not(thisOrChildrenSelector).each(function (tindex, telem) {
      $(telem).css({ position: 'absolute', top: positionsBefore[tindex][0], left: positionsBefore[tindex][1] })
        .animate({ top: positionsAfter[tindex][0], left: positionsAfter[tindex][1] },
          750,
          "easeOutExpo",
          function() {
            $(this).css({ position: '', top: '', left: '' });
          });
    });
  }
}