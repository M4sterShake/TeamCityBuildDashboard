var HelperMethods = new function () {
  var messageDisplayTimeoutAction = null;
  this.DisplayError = function(target, message) {
    var $errorMessageBox = $("<span class='error-message'><span class='message'>" + message + "</span><span class='close-button'><i class='fa fa-times'></i></span></span>");
    $errorMessageBox.find(".close-button").on("click", function (e) {
      $(this).parent(".error-message").fadeOut(300, function() {
        $(this).parent(".error-message").remove();
      });
    });
    $errorMessageBox.css("opacity", 0);
    $(target).html($errorMessageBox);
    $errorMessageBox.fadeTo(300, 1);
  }

  this.ClearErrors = function(target) {
    $(target).find(".error-message").fadeOut(300, function () {
      $(target).find(".error-message").remove();
    });
  }

  this.DisplayMessage = function (message) {
    $("#message-toast").text(message);
    var toastWidth = $("#message-toast").outerWidth();
    if (messageDisplayTimeoutAction === null) {
      $("#message-toast").css({ right: -toastWidth, opacity: 0 });
      $("#message-toast").animate({ right: 0, opacity: 1 }, 800, "easeOutExpo");
    } else {
      clearTimeout(messageDisplayTimeoutAction);
    }
    
    messageDisplayTimeoutAction = setTimeout(function() {
      $("#message-toast").animate({ right: -toastWidth, opacity: 0 }, 800, "easeOutExpo");
      messageDisplayTimeoutAction = null;
    }, 5000);

  }
  this.DisplayLoadingSpinner = function ($target) {
    $target.append(this.GetLoadingSpinner());
  }

  this.GetLoadingSpinner = function() {
    return $("<div class='la-ball-scale-ripple-multiple loading-spinner'><div></div><div></div><div></div></div>");
  }

  this.RemoveLoadingSpinner = function($target) {
    $target.find(".loading-spinner").remove();
  }
}
