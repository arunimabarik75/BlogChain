const firebaseConfig = {
    apiKey: "AIzaSyCAGShsjhZgdSBioiotouhFxz3zmk_ZtuY",
    authDomain: "oncemore-dfee1.firebaseapp.com",
    projectId: "oncemore-dfee1",
    storageBucket: "oncemore-dfee1.appspot.com",
    messagingSenderId: "983121699570",
    appId: "1:983121699570:web:b18e54b88d634d5d22666b"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth()
const database = firebase.database()
// var user;

function register() {
    email = document.getElementById('email').value
    password = document.getElementById('pass').value
    uname = document.getElementById('name').value

    if (validatePassword == false) {
        alert("Too small password")
        return
    }
    if (isEmpty(email) || isEmpty(password) || isEmpty(uname)) {
        alert('All fields are mandatory')
        // if (isEmpty()) {
        //     alert('its email')
        // }
        return
    }
    auth.createUserWithEmailAndPassword(email, password)
        .then(function () {
            user = auth.currentUser
            var blog = { "Ignore this": "hello" }
            //adding user to firebase database
            var database_ref = database.ref()
            var user_data = {
                email: email,
                name: uname,
                blogs: blog,
                count: 0
            }
            console.log(user_data)
            database_ref.child('users/' + user.uid).set(user_data)
            // alert('user created')
            setTimeout(nextPage, 3000);
            // alert(user.uid)
            // alert(user.email)
            // alert(uname)
            // console.log(user_data)
        })
        .catch(function (error) {
            // var error_code = error.code  
            var error_message = error.message

            alert(error_message)
        })
}
function nextPage() {
    window.location.href = "options.html";
}
function validatePassword() {
    if (password.length < 6) {
        return false;
    }
    return true;
}

function isEmpty(field) {
    if (field == null || field.length == 0) {
        return true
    }
    return false
}

// function SelectData() {
//     var database_ref = database.ref()

//     get(child(database_ref, "users/" + user.uid)).then((snapshot) => {
//         if (snapshot.exists()) {
//             alert(snapshot.getChildrenCount());
//             // secn.value = snapshot.val().Section;
//         }
//         else {
//             alert("No data found");
//         }
//     }).catch((error) => {
//         alert("Some error ocurred");
//     })
// }

function save() {
    // var database_ref = database.ref()
    var user = auth.currentUser
    // alert(user.uid)
    var user_ref = database.ref('users/' + user.uid)
    var blogs_ref = database.ref('blogs/')
    var title = document.getElementById('blogt').value
    var content = document.getElementById('blogc').value
    const curr_time = Date.now()
    const blog = [title, content, curr_time]
    user_ref.once('value', function (snapshot) {
        var gotdata = snapshot.val()
        const blogobj = gotdata.blogs
        var blogcount = gotdata.count + 1
        blogobj[blogcount] = blog
        // console.log(gotdata)
        user_ref.update({
            blogs: blogobj,
            email: gotdata.email,
            name: gotdata.name,
            count: blogcount
        })
        const blog_data = {
            title: title,
            content: content,
            likes: 0,
            author: user.uid,
            author_name: gotdata.name
        }

        blogs_ref.child(`${curr_time}/`).set(blog_data).then(function () {
            window.location.href = "options.html";
        })

        // blogs_ref.child(`${curr_time}/`).set(blog_data)

        // alert('JS bad')
        // alert('very BAD')
        // alert('BUT blog added')
        // return
    })

    // alert(name)
    // alert(email)
    // alert('hurray')
}

function signIn() {
    email = document.getElementById('email').value
    password = document.getElementById('pass').value
    auth.signInWithEmailAndPassword(email, password)
        .then(function () {

            setTimeout(nextPage, 3000);
        })
        .catch(function (error) {
            // var error_code = error.code  
            var error_message = error.message

            alert(error_message)
        })
}

function signOut() {
    firebase.auth().signOut().then(() => {

        setTimeout(function () {
            window.location.href = "index.html";
        }, 2000)
        // Sign-out successful.
    }).catch((error) => {
        alert(error)
    });
}

function allBlogs() {
    var blogRef = database.ref('blogs/')

    blogRef.once('value', function (snapshot) {
        var gotdata = snapshot.val()
        // console.log(gotdata)
        // const blogs = gotdata.blogs

        var strtr = ''
        for (const property in gotdata) {
            //console.log(`${property}: ${object[property]}`);
            var temp=JSON.stringify(gotdata[property]).split(',');
            var author=temp[1];
            var content=temp[2];
            var title=temp[4].split(':')[1];

            strtr += `Author: ${author.split(':')[1]} <br> Title: ${title.substring(0,title.length-1)}<br> Content: ${content.split(':')[1]}<br> _____________________________________________________________<br><br>`
        }

        document.getElementById('all-blog').innerHTML=strtr;
    })
}

function personalBlogs() {
    var user = auth.currentUser
    // alert(user)
    // alert(user.uid)
    var user_ref = database.ref('users/' + user.uid)
    var blogs_ref = database.ref('blogs/')

    // var blogs;
    user_ref.once('value', function (snapshot) {
        var gotdata = snapshot.val()
        const blogs = gotdata.blogs

        var strtr = ''
        for (const property in blogs) {
            //console.log(`${property}: ${object[property]}`);
            var temp=JSON.stringify(blogs[property]).split(',');
            var one=temp[0].substring(1,temp[0].length);
            // var two=temp[1].substring(1,temp[1].length-1);
            var two=temp[1];
            // var two="hello";
            strtr += `Title: ${one}<br> Content: ${two}<br> _____________________________________________________________<br><br>`
        }

        document.getElementById('personal-blog').innerHTML=strtr;
        // console.log(strtr)
        // console.log(blogs)
        // localStorage.setItem("myValue", gotdata.blogs[0]);
    }).then(
        function () {

            // window.location.href = "blogs.html";
            // window.location.replace("blogs.html");
        })
    // console.log(blogs)
}

function newPage(blogs) {
    window.location.replace("blogs.html");
    setTimeout(function () {
        // window.location.href = "index.html";
        // console.log(blogs)
        alert(blogs)
    }, 2000)

}

function back() {
    window.location.replace("options.html");
}