import express, { Request, Response } from "express";
const app = express();
const PORT = 3000;
app.use(express.json());
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
})
interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  genre: string;
  price: number;
}
let books: Book[] = [];
app.get("/books", (req: Request, res: Response) => {
  res.json(books);
});
app.get("/books/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const book = books.find(b => b.id === id);
  if (!book) {
    res.status(404).json({ message: "Book not found" });
    return;
  }
  res.json(book);
});
app.post("/books", (req: Request, res: Response) => {
  const book: Book = req.body;
  books.push(book);
  res.status(201).json(book);
});
app.put("/books/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const index = books.findIndex(b => b.id === id);
  if (index === -1) {
    res.status(404).json({ message: "Book not found" });
    return;
  }
  books[index] = req.body;
  res.json(books[index]);
});
app.delete("/books/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  books = books.filter(b => b.id !== id);

  res.json({ message: "Book deleted" });
});
app.use((err: Error, req: Request, res: Response, next: Function) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Book Management System API");
});
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
