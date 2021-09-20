let title = 'Nestjs live feed';
var posts = [];
let socket = null;
let token;
const htmlPosts = document.querySelector('#postList');

function parseJwt(token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join(''),
  );

  return JSON.parse(jsonPayload);
}
function receivedPosts(postsReceivec) {
  posts.push(postsReceivec);
}
function insertIntoHTML(postsReceived) {
  htmlPosts.insertAdjacentHTML(
    'afterbegin',
    `<li>
    ${postsReceived.title}:  ${postsReceived.body}
  </li>`,
  );
}

async function created() {
  console.log('in created ');
  const email = prompt('Please enter your email', 'email');
  const password = prompt('Please enter your password', 'password');
  const loginRes = await fetch(`http://localhost:3000/users/login`, {
    method: 'post',
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify({ email: email, password: password }),
  });
  let data = await loginRes.json();
  console.log(data);
  token = data['access_token'] ? data['access_token'] : '123';
  let payload = parseJwt(token);
  ({ id, firstName } = payload);
  console.log(firstName);
  socket = io('http://localhost:3000');
  socket.emit('userId', id);

  const res = await fetch(`http://localhost:3000/users/feed`, {
    method: 'get',
    headers: new Headers({
      Authorization: 'Bearer ' + token,
    }),
  });
  const jsonData = await res.json();
  ({ message, data } = jsonData);
  data.forEach((post) => {
    insertIntoHTML(post);
  });
  console.log(data);

  console.log('socket created');
  socket.on('post', (post) => {
    console.log('received: ', post);
    receivedPosts(post);
  });
}
created();
