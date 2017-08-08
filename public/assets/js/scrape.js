// Counter for how reddit handles their URLs
let count = 25;
let currentCategory = "";
// Masonry Grid Initialization
let $grid = $('.grid').masonry({
    // specify itemSelector so stamps do get laid out
    itemSelector: '.grid-item',
    columnWidth: 80
});
// Get call to obtain scraped data
let obtainGif = (e) => {
    let category = $(event.currentTarget).data("category");
    let lastIndex = $(".itemRow").length;
    // If first scrape
    if (lastIndex === 0) {
        $.get(`/api/0`, {
            category: category
        }, function (data) {
            appendGif(data);
        });
    } else if (currentCategory == category) {
        // Not first scrape, modifies get call to obtain next reddit page
        let lastID = $($(".itemRow")[lastIndex - 1]).data("id");
        let page = `count=${count}&after=${lastID}`; //reddit specific url
        $.get(`/api/${page}`, {
            category: category
        }, function (data) {
            appendGif(data);
        });
        count += 25;
        // New Category - so starting over
    } else if (currentCategory != category) {
        count = 25;
        $.get(`/api/0`, {
            category: category
        }, function (data) {
            $(".gifDiv").empty();
            appendGif(data);
        });
    }
    currentCategory = category;
};
//Appends scraped data onto screen
let appendGif = (data) => {
    data.forEach((singleGif) => {
        // Removes the V from "gifv" so it can properly be used as a image src
        if (singleGif.url[singleGif.url.length - 1] == "v") {
            singleGif.url = singleGif.url.slice(0, singleGif.url.length - 1)
        }
        let row = $(`<div class="grid-item itemRow col-lg-12 text-center img-rounded" id="${singleGif.id}" data-id="${singleGif.id}">`);
        let image = $(`<div class="col-md-11 col-lg-offset-1"><a href="${singleGif.url}" class="pop image-reponsive" data-url="${singleGif.url}"><img class="img-responsive" src="${singleGif.thumbnail}" width="100" height="80"></a></div>`);
        let title = $(`<div class="col-md-12"><h4 class="gifTitle text-default">${singleGif.title}</h4></div>`);
        let directLinkBtn = $(`<a href="${singleGif.urlComments}" target="_blank"><button class="btn btn-default"><i class="fa fa-reddit-alien"></i></button></a>`);
        // Appends data attributes to the favorite button
        let favoriteBtn = $(`<button class="btn btn-primary favBtn" data-title="${singleGif.title}" data-url="${singleGif.url}" data-thumbnail="${singleGif.thumbnail}" data-reddit="${singleGif.id}" data-urlcomments="${singleGif.urlComments}"><span class="glyphicon glyphicon-heart" aria-hidden="true"></span></button>`);
        title.append(favoriteBtn);
        title.append(directLinkBtn);
        row.append(image);
        row.append(title);
        $grid.append(row).masonry('reloadItems').masonry("layout");
    });

    // Masonry reloads grids since new images are appended
    $grid.imagesLoaded().progress(function () {
        $grid.masonry('layout');
    });

};
//Adds gif to favorite DB then removes it from page
let addToFavorites = (event) => {
    let id = $(event.currentTarget).data("reddit");
    $.post("/favorite", {
        title: $(event.currentTarget).data("title"),
        url: $(event.currentTarget).data("url"),
        thumbnail: $(event.currentTarget).data("thumbnail"),
        urlComments: $(event.currentTarget).data("urlcomments"),
        redditID: id
    });
    $(`#${id}`).remove();
    $grid.imagesLoaded().progress(function () {
        $grid.masonry('layout');
    });
};
// Updates recipe modal for viewing on favorites and home
let updateModal = (event) => {
    event.preventDefault();
    let currentGif = $(event.currentTarget).data("url");
    $('#imagepreview').attr('src', currentGif);
    $('#imagemodal').modal('show')
}
// Click handlers
$(".gifDiv").on("click", ".favBtn", addToFavorites);
$(".scrapeBtn").on("click", obtainGif);
$("body").on("click", ".pop", updateModal);