class AccountBook {
  // クラスが持っているプロパティ、かつ、クラスの中のみアクセスできる
  private static instance: AccountBook;

  // クラスの中のみアクセスできる
  private constructor(readonly name: string) {}

  // クラスが持っているメソッド
  static get() {
    if (this.instance) {
      return this.instance;
    }

    this.instance = new AccountBook("Grow great");
    return this.instance;
  }
}

// ’AccountBook’のコンストラクタはプライベートであり、クラス宣言内でのみアクセス可能です
// const wrong = new AccountBook();

const b1 = AccountBook.get();
const b2 = AccountBook.get();

console.log(b1);
console.log(b1 === b2);
