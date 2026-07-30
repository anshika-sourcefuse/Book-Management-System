interface Author {
  name: string;
}
type Category =
  | "Fiction"
  | "History"
  | "Romance"
  | "Thriller"
  | "Autobiography"
  | "General";
interface Book {
  title: string;
  author: Author;
  isbn: string;
  publicationDate: string;
  genre: string;
  price: number;
}
function escapeHTML(text: string): string {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
function filterByKeyword<T>(items: T[], key: keyof T, keyword: string): T[] {
  return items.filter((item) =>
    String(item[key]).toLowerCase().includes(keyword.toLowerCase())
  );
}
function logAction(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
): PropertyDescriptor {
  const original = descriptor.value;
  descriptor.value = function (...args: any[]) {
    console.log(`[LOG] ${propertyKey} called with:`, args);
    const result = original.apply(this, args);
    console.log(`[LOG] ${propertyKey} finished`);
    return result;
  };
  return descriptor;
}
interface Ageable {
    getAge(): number;
}
interface Categorisable {
    getCategory(): string;
}
interface Discountable {
    getDiscountPrice(): number;
}
abstract class BaseBook implements Book, Ageable, Categorisable, Discountable {
  title: string;
  author: Author;
  isbn: string;
  publicationDate: string;
  genre: string;
  price: number;
  type: string;
  constructor(
    title: string,
    author: string,
    isbn: string,
    publicationDate: string,
    genre: string,
    price: number
  ) {
    this.title = title;
    this.author = { name: author };
    this.isbn = isbn;
    this.publicationDate = publicationDate;
    this.genre = genre;
    this.price = price;
    this.type = "";
  }
  getAge(): number {
    return Math.max(
      0,
      new Date().getFullYear() - new Date(this.publicationDate).getFullYear()
    );
  }
  getCategory(): Category {
    const genre = this.genre.toLowerCase();
    if (genre.includes("fiction")) return "Fiction";
    if (genre.includes("history")) return "History";
    if (genre.includes("romance")) return "Romance";
    if (genre.includes("thriller")) return "Thriller";
    if (genre.includes("autobiography")) return "Autobiography";
    return "General";
  }
  getDiscountPrice(): number {
    return this.price;}
}
class PrintedBook extends BaseBook {
  constructor(
    title: string,
    author: string,
    isbn: string,
    publicationDate: string,
    genre: string,
    price: number
  ) {
    super(title, author, isbn, publicationDate, genre, price);
    this.type = "Printed Book";
  }
  override getDiscountPrice(): number {
    return this.price * 0.9;
}
}
class EBook extends BaseBook {
  constructor(
    title: string,
    author: string,
    isbn: string,
    publicationDate: string,
    genre: string,
    price: number
  ) {
    super(title, author, isbn, publicationDate, genre, price);
    this.type = "E-Book";
  }
  override getDiscountPrice(): number {
    return this.price * 0.5;
  }
}
interface Validator {
  validate(
    title: string,
    author: string,
    isbn: string,
    publicationDate: string,
    genre: string,
    price: number
  ): boolean;
}
class BookValidator implements Validator {
  validate(
    title: string,
    author: string,
    isbn: string,
    publicationDate: string,
    genre: string,
    price: number
  ): boolean {
    if (
      title.trim() === "" ||
      author.trim() === "" ||
      isbn.trim() === "" ||
      publicationDate.trim() === "" ||
      genre.trim() === ""
    ) {
      alert("All fields are required.");
      return false;
    }
    if (isNaN(Number(isbn))) {
      alert("ISBN must be numeric.");
      return false;
    }
    if (isNaN(price) || price <= 0) {
      alert("Price must be a positive number.");
      return false;
    }
    return true;
  }
}
class BookManager<T extends BaseBook> {
  books: T[] = [];
  edit: number = -1;
  validator: Validator;
constructor(validator: Validator) {
    this.validator = validator;
    this.books = [];
    this.edit = -1;
}
  simulateServer(book: T): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const duplicate = this.books.some(
          (b, index) =>
            index !== this.edit && b.title.toLowerCase() === book.title.toLowerCase()
        );
        if (duplicate) {
          reject("Book with this title already exists.");
        } else {
          resolve();
        }
      }, 2000);
    });
  }
  display(): void {
    const list = document.getElementById("bookList") as HTMLElement;
    let output = "";
    this.books.forEach((book, index) => {
      output += `
        <li>
        <p><b>Title:</b> ${escapeHTML(book.title)}</p>
        <p><b>Author:</b> ${escapeHTML(book.author.name)}</p>
        <p><b>ISBN:</b> ${escapeHTML(book.isbn)}</p>
        <p><b>Publication Date:</b> ${escapeHTML(book.publicationDate)}</p>
        <p><b>Genre:</b> ${escapeHTML(book.genre)}</p>
        <p><b>Age:</b> ${book.getAge()} Years</p>
        <p><b>Category:</b> ${book.getCategory()}</p>
        <p><b>Type:</b> ${book.type}</p>
        <p><b>Price:</b> ${book.price}</p>
        <p><b>Discounted Price:</b> ${book.getDiscountPrice()}</p>
        <button data-action="edit" data-index="${index}">Edit</button>
        <button data-action="delete" data-index="${index}">Delete</button>
        </li>
      `;
    });
    list.innerHTML = output;
  }
  editBook(index: number): void {
    this.edit = index;
    (document.getElementById("title") as HTMLInputElement).value = this.books[index].title;
    (document.getElementById("author") as HTMLInputElement).value = this.books[index].author.name;
    (document.getElementById("isbn") as HTMLInputElement).value = this.books[index].isbn;
    (document.getElementById("price") as HTMLInputElement).value = String(this.books[index].price);
    (document.getElementById("publicationDate") as HTMLInputElement).value =
      this.books[index].publicationDate;
    (document.getElementById("genre") as HTMLSelectElement).value = this.books[index].genre;
    (document.getElementById("bookType") as HTMLSelectElement).value =
      this.books[index] instanceof EBook ? "ebook" : "printed";
  }
  @logAction
  deleteBook(index: number): void {
    this.books.splice(index, 1);
    this.edit = -1;
    (document.getElementById("bms") as HTMLFormElement).reset();
    this.display();
  }
  @logAction
  sortBooks(type: string): void {
    const key = (type === "date" ? "publicationDate" : type) as keyof T;
    for (let i = 0; i < this.books.length - 1; i++) {
      let min = i;
      for (let j = i + 1; j < this.books.length; j++) {
        const a = String(this.books[j][key]).toLowerCase();
        const b = String(this.books[min][key]).toLowerCase();
        if (a < b) {
          min = j;
        }
      }
      const temp = this.books[i];
      this.books[i] = this.books[min];
      this.books[min] = temp;
    }
    this.display();
  }
  async fetchBooks(): Promise<void> {
    try {
      const response = await fetch("https://openlibrary.org/search.json?q=javascript");
      if (!response.ok) {
        throw new Error("Unable to fetch books");
      }
      const data = await response.json();
      let output = "<h3>Fetched Books</h3>";
      data.docs.slice(0, 10).forEach((book: any) => {
        output += `
          <p>
            <b>Title:</b> ${escapeHTML(book.title)}<br>
            <b>Author:</b> ${escapeHTML(book.author_name ? book.author_name[0] : "Unknown")}
          </p>
          <hr>
        `;
      });
      (document.getElementById("result") as HTMLElement).innerHTML = output;
    } catch (error: any) {
      (document.getElementById("result") as HTMLElement).textContent = error.message;
    }
  }
  searchBook(keyword: string, callback: (result: T[]) => void): void {
    setTimeout(() => {
      const result = filterByKeyword(this.books, "title" as keyof T, keyword);
      callback(result);
    }, 1000);
  }
  @logAction
  addBook(book: T): void {
    if (this.edit === -1) {
      this.books.push(book);
    } else {
      this.books[this.edit] = book;
      this.edit = -1;
    }
  }
}
const validator = new BookValidator();
const manager = new BookManager<BaseBook>(validator);

(document.getElementById("bms") as HTMLFormElement).addEventListener("submit", function (e: Event) {
  e.preventDefault();
  const title = (document.getElementById("title") as HTMLInputElement).value;
  const author = (document.getElementById("author") as HTMLInputElement).value;
  const isbn = (document.getElementById("isbn") as HTMLInputElement).value;
  const price = (document.getElementById("price") as HTMLInputElement).value;
  const publicationDate = (document.getElementById("publicationDate") as HTMLInputElement).value;
  const genre = (document.getElementById("genre") as HTMLSelectElement).value;
  const bookType = (document.getElementById("bookType") as HTMLSelectElement).value;
 if (
  !manager.validator.validate(
    title,
    author,
    isbn,
    publicationDate,
    genre,
    Number(price)
  )
) {
  return;
}
const book: BaseBook =
  bookType === "ebook"
    ? new EBook(
        title,
        author,
        isbn,
        publicationDate,
        genre,
        Number(price)
      )
    : new PrintedBook(
        title,
        author,
        isbn,
        publicationDate,
        genre,
        Number(price)
      );
  manager
    .simulateServer(book)
    .then(() => {
      const isEdit = manager.edit !== -1;
      manager.addBook(book);
      alert(isEdit ? "Book Updated Successfully" : "Book Added Successfully");
      manager.display();
      (document.getElementById("bms") as HTMLFormElement).reset();
    })
    .catch((error) => {
      alert(error);
    });
});
document.getElementById("fetchBtn")!.addEventListener("click", () => manager.fetchBooks());
document.getElementById("bookList")!.addEventListener("click", function (e: Event) {
  const target = e.target as HTMLElement;
  const button = target.closest("button[data-action]") as HTMLElement | null;
  if (!button) return;
  const index = Number(button.dataset.index);
  const action = button.dataset.action;
  if (action === "edit") {
    manager.editBook(index);
  } else if (action === "delete") {
    manager.deleteBook(index);
  }
});
document.getElementById("searchBtn")!.addEventListener("click", () => {
  const keyword = (document.getElementById("searchBook") as HTMLInputElement).value;
  manager.searchBook(keyword, function (result) {
    const resultDiv = document.getElementById("result") as HTMLElement;
    if (result.length === 0) {
      resultDiv.innerHTML = "No Book Found";
    } else {
      let output = "";
      result.forEach((book) => {
        output += escapeHTML(book.title) + "<br>";
        output += escapeHTML(book.author.name) + "<br>";
        output += escapeHTML(book.isbn) + "<br>";
        output += escapeHTML(book.publicationDate) + "<br>";
        output += escapeHTML(book.genre) + "<br><br>";
      });
      resultDiv.innerHTML = output;
    }
  });
});
document.getElementById("sortBtn")!.addEventListener("click", function (e: Event) {
  e.preventDefault();
  const type = (document.getElementById("sortBooks") as HTMLSelectElement).value;
  if (type === "") {
    alert("Please select a sorting option.");
    return;
  }
  manager.sortBooks(type);
});
