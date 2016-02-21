chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.clearCookie != null && request.cookieUrl != null) {
      chrome.cookies.remove({
        url: request.cookieUrl,
        name: request.clearCookie
      }, function(cookies) {
      //chrome.cookies.getAll({}, function (cookies) {
        sendResponse({ cookieContent: cookies });
      });
      return true;
    } 
  }
);