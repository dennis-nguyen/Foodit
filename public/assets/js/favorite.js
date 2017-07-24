//Grabs Recipes from Favorite DB
let getFavorites = () => {
    $.get(`/favorite/api`, function (data) {
        appendFavorites(data);
    });
};
//Appends Favorite Recipes to screen
let appendFavorites = (data) => {
    data.forEach((singleRecipe) => {
        let row = $(`<div class="row itemRow" id="${singleRecipe._id}" style="border-bottom: 1px solid black; padding-top: 15px">`);
        let image = $(`<div class="col-md-2"><a href=${singleRecipe.url} target="_blank"><img class="img-responsive" src="${singleRecipe.thumbnail}" width="100" height="80"></a></div>`);
        let title = $(`<div class="col-md-10"><h3 class="text-primary" style="margin-top: 0;">${singleRecipe.title}</h3></div>`);
        let noteBtn = $(`<button class="btn btn-primary noteBtn" 
                            data-title="${singleRecipe.title}" 
                            data-url="${singleRecipe.url}"
                            data-thumbnail="${singleRecipe.thumbnail}"
                            data-id="${singleRecipe._id}">Add a Note</button>`);
        let deleteBtn = $(`<button class="btn btn-danger deleteFav" data-id="${singleRecipe._id}">Remove from Favorites</button>`);
        title.append(noteBtn);
        title.append(deleteBtn);
        row.append(image);
        row.append(title);
        $(".favItems").append(row);
    });
};
//Grabs Notes from Notes DB
let getNotes = (event) => {
    let currentNote = $(event.currentTarget).data("id");
    $.get(`/notes/${currentNote}`, function (data) {
        appendNotes(data);
    });
    $("#noteModal").modal('show');
};
//Route to add a single note to DB & also appends the note onto the screen
let addNotes = (event) => {
    let note = $(".noteInput").val();
    let recipeID = $(event.currentTarget).data("id");
    console.log(recipeID);
    $.post(`/notes/${recipeID}`, {
        note: note
    }, (result) => {
        let row = $(`<div id="${result.notes[result.notes.length-1]}" class="row"></div>`);
        let noteLine = $(`<p class="col-lg-8">${note}</p>`);
        let deleteLine = $(`<button data-id="${result.notes[result.notes.length-1]}" class="btn btn-danger col-lg-2 pull-right deleteLine">X</button>`);
        noteLine.append(deleteLine);
        row.append(noteLine);
        $(".notes-body").append(row);
        $(".noteInput").val("");
    });

};
//Appends notes to modal
let appendNotes = (data) => {
    $(".notes-body").empty();
    $(".addNoteBtn").remove();
    $(".notes-title").html(`<h3>${data.title} Notes</h3>`);
    $(".noteBox").append(`<button class="btn btn-primary addNoteBtn" data-id="${data._id}">Add Note</button>`);
    data.notes.forEach((singleNote) => {
        let row = $(`<div id="${singleNote._id}" class="row"></div>`);
        let noteLine = $(`<p class="col-lg-8">${singleNote.note}</p>`);
        let deleteLine = $(`<button data-id="${singleNote._id}" class="btn btn-danger col-lg-2 pull-right deleteLine">X</button>`);
        noteLine.append(deleteLine);
        row.append(noteLine);
        $(".notes-body").append(row);
    });
};
//Deletes note from DB then removes it from the modal
let deleteNote = (event) => {
    let noteID = $(event.currentTarget).data("id");
    $.ajax({
        url: `/note/${noteID}`,
        type: 'DELETE'
    });
    $(`#${noteID}`).remove();

};
//Deletes favorite recipe from DB then removes it from the screen
let deleteFavorite = (event) => {
    let favoriteID = $(event.currentTarget).data("id");
    $.ajax({
        url: `/favorite/${favoriteID}`,
        type: 'DELETE'
    });
    $(`#${favoriteID}`).remove();
};
//Event Delegation
$(".favItems").on("click", ".noteBtn", getNotes);
$(".favItems").on("click", ".deleteFav", deleteFavorite);
$(".noteBox").on("click", ".addNoteBtn", addNotes);
$("body").on("click", ".deleteLine", deleteNote);

getFavorites();
