class BaseBook {
  constructor(title, author, isbn, publicationDate, genre) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
    this.publicationDate = publicationDate;
    this.genre = genre;
  }
  getAge() {
    return Math.max(0,new Date().getFullYear() -new Date(this.publicationDate).getFullYear());
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
  constructor(title, author, isbn, publicationDate, genre) {
    super(title, author, isbn, publicationDate, genre);
    this.type = "Printed Book";
  }
  getDiscountPrice(price) {
    return price * 0.9;
  }
}
class EBook extends BaseBook {
  constructor(title, author, isbn, publicationDate, genre) {
    super(title, author, isbn, publicationDate, genre);
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
      <b>Title:</b> ${escapeHTML(book.title)}<br>
      <b>Author:</b> ${escapeHTML(book.author)}<br>
      <b>ISBN:</b> ${escapeHTML(book.isbn)}<br>
      <b>Publication Date:</b> ${escapeHTML(book.publicationDate)}<br>
      <b>Genre:</b> ${escapeHTML(book.genre)}<br>
      <b>Age:</b> ${book.getAge()} Years<br>
      <b>Category:</b> ${book.getCategory()}<br>
      <b>Type:</b> ${book.type}<br><br>
      <button onclick="manager.editBook(${index})">Edit</button>
      <button onclick="manager.deleteBook(${index})">Delete</button>
      <hr>
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
  document.getElementById("publicationDate").value =
    this.books[index].publicationDate;
  document.getElementById("genre").value = this.books[index].genre;
}
deleteBook(index) {
  this.books.splice(index, 1);
  this.edit = -1;
  document.getElementById("bms").reset();
  this.display();
}
sortBooks(type) {
  for (let i = 0; i < this.books.length - 1; i++) {
    let min = i;
    for (let j = i + 1; j < this.books.length; j++) {
      if (
        this.books[j].title.toLowerCase() <
        this.books[min].title.toLowerCase()
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
const bookManager = new BookManager();
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
  const publicationDate = document.getElementById("publicationDate").value;
  const genre = document.getElementById("genre").value;
  if (
    title === "" ||
    author === "" ||
    isbn === "" ||
    publicationDate === "" ||
    genre === ""
  ) {
    alert("All fields are required.");
    return;
  }
  if (isNaN(isbn)) {
    alert("ISBN must be numeric.");
    return;
  }
  const book = new PrintedBook(
  title,
  author,
  isbn,
  publicationDate,
  genre
);
  manager.simulateServer(book)
    .then((message) => {
      alert(message);
      if (manager.edit === -1) {
    manager.books.push(book);
}
else {
    manager.books[manager.edit] = book;
    manager.edit = -1;
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
document.getElementById("sortBtn").addEventListener("click", function (e) {
    e.preventDefault();
    const type = document.getElementById("sortBooks").value;
    if (type === "") {
        alert("Please select a sorting option.");
        return;
    }
    manager.sortBooks(type);
});
