let count = 25; //reddit counter for URL scraping
//Get call to obtain scraped data
let obtainFood = () => {
    let lastIndex = $(".itemRow").length;
    //If first scrape
    if (lastIndex === 0) {
        $.get(`/api/0`, function (data) {
            appendFood(data);
        });
    } else {
        //Not first scrape, modifies get call to obtain next reddit page
        let lastID = $($(".itemRow")[lastIndex - 1]).data("id");
        let page = `count=${count}&after=${lastID}`; //reddit specific url
        $.get(`/api/${page}`, function (data) {
            appendFood(data);
        });
        count += 25;
    }
};
//Appends scraped data onto screen
let appendFood = (data) => {
    data.forEach((singleRecipe) => {
        let row = $(`<div class="row itemRow" id="${singleRecipe.id}" data-id="${singleRecipe.id}" style="border-bottom: 1px solid black; padding-top: 15px">`);
        let image = $(`<div class="col-md-2"><a href=${singleRecipe.url} target="_blank"><img class="img-responsive" src="${singleRecipe.thumbnail}" width="100" height="80"></a></div>`);
        let title = $(`<div class="col-md-10"><h3 class="text-primary" style="margin-top: 0;">${singleRecipe.title}</h3></div>`);
        let favoriteBtn = $(`<button class="btn btn-primary favBtn" 
        data-title="${singleRecipe.title}" 
        data-url="${singleRecipe.url}"
        data-thumbnail="${singleRecipe.thumbnail}"
        data-reddit="${singleRecipe.id}"
        >Add to Favorites</button>`);
        title.append(favoriteBtn);
        row.append(image);
        row.append(title);
        $(".foodItems").append(row);
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
};
//Click handlers
$(".foodItems").on("click", ".favBtn", addToFavorites);
$(".scrapeBtn").on("click", () => {
    obtainFood();
});