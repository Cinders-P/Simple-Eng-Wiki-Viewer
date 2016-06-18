var results = "";
var pageID = "";
var cardString = "";
var dex = 0;
var title = "";
var snippet = "";
var cardArr = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]; //10 items
var counter = 0;
var keys = 0;
var offset = -10;

$(function() {
    $("form").submit(function(event) {
        offset = -10;
        $("#results").empty();
        if ($("input[type=text]").val() === "") {
            $(".jumbotron").css("justify-content", "center");
            return false;
        }
        addResults();
        event.preventDefault();
    });
    $(window).scroll(function() {
        if (($(".jumbotron").css("justify-content") === "flex-start") && ($(window).scrollTop() + $(window).height() == $(document).height())) {
            addResults();
        }
    });
});

function getImage(dex, title, snippet) {
    $.ajax({
        dataType: "json",
        url: "https://simple.wikipedia.org/w/api.php?action=query&titles=" + title + "&prop=pageimages&format=json&pithumbsize=400&callback=?",
        success: function(jImage) {
            for (var prop in jImage.query.pages) {
                if (jImage.query.pages.hasOwnProperty(prop)) {
                    pageID = prop;
                    break;
                }
            }
            cardString = '<div class="card"> <div id="triangle-left"></div><div id="indexNum">' + (dex + 1 + offset) + '</div>';
            if (jImage.query.pages[pageID].thumbnail) {
                cardString = cardString.concat('<a href="https://simple.wikipedia.org/wiki/' + title.replace(/\s/, "_") + '"><div class="img-clip"><img src="' + jImage.query.pages[pageID].thumbnail.source + '"></div></a>');
            } else {
                cardString = cardString.concat('<div class="blank"></div>');
            }
            cardString = cardString.concat('<span class="text-xs-left"><h3 class="card-title"><a href="https://simple.wikipedia.org/wiki/' + title.replace(/\s/, "_") + '">' + title + '</a></h3><p class="card-text">' + snippet + '...</p>');
            cardArr[dex] = cardString;
            cardString = "";

            if (counter == keys - 1) {
                for (var i = 0; i < cardArr.length; i++) {
                    if (cardArr[i] !== "qwertyuiop")
                        $("#results").append(cardArr[i]);
                }
            } else
                counter++;
        }
    });
}

function addResults() {
    $.ajax({
        dataType: "json",
        url: "https://simple.wikipedia.org/w/api.php?action=query&list=search&srsearch=" + $("input[type=text]").val() + "&srprop=snippet&srlimit=10&sroffset=" + (offset + 10) + "&formatversion=2&format=json&callback=?",
        success: function(json) {
            cardArr.fill("qwertyuiop");
            counter = 0;
            keys = Object.keys(json.query.search).length;
            $(".jumbotron").css("justify-content", "flex-start");
            for (dex = 0; dex < keys; dex++) {
                title = json.query.search[dex].title;
                snippet = json.query.search[dex].snippet;
                getImage(dex, title, snippet);
            }
        }
    });
    offset += 10;
}
