// Masonry Grid Initialization
$('.grid').masonry({
    itemSelector: '.grid-item',
    columnWidth: 200,
});

// Grabs Notes from Notes DB
let getNotes = (event) => {
    let currentNote = $(event.currentTarget).data("id");
    $.get(`/notes/${currentNote}`, function (data) {
        appendNotes(data);
    });
    $("#noteModal").modal('show');
};
// Route to add a single note to DB & also appends the note onto the screen
let addNotes = (event) => {
    let note = $(".noteInput").val();
    let gifID = $(event.currentTarget).data("id");
    $.post(`/notes/${gifID}`, {
        note: note
    }, (result) => {
        let row = $(`<div id="${result.notes[result.notes.length-1]}" class="row"></div>`);
        let noteLine = $(`<p class="col-lg-10">${note}</p>`);
        let deleteLine = $(`<button data-id="${result.notes[result.notes.length-1]}" class="btn btn-primary col-lg-2 pull-right deleteLine">X</button>`);
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
    $(".noteBox").append(`<button class="btn btn-info addNoteBtn" data-id="${data._id}">Add Note</button>`);
    data.notes.forEach((singleNote) => {
        let row = $(`<div id="${singleNote._id}" class="row"></div>`);
        let noteLine = $(`<p class="col-lg-10">${singleNote.note}</p>`);
        let deleteLine = $(`<button data-id="${singleNote._id}" class="btn btn-primary col-lg-2 pull-right deleteLine">X</button>`);
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
//Deletes favorite Gif from DB then removes it from the screen
let deleteFavorite = (event) => {
    let favoriteID = $(event.currentTarget).data("id");
    $.ajax({
        url: `/favorite/${favoriteID}`,
        type: 'DELETE'
    });
    $(`#${favoriteID}`).remove();

    // Masonry reloads grids since images are being removed
    $('.grid').imagesLoaded().progress(function () {
        $('.grid').masonry('layout');
    });
};

// Event Delegation
$(".favItems").on("click", ".noteBtn", getNotes);
$(".favItems").on("click", ".deleteFav", deleteFavorite);
$(".noteBox").on("click", ".addNoteBtn", addNotes);
$("body").on("click", ".deleteLine", deleteNote);

// Updates background image on favorite
$("body").css('background-image', 'url(../assets/css/images/general.jpg)');