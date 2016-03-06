var ProjectDashboardItem = $.extend({
  Show: function() {
    var that = this;
    var projectGridItem = $(Handlebars.templates['BuildGridProjectTemplate'](that.dashboardItem));
    that.$targetElement.append(projectGridItem);

    for (var i = 0; i < that.dashboardItem.builds.length; i++) {
      var buildDashboardItem = Object.create(BuildDashboardItem).Init(that.dashboardItem.builds[i], $(projectGridItem).find(".project-contents"));
      buildDashboardItem.Show();
    }
  }
}, DashboardItem);