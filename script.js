let books = [];
let edit = -1;
const age = (date) => {
  return Math.max(0, new Date().getFullYear() - new Date(date).getFullYear());
};
const getCategory = (genre) => {
  genre = genre.toLowerCase();

  if (genre.includes("fiction")) return "Fiction";
  if (genre.includes("history")) return "History";
  if (genre.includes("romance")) return "Romance";
  if (genre.includes("thriller")) return "Thriller";
  if (genre.includes("autobiography")) return "Autobiography";
  return "General";
};
function escapeHTML(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
const display = () => {
  const list = document.getElementById("bookList");

  let output = "";

  books.forEach((book, index) => {
    output += `
        <li>
        <b>Title:</b> ${escapeHTML(book.title)}<br>
        <b>Author:</b> ${escapeHTML(book.author)}<br>
        <b>ISBN:</b> ${escapeHTML(book.isbn)}<br>
        <b>Publication Date:</b> ${escapeHTML(book.publicationDate)}<br>
        <b>Genre:</b> ${escapeHTML(book.genre)}<br>
        <b>Age:</b> ${age(book.publicationDate)} Years<br>
        <b>Category:</b> ${getCategory(book.genre)}<br><br>
        <button onclick="editBook(${index})">Edit</button>
        <button onclick="deleteBook(${index})">Delete</button>
        <hr>
        </li>
        `;
  });
  list.innerHTML = output;
};
document.getElementById("bms").addEventListener("submit", function (e) {
  e.preventDefault();
  e.stopPropagation();
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const isbn = document.getElementById("isbn").value;
  const publicationDate = document.getElementById("publicationDate").value;
  const genre = document.getElementById("genre").value;
  if (
    title == "" ||
    author == "" ||
    isbn == "" ||
    publicationDate == "" ||
    genre == ""
  ) {
    alert("All fields are required.");
    return;
  }
  if (isNaN(isbn)) {
    alert("ISBN must be numeric.");
    return;
  }
  const book = {
    title,
    author,
    isbn,
    publicationDate,
    genre,
  };
  if (edit == -1) {
    books.push(book);
  } else {
    books[edit] = book;
    edit = -1;
  }
  display();
  document.getElementById("bms").reset();
});
function editBook(index) {
  edit = index;
  document.getElementById("title").value = books[index].title;
  document.getElementById("author").value = books[index].author;
  document.getElementById("isbn").value = books[index].isbn;
  document.getElementById("publicationDate").value =
    books[index].publicationDate;
  document.getElementById("genre").value = books[index].genre;
}
function deleteBook(index){
    books.splice(index,1);
    edit = -1;
    document.getElementById("bms").reset();
    display();
}
