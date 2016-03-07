var ProjectDashboardItem = $.extend({
  Show: function() {
    var that = this;
    that.SetItemWidth(that.itemSettings);
    var $projectGridItem = $(Handlebars.templates['BuildGridProjectTemplate'](that.itemSettings));
    that.InitDashboardItemEventListeners($projectGridItem);
    that.$targetElement.append($projectGridItem);

    for (var i = 0; i < that.itemSettings.builds.length; i++) {
      var buildDashboardItem = Object.create(BuildDashboardItem).Init(that.itemSettings.builds[i], $($projectGridItem).find(".project-contents"));
      buildDashboardItem.Show();
    }
  }
}, DashboardItem);