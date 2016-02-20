(function () {
  var that = this,
    dataStore,
    teamCityApi,
    animationSpeed = 1250;

  this.moveForwardSettingsPage = function() {
    var $currentSettingsPage = $("#container .current-settings-page");
    var $nextSettingsPages = $currentSettingsPage.nextAll(".settings-page");
    if ($nextSettingsPages.length > 0) {
      switchCurrentSettingsPage($currentSettingsPage, $nextSettingsPages.first());
      moveOffScreenLeft($currentSettingsPage);
      moveOnScreenLeft($nextSettingsPages.first());
      $(".back-button").fadeTo(animationSpeed /2, 1, function() {
        $(".back-button").removeClass("unclickable");
      });
    }
  }

  this.moveBackSettingsPage = function() {
    var $currentSettingsPage = $("#container .current-settings-page");
    var $prevSettingsPages = $currentSettingsPage.prevAll(".settings-page");
    if ($prevSettingsPages.length > 0) {
      switchCurrentSettingsPage($currentSettingsPage, $prevSettingsPages.first());
      moveOffScreenRight($currentSettingsPage);
      moveOnScreenRight($prevSettingsPages.first());
      if ($("#container .current-settings-page").prevAll().length === 0) {
        $(".back-button").fadeTo(animationSpeed /2, 0, function() {
          $(".back-button").addClass("unclickable");
        });
      }
    }
  }

  init();

  function init() {
    dataStore = DataStore.init();
    teamCityApi = TeamCityApi.init();
    initEventHandlers();
    ServerList.init(dataStore, teamCityApi, that).Show("#container");
  }

  function initEventHandlers() {
    $(".back-button").on("click", function() {
      that.moveBackSettingsPage();
    });
  }

  function moveOnScreen(settingsPageElement) {
    settingsPageElement.css("opacity", "0");
    settingsPageElement.show();
    settingsPageElement.stop();
    settingsPageElement.animate({
      left: 0,
      opacity: 1
    },
      animationSpeed,
      "easeOutQuart"
    );
  }

  function moveOnScreenLeft(settingsPageElement) {
    settingsPageElement.css("left", $(window).width());
    moveOnScreen(settingsPageElement);
  }

  function moveOnScreenRight(settingsPageElement) {
    settingsPageElement.css("left", 0 - $(window).width());
    moveOnScreen(settingsPageElement);
  }

  function moveOffScreen(settingsPageElement, leftPos) {
    settingsPageElement.css("opacity", 1);
    settingsPageElement.show();
    settingsPageElement.stop();
    settingsPageElement.animate({
        left: leftPos,
        opacity: 0
      },
      animationSpeed,
      "easeOutQuart",
      function () {
        settingsPageElement.hide();
      }
    );
  }

  function moveOffScreenLeft(settingsPageElement) {
    moveOffScreen(settingsPageElement, 0 - $(window).width());
  }

  function moveOffScreenRight(settingsPageElement) {
    moveOffScreen(settingsPageElement, $(window).width());
  }

  function switchCurrentSettingsPage(oldSettingsPage, newSettingsPage) {
    oldSettingsPage.removeClass("current-settings-page");
    newSettingsPage.addClass("current-settings-page");
  }
})();