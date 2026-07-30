class BaseBook {
  constructor(title, author, isbn, publicationDate, genre, price) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
    this.publicationDate = publicationDate;
    this.genre = genre;
    this.price = price;
  }
  getAge() {
    return Math.max(0, new Date().getFullYear() - new Date(this.publicationDate).getFullYear());
  }
  getCategory() {
    const genre = this.genre.toLowerCase();

    if (genre.includes("fiction")) return "Fiction";
    if (genre.includes("history")) return "History";
    if (genre.includes("romance")) return "Romance";
    if (genre.includes("thriller")) return "Thriller";
    if (genre.includes("autobiography")) return "Autobiography";
    return "General";
  }
}
class PrintedBook extends BaseBook {
  constructor(title, author, isbn, publicationDate, genre, price) {
    super(title, author, isbn, publicationDate, genre, price);
    this.type = "Printed Book";
  }
  getDiscountPrice(price) {
    return price * 0.9;
  }
}
class EBook extends BaseBook {
  constructor(title, author, isbn, publicationDate, genre, price) {
    super(title, author, isbn, publicationDate, genre, price);
    this.type = "E-Book";
  }
  getDiscountPrice(price) {
    return price * 0.5;
  }
}
class BookManager {
  constructor() {
    this.books = [];
    this.edit = -1;
  }
  simulateServer(book) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const duplicate = this.books.some(
          (b, index) =>
            index !== this.edit &&
            b.title.toLowerCase() === book.title.toLowerCase()
        );
        if (duplicate) {
          reject("Book with this title already exists.");
        } else {
          resolve("Book Added Successfully");
        }
      }, 2000);
    });
  }
  display() {
    const list = document.getElementById("bookList");
    let output = "";
    this.books.forEach((book, index) => {
      output += `
        <li>
        <p><b>Title:</b> ${escapeHTML(book.title)}</p>
        <p><b>Author:</b> ${escapeHTML(book.author)}</p>
        <p><b>ISBN:</b> ${escapeHTML(book.isbn)}</p>
        <p><b>Publication Date:</b> ${escapeHTML(book.publicationDate)}</p>
        <p><b>Genre:</b> ${escapeHTML(book.genre)}</p>
        <p><b>Age:</b> ${book.getAge()} Years</p>
        <p><b>Category:</b> ${book.getCategory()}</p>
        <p><b>Type:</b> ${book.type}</p>
        <p><b>Price:</b> ${book.price}</p>
        <p><b>Discounted Price:</b> ${book.getDiscountPrice(book.price)}</p>

        <button data-action="edit" data-index="${index}">Edit</button>
        <button data-action="delete" data-index="${index}">Delete</button>
        </li>
      `;
    });
    list.innerHTML = output;
  }
  editBook(index) {
    this.edit = index;
    document.getElementById("title").value = this.books[index].title;
    document.getElementById("author").value = this.books[index].author;
    document.getElementById("isbn").value = this.books[index].isbn;
    document.getElementById("price").value = this.books[index].price;
    document.getElementById("publicationDate").value =
      this.books[index].publicationDate;
    document.getElementById("genre").value = this.books[index].genre;
    document.getElementById("bookType").value =
      this.books[index] instanceof EBook ? "ebook" : "printed";
  }
  deleteBook(index) {
    this.books.splice(index, 1);
    this.edit = -1;
    document.getElementById("bms").reset();
    this.display();
  }
  sortBooks(type) {
    const key = type === "date" ? "publicationDate" : type;
    for (let i = 0; i < this.books.length - 1; i++) {
      let min = i;
      for (let j = i + 1; j < this.books.length; j++) {
        if (
          String(this.books[j][key]).toLowerCase() <
          String(this.books[min][key]).toLowerCase()
        ) {
          min = j;
        }
      }
      let temp = this.books[i];
      this.books[i] = this.books[min];
      this.books[min] = temp;
    }
    this.display();
  }
  async fetchBooks() {
    try {
      const response = await fetch("https://openlibrary.org/search.json?q=javascript");
      if (!response.ok) {
        throw new Error("Unable to fetch books");
      }
      const data = await response.json();
      let output = "<h3>Fetched Books</h3>";
      data.docs.slice(0, 10).forEach(book => {
        output += `
          <p>
            <b>Title:</b> ${escapeHTML(book.title)}<br>
            <b>Author:</b> ${escapeHTML(book.author_name ? book.author_name[0] : "Unknown")}
          </p>
          <hr>
        `;
      });
      document.getElementById("result").innerHTML = output;
    } catch (error) {
      document.getElementById("result").textContent = error.message;
    }
  }
  searchBook(keyword, callback) {
    setTimeout(() => {
      const result = this.books.filter(book =>
        book.title.toLowerCase().includes(keyword.toLowerCase())
      );
      callback(result);
    }, 1000);
  }
}
const manager = new BookManager();
function escapeHTML(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
document.getElementById("bms").addEventListener("submit", function (e) {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const isbn = document.getElementById("isbn").value;
  const price = document.getElementById("price").value;
  const publicationDate = document.getElementById("publicationDate").value;
  const genre = document.getElementById("genre").value;
  const bookType = document.getElementById("bookType").value;
  if (
    title === "" ||
    author === "" ||
    isbn === "" ||
    price === "" ||
    publicationDate === "" ||
    genre === "" ||
    bookType === ""
  ) {
    alert("All fields are required.");
    return;
  }
  if (isNaN(isbn)) {
    alert("ISBN must be numeric.");
    return;
  }
  if (isNaN(price)) {
    alert("Price must be numeric.");
    return;
  }
  const book = bookType === "ebook"
    ? new EBook(title, author, isbn, publicationDate, genre, price)
    : new PrintedBook(title, author, isbn, publicationDate, genre, price);
  manager.simulateServer(book)
    .then(() => {
      if (manager.edit === -1) {
        manager.books.push(book);
        alert("Book Added Successfully");
      } else {
        manager.books[manager.edit] = book;
        manager.edit = -1;
        alert("Book Updated Successfully");
      }
      manager.display();
      document.getElementById("bms").reset();
    })
    .catch((error) => {
      alert(error);
    });
});
document.getElementById("fetchBtn").addEventListener("click", () => manager.fetchBooks());
document.getElementById("searchBtn").addEventListener("click", () => {
  const keyword = document.getElementById("searchBook").value;
  manager.searchBook(keyword, function (result) {
    if (result.length === 0) {
      document.getElementById("result").innerHTML = "No Book Found";
    } else {
      let output = "";
      result.forEach((book) => {
        output += escapeHTML(book.title) + "<br>";
        output += escapeHTML(book.author) + "<br>";
        output += escapeHTML(book.isbn) + "<br>";
        output += escapeHTML(book.publicationDate) + "<br>";
        output += escapeHTML(book.genre) + "<br><br>";
      });
      document.getElementById("result").innerHTML = output;
    }
  });
});
document.getElementById("bookList").addEventListener("click", function (e) {
  const button = e.target.closest("button[data-action]");
  if (!button) return;

  const index = Number(button.dataset.index);
  const action = button.dataset.action;

  if (action === "edit") {
    manager.editBook(index);
  } else if (action === "delete") {
    manager.deleteBook(index);
  }
});
document.getElementById("sortBtn").addEventListener("click", function (e) {
  e.preventDefault();
  const type = document.getElementById("sortBooks").value;
  if (type === "") {
    alert("Please select a sorting option.");
    return;
  }
  manager.sortBooks(type);
});
