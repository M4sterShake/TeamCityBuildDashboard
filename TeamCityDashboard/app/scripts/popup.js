(function ($) {
  $("#main-menu li a").on("click", function (e) {
    e.preventDefault();
    switch ($(this).parent().attr("id")) {
      case "dashboard-menu-item":
        dashboardClickedEventHandler();
        break;
      case "settings-menu-item":
        settingsClickedEventHandler();
        break;
      default:
        alert("Woah mate, not sure what happend there!");
    }
  });

  function dashboardClickedEventHandler() {
    chrome.tabs.create({
      url: "pages/dashboard.html"
    });
  }

  function settingsClickedEventHandler() {
    chrome.runtime.openOptionsPage();
  }
})(jQuery);

