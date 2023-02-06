hljs.highlightAll();
$( document ).ready(function() {
    if (Cookies.get('userAdded') === undefined) {
        find_user();
    }else {
        $('#gists-modal').modal('hide');
        $('#modal-username').hide();
        list_gihub_user(Cookies.get('userAdded'));

    }
    $( "#findUser" ).click(function() {
        var username = $("#usernameInput").val();
        if ( username!== '') {
            $('#gists-modal').modal('hide');
            list_gihub_user(username);
        }else {
            $('.error-message').html('Username can not be empty');
        }
    });
    $( "#findAnotherUser" ).click(function() {
        Cookies.remove('userAdded');
        location.reload();
    });

    $("#usernameInput").keyup(function(event) {
        if (event.keyCode === 13) {
            $("#findUser").click();
        }
    });
});

function list_gihub_user(user) {
   var apiGit = `https://api.github.com/users/${user}`
    $.ajax({
        method: 'GET',
        url: apiGit,
        // data: {
        //     auth: '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',
        // },
        success: function(data) {
            Cookies.set('userAdded', user);
            //Validate avatar
            if (data.avatar_url !== "") {
                $("#user_img").attr("src",data.avatar_url);
            }else {
                $("#user_img").attr("src",'img/no_img.jpeg');
            }

            $("#user_login").html(data.login);
            $("#user_location").html(data.location);

            //Validate ABOUT section
            if (data.email !== null ) {
                append_about_user_info('Email: '+ data.email);
            }else if (data.blog !== "" ) {
                append_about_user_info('Blog: '+ data.blog);
            }else if (data.company !== "" ) {
                append_about_user_info('Company: '+ data.company);
            }else {
                $(".abount-content").html('This user has not displayed more information.');
            }

            //Validate BIO section
            if (data.bio !== null ) {
                append_bio_user_info(data.bio);
            }else{
                $("#bio-box").hide();
            }

            //Nr of repo/gists/follw section
            $("#public_repos").html(data.public_repos);
            $("#public_gists").html(data.public_gists);
            $("#user_followers").html(data.followers);
            $("#user_following").html(data.following);

            $( "#public_repos" ).click(function() {
                redirect_git_user(data.public_repos,`https://github.com/${user}?tab=repositories`);
            });

            $( "#public_gists" ).click(function() {
                redirect_git_user(data.public_gists,`https://gist.github.com/${user}`);
            });
            $( "#user_followers" ).click(function() {
                redirect_git_user(data.followers,`https://github.com/${user}?tab=followers`);
            });

            $( "#user_following" ).click(function() {
                redirect_git_user(data.following,`https://github.com/${user}?tab=following`);
            });
        },
        error: function (xhr, ajaxOptions, thrownError) {
            $('#gists-modal').modal('show');
            $('.modal-title').html('Error');
            if (xhr.status === 403) {
                $('#modal-content').html('your API fetching limit has been exceeded');
            }else {
                $('#modal-content').html('Wrong username/KEY');
            }
        }
    });
    $.ajax({
        method: 'GET',
        url: apiGit + '/gists',
        async: false,
        success: function(userGists) {
            var description;
            var created_gist;
            var language;
            var content;
            var fork_owner;

            if(userGists !== 'undefined' && userGists.length > 0) {
                userGists.forEach(gist => {
                    $.ajax({
                        type:'GET',
                        url:'https://api.github.com/gists/'+ gist.id,
                        async:false,
                        success:function(gists){
                            //Extragem descrierea
                            if (gists.description === '' || gists.description === null) {
                                description = 'Without description';
                            }else {
                                description = gists.description;
                            }
                            //Cand a fost creat gist ul
                            created_gist = gists.created_at;
                            var created_gist_splited = created_gist.split('T');

                            //Extragem continutul obiectului files -> content si language
                            $.each( gists.files, function( key, value ) {
                                language = value.language;
                                content =  value.content;
                            });
                            $("#listGists").append((
                                '<label for="trigger-'+ gist.id +'" class="list-group-item gist-lst-'+ gist.id +'">' +
                                ' <div class="badge bg-secondary">'+ language + '</div>' + ' ' + description  + '' +
                                ' <div class="date-of-creation">Created at: '+ created_gist_splited[0] + '</div>' +
                                ' <span class="octicon-fork"></span><div class="content text-right">Forks </div>' +
                                '<input id="trigger-'+ gist.id +'" class="hide-ck" type="checkbox">\n' +
                                '<div class="box code"><pre><code class="hljs-code">' + content  + '' +
                                '</code></pre></div>' +
                                '</label>'));
                        }
                    });
                    $.ajax({
                        type:'GET',
                        url:'https://api.github.com/gists/'+ gist.id +'/forks',
                        async:false,
                        success:function(forks){
                            var nr_of_forks = 0;
                            var avatar_url = '';
                            var owner_url = '';
                            if (forks.length > 0) {
                                forks.forEach(fork => {
                                    nr_of_forks++;
                                    fork_owner = fork.owner.login;
                                    avatar_url = fork.owner.avatar_url;
                                    owner_url = fork.html_url;

                                    $('.gist-lst-' + gist.id + '').append((
                                        '<div class="forks-counter text-right">' +
                                        '<div class="dropdown"><button class="badge bg-secondary cursor-pointer">' + nr_of_forks + ' </button> ' +
                                        '<div class="dropdown-content">' +
                                        '  </div>' +
                                        ' </div></div></div>'
                                    ));
                                });
                                forks.forEach(fork => {
                                    $('.gist-lst-'+ gist.id +'').find('.dropdown-content').append((
                                        ' <a href="' + fork.html_url + '">'+ fork.owner.login + '<span><img class="fork-owner-img" src="'+fork.owner.avatar_url+'"></span></a>'
                                    ));
                                });

                            }else {
                                $('.gist-lst-'+ gist.id +'').append((
                                    '<div class="forks-counter text-right">' +
                                    '<button class="badge bg-secondary cursor-default">'+ 0 + ' </button> ' +
                                    ' </div>'
                                ));
                            }
                        }
                    });
                });
            }

        },
    });
}


function find_user() {
    $('#gists-modal').modal('show');
    $('#modal-username').show();
    $('#modal-g-close').hide();
    $('.modal-title').html('Please enter your github username');
    $('.find-user-git').appendTo("#modal-content");
}

function redirect_git_user(nr_elem,url) {
    if (nr_elem > 0) {
        window.open(url, '_blank');
    }
}
function append_about_user_info (about) {
    if (about !== "" && about !== null) {
       return  $(".abount-content").append((
            '<span class="font-italic mb-0">' + about +
            '</span>'));
    }
}
function append_bio_user_info (bio) {
    if (bio !== "") {
       return  $(".bio").append((
            '<span class="font-italic mb-0">' + bio +
            '</span>'));
    }
}
