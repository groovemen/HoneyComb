/* global $ */
var url = 'https://web6-stefan-grooveman.c9users.io/Practice/final-project/blog/';
var comment_id = $('#comment-form > [name="id"]').val();

// SHOW articles (admin view)

function getArticles(search) {
    var paramSearch = (typeof search !== 'undefined') ? '?search=' + search : '';
    $.ajax({
        url: url + 'admin/articles' + paramSearch,
        success: function(response) {
            var articlesHtml = "";
            for (var i = 0; i < response.length; i++) {
                articlesHtml += '<div>' +
                    '<br/>';
                if (response[i].image) {
                    articlesHtml += '<div >' +
                        '<img src= ' + url + 'assets/img/uploads/' + response[i].image + ' class="e-mage img-responsive"  />' +
                        '</div>';
                }
                articlesHtml += '<div class="titlones">' + response[i].title + '</div>' +
                    '<div class="bodylos">' + response[i].content + '</div>' +
                    '<div>' +
                    '<button id="del" class="btn-danger" data-delete-id="' + response[i].id + '">Delete</button>' +
                    '<button id="edi" class="btn-info" data-edit-id="' + response[i].id + '">Edit</button>' +
                    '<br/>' +
                    '</div>' +
                    '</div>';

            }
            $('.articles-list').html(articlesHtml);
        }
    });
}

// SHOW article (user search-view)

function renderArticles(search) {
    var paramSearch = (typeof search !== 'undefined') ? '?search=' + search : '';
    $.ajax({
        url: url + 'admin/articles' + paramSearch,
        success: function(response) {
            var articlesHtml = "";
            for (var i = 0; i < response.length; i++) {
                articlesHtml += '<div>' +
                    '<br/>';
                if (response[i].image) {
                    articlesHtml += '<div >' +
                        '<img src= ' + url + 'assets/img/uploads/' + response[i].image + ' class="e-mage img-responsive"  />' +
                        '</div>';
                }
                articlesHtml += '<div class="titlones">' + response[i].title + '</div>' +
                    '<div class="bodylos">' + response[i].content + '</div>' +
                    '</div>';

            }
            $('.search-list').html(articlesHtml);
        }
    });
}

// SAVE article

function saveArticle() {
    var dataForm = $('#article-form').serialize();
    var paramSearchID = ($('[name="id"]').val() !== '') ? '/update' : '/add';
    $.ajax({
        url: url + 'admin/article' + paramSearchID,
        method: 'POST',
        data: dataForm,
        success: function(response) {
            if (response.result == 1) {
                $('.article-form').hide();
                getArticles();
            }
        }
    });
}

$(function() {

    getComments(comment_id);
    getArticles();
    renderArticles();

    // DELETE article

    $('.articles-list').on('click', '[data-delete-id]', function() {
        var id = $(this).data('delete-id');
        $.ajax({
            url: url + 'admin/articles/delete',
            method: 'DELETE',
            data: {
                'id': id
            },
            success: function(response) {
                if (response.deleted == 1) {
                    getArticles();
                }
                else {
                    alert("HAHA");
                }
            }
        });
    });

    // EDIT article

    $('.articles-list').on('click', '[data-edit-id]', function() {
        var id = $(this).data('edit-id');
        $.ajax({
            url: url + 'admin/article?id=' + id,
            method: 'GET',
            success: function(response) {
                // for(var index in response) {
                //     //console.log("value = ", response[index]);    
                // }  
                $('[name="id"]').val(response.id);
                $('[name="title"]').val(response.title);
                $('[name="content"]').val(response.content);
                $('.article-form').show();
            }
        });
    });

    // UPDATE article

    $('#article-submit').on('click', function() {
        var dataForm = $('#article-form').serialize();
        $.ajax({
            url: url + 'admin/articles/update',
            method: 'POST',
            data: dataForm,
            success: function(response) {
                if (response.result) {
                    $('.article-form').hide();
                    getArticles();
                }
                // else {else {
                //     alert("Panica!");
                // }
            }
        });
    });

    // ADD article

    $('#add-btn').on('click', function() {
        $('[name="title"]').val("");
        $('[name="content"]').val("");

        $('.article-form').show();

        $('#article-submit').on('click', function() {
            saveArticle();
        });
    });

    $('#article-submit').on('click', function() {
        var inputData = $('#article-form').serialize();

        var formData = new FormData($('#article-form')[0]);
        var file = $('[name=file]')[0].files[0];

        console.log("FORM DATA = ", formData);
        console.log("FORM DATA FILE = ", formData.get('file'));

        console.log(file);
        console.log(inputData + '&image=' + file.name);
        $.ajax({
            url: url + 'admin/article/add',
            data: inputData + '&image=' + file.name,
            method: "POST",
            success: function(response) {
                if (response.result == 1) {
                    $('.article-form').hide();
                    getArticles();
                }
                else {
                    alert("You failed ! hah");
                }
            }
        });

        $.ajax({
            url: url + 'admin/article/upload',
            type: 'POST',
            data: formData,
            processData: false, //always set this to false for upload
            contentType: false, //alwsays set this to false for upload
        });
    });
});

//SEARCH article

$('[name = search]').on('keyup', function() {
    var self = this;

    setTimeout(function() {
        var search = $(self).val();
        renderArticles(search);
    }, 500);
});

$('[name = adminsearch]').on('keyup', function() {
    var self = this;

    setTimeout(function() {
        var search = $(self).val();
        getArticles(search);
        console.log(getArticles(search), search);
    }, 500);
});

$('.disabled a').on('click', function(e) {
    e.preventDefault();
});

// ADD comment

$('#submit-comment').on('click', function() {
    var id = $('[name="id"]').val();
    var form_reset = $('#comment-form');
    var dataForm = form_reset.serialize();
    $.ajax({
        url: url + 'article/addComment',
        method: 'POST',
        data: dataForm,
        success: function(response) {
            if (response.result == 1) {
                getComments(id);
                formReset(form_reset);
            }
        }
    });
});

// LEAVE a message (contact)

$('#msg-form').bootstrapValidator();

$('#send-msg').on('click', function(e) {
    e.preventDefault();

    var dataForm = $('#msg-form').serialize();
    $.ajax({
        url: url + 'contact',
        method: 'POST',
        data: dataForm + "&submit",
        success: function(response) {
            alert("Mesajul a fost trimis cu succes!");
            $('#contactModal').modal('toggle');
            return false;
        }
    });

});

// SHOW Comments

function getComments(article_id) {
    $.ajax({
        url: url + 'article/comments?id=' + article_id,
        success: function(response) {
            console.log(response);
            var comments = "";
            for (var i = 0; i < response.length; i++) {
                comments += '<div class="row comm-box-list">' +
                    '<div class="col-md-2 titluu ">' + response[i].name + '</div>' +
                    '<div class="col-md-10 penel">' + response[i].comment + '</div>' +
                    '</div>' +
                    '<br/>' +
                    '<br/>';
            }
            $(".comments-list").html(comments);


        }
    });
}

$('[data-id]').on('click', function() {
    var id = $(this).data('id');
    window.location.href = url + 'article?id=' + id;
    // getComments(id);
});

function formReset(form) {
    $(form)[0].reset();
}

// INcrese / DEcrese

(function() {
    var input = $("#quantity");
    var fieldValue = (input.attr('value') !== undefined) ? input.attr('value') : 0;

    console.log(fieldValue);

    $(".plus").on('click', function() {
        input.attr('value', fieldValue++);
    });
    $(".minus").on('click', function() {
        input.attr('value', fieldValue--);
    });
})();

// CONTACT Modal

$("#contactt").click(function() {
    $('#contactModal').modal('show');
});
$("#myBtn").click(function() {
    $("#myModal").modal();
});