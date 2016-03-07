var BuildDashboardItem = $.extend({
  Show: function () {
    var that = this;
    that.SetItemWidth(that.itemSettings);
    var $buildGridItem = $(Handlebars.templates['BuildGridBuildTemplate'](that.itemSettings));
    that.InitDashboardItemEventListeners($buildGridItem);
    that.$targetElement.append($buildGridItem);
  }
}, DashboardItem);