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
    that.PollForBuildStatus(server);
    setInterval(function() { that.PollForBuildStatus(server); }, 5000);
  },
  PollForBuildStatus: function (server) {
    var that = this;

    HelperMethods.DisplayLoadingSpinner(that.gridItem.children(".build-title"));

    that.teamCityApi.GetRunningBuild(server, that.itemSettings.id, function (err, runningBuild) {
      if (!err && runningBuild != null) {
        that.gridItem.css({
          backgroundImage: "url(../img/SuccessGreen.png)",
          backgroundSize: runningBuild.percentageComplete + "% 100%",
          backgroundRepeat: "repeat-y",
          backgroundColor: "#272822"
        });
      } else {
        that.gridItem.css({
          backgroundImage: "",
          backgroundSize: "",
          backgroundRepeat: "",
          backgroundColor: ""
        });
      }
    });

    that.teamCityApi.GetLatestBuild(server, that.itemSettings.id, function(err, latestBuild) {
      that.gridItem.removeClass("SUCCESS").removeClass("FAULURE").removeClass("NOT_RUN");
      HelperMethods.RemoveLoadingSpinner(that.gridItem.children(".build-title"));
      if (latestBuild === null) {
        that.gridItem.addClass("NOT_RUN");
        return;
      }

      that.gridItem.addClass(latestBuild.status);
      that.gridItem.find(".build-requestor").text(latestBuild.triggered.user.username);
      that.gridItem.find(".build-time").text(moment.parseZone(latestBuild.finishDate).format("DD/MM/YY HH:mm:ss") + " (" + moment.parseZone(latestBuild.finishDate).fromNow() + ")");
    });
  },
  SaveSize: function () {
    this.dataStore.UpdateBuildSize(this.Context.Context.itemSettings, this.Context.itemSettings, this.itemSettings);
  }
}, DashboardItem);