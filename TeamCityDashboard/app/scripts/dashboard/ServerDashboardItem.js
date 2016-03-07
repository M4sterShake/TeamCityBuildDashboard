var ServerDashboardItem = $.extend({
  Show: function () {
    var that = this;
    that.itemSettings = that.SetItemWidth(that.itemSettings);
    Handlebars.partials = Handlebars.templates;
    var $serverGridItem = $(Handlebars.templates['BuildGridServerTemplate'](that.itemSettings));
    that.InitDashboardItemEventListeners($serverGridItem);
    that.$targetElement.append($serverGridItem);

    for (var i = 0; i < that.itemSettings.subscriptions.length; i++) {
      var projectDashboardItem = Object.create(ProjectDashboardItem).Init(that.itemSettings.subscriptions[i], that.$targetElement.find(".server-contents"));
      projectDashboardItem.Show();
    }
  }
}, DashboardItem);
