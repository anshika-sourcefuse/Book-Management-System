let books=[];
let edit=-1;
const age=(date)=>{
    return new Date().getFullYear()-new Date(date).getFullYear();
};
const getCategory=(genre)=>{
    genre=genre.toLowerCase();

    if(genre.includes("fiction")) return "Fiction";
    if(genre.includes("history")) return "History";

    return "Novel";
};
const display=()=>{
    const list=document.getElementById("bookList");
    list.innerHTML="";
    books.forEach((book,index)=>{
        list.innerHTML+=`
        <li>
        <b>Title:</b> ${book.title}<br>
        <b>Author:</b> ${book.author}<br>
        <b>ISBN:</b> ${book.isbn}<br>
        <b>Publication Date:</b> ${book.publicationdate}<br>
        <b>Age:</b> ${age(book.publicationdate)} Years<br>
        <b>Genre:</b> ${book.genre}<br>
        <b>Category:</b> ${getCategory(book.genre)}<br><br>
        <button onclick="editBook(${index})">Edit</button>
        <button onclick="deleteBook(${index})">Delete</button>
        <hr>
        </li>
        `;
    });
};
document.getElementById("bms").addEventListener("submit",function(e){
    e.preventDefault();
    e.stopPropagation();});
document.getElementById("bms").addEventListener("submit",function(e){
    e.preventDefault();
    e.stopPropagation();
    const title=document.getElementById("title").value;
    const author=document.getElementById("author").value;
    const isbn=document.getElementById("isbn").value;
    const publicationdate=document.getElementById("publicationdate").value;
    const genre=document.getElementById("genre").value;
    if(title==""||author==""||isbn==""||publicationdate==""||genre==""){
        alert("All fields are required.");
        return;
    }
    if(isNaN(isbn)){
        alert("ISBN must be numeric.");
        return;
    }
    const book={
        title,
        author,
        isbn,
        publicationdate,
        genre
    };
    if(edit==-1){
        books.push(book);
    }
    else{
        books[edit]=book;
        edit=-1;
    }
    display();
    document.getElementById("bms").reset();
});
function editBook(index){
    edit=index;
    document.getElementById("title").value=books[index].title;
    document.getElementById("author").value=books[index].author;
    document.getElementById("isbn").value=books[index].isbn;
    document.getElementById("publicationdate").value=books[index].publicationdate;
    document.getElementById("genre").value=books[index].genre;
}
function deleteBook(index){
    books.splice(index,1);
    display();
}
