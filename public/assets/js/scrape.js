let count = 25; //reddit counter for URL scraping

$(".scrapeBtn").on("click", () => {
    obtainFood();
});

let appendFood = (data) => {
    data.forEach((singleRecipe) => {
        let row = $(`<div class="row itemRow" data-id="${singleRecipe.id}">`);
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
        $(".foodItems").append(`<hr>`);
    });
};

let obtainFood = () => {
    let lastIndex = $(".itemRow").length;
    if (lastIndex === 0) {
        $.get(`/api/0`, function (data) {
            appendFood(data);
        });
    } else {
        let lastID = $($(".itemRow")[lastIndex - 1]).data("id");
        let page = `count=${count}&after=${lastID}`; //reddit specific url
        $.get(`/api/${page}`, function (data) {
            appendFood(data);
        });
        count += 25;
    }
};

let addToFavorites = (event) => {
    $.post("/favorite", {
        title: $(event.currentTarget).data("title"),
        url: $(event.currentTarget).data("url"),
        thumbnail: $(event.currentTarget).data("thumbnail"),
        redditID: $(event.currentTarget).data("reddit")
    });
};

$(".foodItems").on("click", ".favBtn", addToFavorites);
