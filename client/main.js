const app = new Vue({
  el: '#app',
  data: {
    title: 'Nestjs live feed',
    name: '',
    text: '',
    posts: [],
    socket: null,
  },
  methods: {
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
      // console.log('received2');
      this.posts.push(posts);
    },
    validateInput() {
      return this.name.length > 0 && this.text.length > 0;
    },
  },
  async created() {
    this.socket = io('http://localhost:3000');
    this.socket.emit('userId', '613f2e705a14f9ea30ed9abc');

    const res = await fetch('http://localhost:3000/users/feed', {
      method: 'get',
      headers: new Headers({
        Authorization:
          'Bearer ' +
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxM2YyZTcwNWExNGY5ZWEzMGVkOWFiYyIsImZpcnN0TmFtZSI6Im11aGFtbWFkIiwibGFzdE5hbWUiOiJiaWxhbDgiLCJlbWFpbCI6ImJpbGFsOEBnbWFpbC5jb20iLCJmb2xsb3dpbmciOlsiNjEzYzdkNTE1NmQ0YTBkZTI3MTJiMDJjIiwiNjEzZjBlZTk0YmM2YWI2OGYyNDEyNTI3Il0sImlhdCI6MTYzMTgwMjAxMX0.gZwD_QbUzy2cXecqznLO6VSzRTwOHwiWUr4e30wRLvY',
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
