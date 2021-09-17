const app = new Vue({
  el: '#app',
  data: {
    title: 'Nestjs live feed',
    name: '',
    text: '',
    posts: [],
    socket: null,
    //this is for taimoor@gmail.com - default token
    token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxNDM3NjAyMmI5ODA2NWJjZTAxN2YxYSIsImZpcnN0TmFtZSI6IlRhaW1vb3IiLCJsYXN0TmFtZSI6IkFuaXMiLCJlbWFpbCI6InRhaW1vb3JAZ21haWwuY29tIiwiaWF0IjoxNjMxODEzNDQyfQ.ceCwBGjI-AMBhR_k7WNWMf9K2tht1JUOEG1dozMULf4',
  },
  methods: {
    parseJwt(token) {
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
    },
    sendMessage() {
      if (this.validateInput()) {
        const message = {
          name: this.name,
          text: this.text,
        };
        this.socket.emit('post', message);
        this.text = '';
      }
    },
    receivedPosts(posts) {
      this.posts.push(posts);
    },
    validateInput() {
      return this.name.length > 0 && this.text.length > 0;
    },
  },
  async created() {
    const email = prompt('Please enter your email', 'email');
    const password = prompt('Please enter your password', 'password');
    const loginRes = await fetch('http://localhost:3000/users/login', {
      method: 'post',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({ email: email, password: password }),
    });
    let data = await loginRes.json();
    console.log(data);
    this.token = data['access_token'] ? data['access_token'] : '123';
    let payload = this.parseJwt(this.token);
    ({ id, firstName } = payload);
    console.log(firstName);
    this.socket = io('http://localhost:3000');
    this.socket.emit('userId', id);

    const res = await fetch('http://localhost:3000/users/feed', {
      method: 'get',
      headers: new Headers({
        Authorization: 'Bearer ' + this.token,
      }),
    });
    const jsonData = await res.json();
    ({ message, data } = jsonData);
    data.forEach((post) => {
      this.receivedPosts(post);
    });
    console.log(data);

    console.log('socket created');
    this.socket.on('post', (post) => {
      console.log('received: ', post);
      this.receivedPosts(post);
    });
  },
});
