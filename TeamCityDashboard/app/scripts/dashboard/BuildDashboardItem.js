var BuildDashboardItem = $.extend({
  Show: function () {
    var that = this;
    var buildGridItem = $(Handlebars.templates['BuildGridBuildTemplate'](that.dashboardItem));
    that.$targetElement.append(buildGridItem);
  }
}, DashboardItem);