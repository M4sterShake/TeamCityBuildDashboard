var ServerDashboardItem = $.extend({
  Show: function () {
    var that = this;
    that.dashboardItem = that.SetItemWidth(that.dashboardItem);
    var serverGridItem = $(Handlebars.templates['BuildGridServerTemplate'](that.dashboardItem));
    that.$targetElement.append(serverGridItem);

    for (var i = 0; i < that.dashboardItem.subscriptions.length; i++) {
      var projectDashboardItem = Object.create(ProjectDashboardItem).Init(that.dashboardItem.subscriptions[i], that.$targetElement.find(".server-contents"));
      projectDashboardItem.Show();
    }
  }
}, DashboardItem);
