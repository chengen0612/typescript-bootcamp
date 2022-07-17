class Blog {
  constructor(private posts: string[]) {}

  get lastPost() {
    const lastPost = this.posts[this.posts.length - 1];

    if (!lastPost) {
      throw new Error("Add a post before getting it.");
    }
    return lastPost;
  }

  set lastPost(post: string) {
    if (post.length === 0) {
      throw new Error("Please enter correct post name.");
    }
    this.posts.push(post);
  }
}

const b = new Blog(["p1"]);

b.lastPost = "p2";
console.log(b.lastPost);
