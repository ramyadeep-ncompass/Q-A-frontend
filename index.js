const url = 'http://localhost:3000/api/';
var delete_id = null;

async function getAllPosts() {
    console.log('getAllPosts() called');
    const userEmail = sessionStorage.getItem('userEmail');
    document.getElementById('curr-user').innerText = userEmail ? userEmail : 'GUEST';

    const route = url + 'questions';
    let response = await fetch(route);
    let records = await response.json();
    for (let i = 0; i < records.data.length; i++) {
        const post = records.data[i];
        const questionTable = document.getElementById('table');
        const row = questionTable.insertRow();
        row.innerHTML = `<tr class="data-row">
                <td>${post.post_id}</td>
                <td>${post.title}</td>
                <td>${post.description}</td>
                <td>${post.tags ? post.tags : '--'}</td>
                <td>${post.author}</td>
                <td>${post.created_at}</td>
                <td><button class="btn bg-red"  onclick=deletePost(${post.post_id})>DELETE</button><button class="btn bg-yellow" onclick=openForm(${post.post_id})>UPDATE</button></td>
                </tr>`;
    }
}


async function deletePost(post_id) {

    if (window.confirm('Are you sure to delete this post?')) {
        console.log('deletePost() called');
        const route = url + 'delete'
        const response = await fetch(route, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + getUserToken(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                post_id
            })
        });

        const result = await response.json();
        window.alert(result.message);
        console.log(result);
        if (result.success)
            location.reload();
    }
}

async function createPost(params) {
    console.log('createPost() called');
    console.log(params);
    const route = url + 'new-post'
    const response = await fetch(route, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + getUserToken(),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: params.title,
            description: params.description,
            tags: params.tags, //TODO: make tags optional
        })
    });
    const result = await response.json();
    window.alert(result.message);
    console.log(result);
    if (result.success)
        location.reload();
}

async function updatePost(params) {
    console.log('UpdatePost() called');
    console.log(params);
    const route = url + 'update'
    console.log(JSON.stringify({
        post_id: delete_id,
        title: params.title,
        description: params.description,
        tags: params.tags,
    }));
    const response = await fetch(route, {
        method: 'PATCH',
        headers: {
            'Authorization': 'Bearer ' + getUserToken(),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            post_id: delete_id,
            title: params.title,
            description: params.description,
            tags: params.tags, //TODO: make tags optional
        })
    });
    const result = await response.json();
    window.alert(result.message);

    console.log(result.message);
    delete_id = null;
    if (result.success)
        location.reload();

}


const form = document.getElementById('my-form');
const updateForm = document.getElementById('update-form');

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const title = form.elements['title'].value;
    const description = form.elements['description'].value;
    const tags = form.elements['tags'].value;
    createPost({ title, description, tags })
});

updateForm.addEventListener('submit', (event) => {
    event.preventDefault();
    console.log('update event listener');
    const title = updateForm.elements['title'].value;
    const description = updateForm.elements['description'].value;
    const tags = updateForm.elements['tags'].value;
    updatePost({ title, description, tags });
});


function openForm(id) {
    let post_id, title, description, tags;
    const popUp = document.getElementById("myForm");
    popUp.style.display = "block";
    const questionTable = document.getElementById('table');
    for (let i = 1; i < questionTable.rows.length; i++) {
        row = questionTable.rows[i].cells;
        post_id = row[0].innerText;

        if (id == post_id) {
            delete_id = post_id;
            console.log(post_id);
            title = row[1].innerText;
            description = row[2].innerText;
            tags = row[3].innerText;

            updateForm.elements['title'].value = title;
            updateForm.elements['description'].value = description;
            updateForm.elements['tags'].value = tags;
            break;
        }
    }


}

function getUserToken() {
    return sessionStorage.getItem('userToken');
}

function closeForm() {
    document.getElementById("myForm").style.display = "none";
}


getAllPosts();