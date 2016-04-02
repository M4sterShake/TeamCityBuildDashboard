var ProjectDashboardItem = $.extend({
  Show: function(server) {
    var that = this;
    that.SetItemWidth(that.itemSettings);
    var $projectGridItem = $(Handlebars.templates['BuildGridProjectTemplate'](that.itemSettings));
    that.InitDashboardItemEventListeners($projectGridItem);
    that.$targetElement.append($projectGridItem);
    var $projectContents = $projectGridItem.find(".project-contents").first();
    for (var i = 0; i < that.itemSettings.builds.length; i++) {
      var buildDashboardItem = Object.create(BuildDashboardItem).Init(that.itemSettings.builds[i], $projectContents, that.teamCityApi, that.dataStore, that);
      buildDashboardItem.Show(server);
    }

    $projectContents.packery({
      itemSelector: '.build-grid-item',
      transitionDuration: '0.3s'
    });
  },
  SaveSize: function () {
    this.dataStore.UpdateProjectSize(this.Context.itemSettings, this.itemSettings);
  }
}, DashboardItem);