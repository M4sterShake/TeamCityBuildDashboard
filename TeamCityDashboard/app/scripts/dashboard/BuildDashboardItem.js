var BuildDashboardItem = $.extend({
  Show: function (server) {
    var that = this;
    that.SetItemWidth(that.itemSettings);
    that.gridItem = $(Handlebars.templates['BuildGridBuildTemplate'](that.itemSettings));
    that.InitDashboardItemEventListeners(that.gridItem);
    that.$targetElement.append(that.gridItem);
    that.StartPollingTcApi(server);
  },
  StartPollingTcApi(server) {
    var that = this;
    that.teamCityApi.GetBuildStatus(server, that.itemSettings.id, function (err, buildStatus) {
      that.gridItem.addClass(buildStatus)
      console.log(buildStatus);
    });
  }
}, DashboardItem);