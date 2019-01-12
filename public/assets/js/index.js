$("#scrape").on("click", function (event) {
    event.preventDefault();
    window.location = "/scrape";
});

$(".btn-note").on("click", function (event) {
    var id = $(this).attr("data-id");
    window.location = "/articles/" + id;
});

$("#home").on("click", function (event) {
    window.location = "/";
});

$("#addingNote").on("click", function (event) {
    event.preventDefault();
    var id = $(this).attr("data-id");
    var note = $("#addNote").val().trim();

    $.ajax({
        method: "POST",
        url: "/articles/" + id,
        data: {
            "summary": note
        }
    }).then(function (data) {
        console.log(data);
        window.location.reload();

    });

});

$(".btn-delete").on("click", function (event) {
    event.preventDefault();
    var id = $(this).attr("data-id");

    $.ajax({
        method: "DELETE",
        url: "/article/" + id,
        data: {
            "delete": id
        }
    }).then(function (data) {
        console.log(data);
    });

    window.location.reload();

})