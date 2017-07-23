let getFavorites = () => {
    $.get(`/favorite/api`, function (data) {
        appendFavorites(data);
    });
};

let appendFavorites = (data) => {
    data.forEach((singleRecipe) => {
        let row = $(`<div class="row itemRow" data-id="${singleRecipe.id}">`);
        let image = $(`<div class="col-md-2"><a href=${singleRecipe.url} target="_blank"><img class="img-responsive" src="${singleRecipe.thumbnail}" width="100" height="80"></a></div>`);
        let title = $(`<div class="col-md-10"><h3 class="text-primary" style="margin-top: 0;">${singleRecipe.title}</h3></div>`);
        let noteBtn = $(`<button class="btn btn-primary noteBtn" 
                            data-title="${singleRecipe.title}" 
                            data-url="${singleRecipe.url}"
                            data-thumbnail="${singleRecipe.thumbnail}"
                            data-id="${singleRecipe._id}">Add a Note</button>`);
        let deleteBtn = $(`<button class="btn btn-danger deleteBtn" 
                            data-title="${singleRecipe.title}" 
                            data-url="${singleRecipe.url}"
                            data-thumbnail="${singleRecipe.thumbnail}">Remove from Favorites</button>`);
        title.append(noteBtn);
        title.append(deleteBtn);
        row.append(image);
        row.append(title);
        $(".favItems").append(row);
        $(".favItems").append(`<hr>`);
    });
};

let getNotes = (event) => {
    let currentNote = $(event.currentTarget).data("id");
    console.log(currentNote);
    $.get(`/notes/${currentNote}`, function (data) {
        appendNotes(data);
        // console.log(data);
    });
    $("#noteModal").modal('show');
};

let addNotes = (event) => {
    let note = $(".noteInput").val();
    let recipeID = $(event.currentTarget).data("id");
    $.post(`/notes/${recipeID}`, {
        note: note
    }, (result) => {
        console.log(result);
        let row = $(`<div id="${result.notes[result.notes.length-1]}" class="row"></div>`);
        let noteLine = $(`<p class="col-lg-8">${note}</p>`);
        let deleteLine = $(`<button data-id="${result.notes[result.notes.length-1]}" class="btn btn-danger col-lg-2 pull-right deleteLine">X</button>`);
        noteLine.append(deleteLine);
        row.append(noteLine);
        $(".notes-body").append(row);
        $(".noteInput").val("");
    });

};

let appendNotes = (data) => {
    $(".notes-body").empty();
    $(".notes-title").html(`<h3>${data.title} Notes</h3>`);
    $(".addNoteBtn").attr("data-id", data._id);
    data.notes.forEach((singleNote) => {
        let row = $(`<div id="${singleNote._id}" class="row"></div>`);
        let noteLine = $(`<p class="col-lg-8">${singleNote.note}</p>`);
        let deleteLine = $(`<button data-id="${singleNote._id}" class="btn btn-danger col-lg-2 pull-right deleteLine">X</button>`);
        noteLine.append(deleteLine);
        row.append(noteLine);
        $(".notes-body").append(row);
    });
};

let deleteNote = (event) => {
    let noteID = $(event.currentTarget).data("id");
    $.ajax({
        url: `/delete/${noteID}`,
        type: 'DELETE'
    });
    $(`#${noteID}`).remove();

};
getFavorites();
$(".favItems").on("click", ".noteBtn", getNotes);
$("body").on("click", ".addNoteBtn", addNotes);
$("body").on("click", ".deleteLine", deleteNote);
