(function () {
    'use strict';
    // Uncomment the following line to enable first chance exceptions.
    // Debug.enableFirstChanceException(true);

    WinJS.Application.onmainwindowactivated = function (e) {
        if (e.detail.kind === Windows.ApplicationModel.Activation.ActivationKind.launch) {
            // start the download
            downloadStatus.innerText = "downloading posts...";

            var syn = new Windows.Web.Syndication.SyndicationClient();
            var url = new Windows.Foundation.Uri("http://84zume.wordpress.com/feed/");
            syn.retrieveFeedAsync(url).then(processPosts, downloadError);

            WinJS.UI.processAll();
        }

        var postItems = [];

        function processPosts(feed) {
            downloadStatus.innerText = "";

            for (var i = 0, len = feed.items.length; i < len; i++) {
                var item = feed.items[i];
                var post = {
                    title: item.title.text,
                    date: item.publishedDate,
                    content: item.summary.text,
                };
                postItems.push(post);
            }

            // populate the ListView control's data source
            posts.winControl.dataSource = postItems;
        }



        function downloadError() {
            downloadStatus.innerText = "error downloading posts";
        }


        function selectionChanged(e) {
            content.innerHTML = "";
            var selection = posts.winControl.selection;

            if (selection.length) {
                var post = postItems[selection[0].begin];
                var contentTemplate = WinJS.UI.getControl(document.getElementById("contentTemplate"));
                contentTemplate.render(post).then(function (element) {
                    content.appendChild(element);
                });
            }
        }

        posts.addEventListener("selectionchanged", selectionChanged);
    }

    WinJS.Application.start();


})();
