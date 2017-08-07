// var mediaItemContainer = $( '.grid' );
// mediaItemContainer.masonry( {
//     itemSelector: '.grid-item',
//     columnWidth:  200
// } );

// $( document ).ready(function() {
//     console.log( "ready!" );



var $grid = $('.grid').masonry({
    // specify itemSelector so stamps do get laid out
    itemSelector: '.grid-item',
    columnWidth: 80
});

let count = 25; //reddit counter for URL scraping
//Get call to obtain scraped data
let currentCategory = "";
let obtainFood = (e) => {
    let category = $(event.currentTarget).data("category");
    let lastIndex = $(".itemRow").length;
    //If first scrape
    if (lastIndex === 0) {
        $.get(`/api/0`, {
            category: category
        }, function (data) {
            appendFood(data);
        });
    } else if (currentCategory == category) {
        //Not first scrape, modifies get call to obtain next reddit page
        let lastID = $($(".itemRow")[lastIndex - 1]).data("id");
        let page = `count=${count}&after=${lastID}`; //reddit specific url
        $.get(`/api/${page}`, {
            category: category
        }, function (data) {
            appendFood(data);
        });
        count += 25;
    } else if (currentCategory != category) {
        // $(".foodItems").empty();
        count = 25;
        $.get(`/api/0`, {
            category: category
        }, function (data) {
            $(".foodItems").empty();
            appendFood(data);
        });
    }
    currentCategory = category;
};
//Appends scraped data onto screen
let appendFood = (data) => {
    data.forEach((singleRecipe) => {
        if (singleRecipe.url[singleRecipe.url.length - 1] == "v") {
            singleRecipe.url = singleRecipe.url.slice(0, singleRecipe.url.length - 1)
        }
        let row = $(`<div class="grid-item itemRow col-lg-12 text-center white img-rounded" id="${singleRecipe.id}" data-id="${singleRecipe.id}" style="border-bottom: 1px solid black; padding-top: 15px">`);
        let image = $(`<div class="col-md-11 col-lg-offset-1"><a href="${singleRecipe.url}" class="pop image-reponsive" data-url="${singleRecipe.url}"><img class="img-responsive" data-url="${singleRecipe.url}" src="${singleRecipe.thumbnail}" width="100" height="80"></a></div>`);
        let title = $(`<div class="col-md-12"><h4 class="text-primary" style="margin-top: 0;">${singleRecipe.title}</h4></div>`);
        let favoriteBtn = $(`<button class="btn btn-primary favBtn btn-sm" 
        data-title="${singleRecipe.title}" 
        data-url="${singleRecipe.url}"
        data-thumbnail="${singleRecipe.thumbnail}"
        data-reddit="${singleRecipe.id}"
        ><span class="glyphicon glyphicon-heart" aria-hidden="true"></span></button>`);
        title.append(favoriteBtn);
        row.append(image);
        row.append(title);
        $grid.append(row).masonry('reloadItems').masonry("layout");
    });

    $grid.imagesLoaded().progress(function () {
        $grid.masonry('layout');
    });

};
//Adds recipe to favorite DB then removes it from page
let addToFavorites = (event) => {
    let id = $(event.currentTarget).data("reddit");
    $.post("/favorite", {
        title: $(event.currentTarget).data("title"),
        url: $(event.currentTarget).data("url"),
        thumbnail: $(event.currentTarget).data("thumbnail"),
        redditID: id
    });
    $(`#${id}`).remove();
    $grid.imagesLoaded().progress(function () {
        $grid.masonry('layout');
    });
};

let updateModal = (event) => {
    event.preventDefault();
    let currentGif = $(event.currentTarget).data("url");
    console.log(currentGif[currentGif.length - 1]);
    if (currentGif[currentGif.length - 1] == "v") {
        currentGif = currentGif.slice(0, currentGif.length - 1)
    }
    $('#imagepreview').attr('src', currentGif);
    $('#imagemodal').modal('show')
}
//Click handlers
$(".foodItems").on("click", ".favBtn", addToFavorites);
$(".scrapeBtn").on("click", () => {
    obtainFood();
});

// $("body").on("click", )

$("body").on("click", ".pop", updateModal);

// $(document).on('click', '[data-toggle="lightbox"]', function(event) {
//     event.preventDefault();
//     $(this).ekkoLightbox();
// });


// });