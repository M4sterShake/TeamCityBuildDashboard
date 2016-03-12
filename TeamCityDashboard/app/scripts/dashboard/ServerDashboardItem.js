var ServerDashboardItem = $.extend({
  Show: function () {
    var that = this;
    that.itemSettings = that.SetItemWidth(that.itemSettings);
    Handlebars.partials = Handlebars.templates;
    var $serverGridItem = $(Handlebars.templates['BuildGridServerTemplate'](that.itemSettings));
    that.InitDashboardItemEventListeners($serverGridItem);
    that.$targetElement.append($serverGridItem);
    var $serverContents = $serverGridItem.find(".server-contents");

    for (var i = 0; i < that.itemSettings.subscriptions.length; i++) {
      var projectDashboardItem = Object.create(ProjectDashboardItem).Init(that.itemSettings.subscriptions[i], $serverContents, that.teamCityApi);
      projectDashboardItem.Show(that.itemSettings);
    }

    $serverContents.packery({
      itemSelector: '.project-grid-item'
    });
  }
}, DashboardItem);
