// Constants
const STORAGE_KEY = "bookshelf_app";
const BOOK_FORM_ID = "bookForm";
const BOOK_FORM_TITLE_ID = "bookFormTitle";
const BOOK_FORM_AUTHOR_ID = "bookFormAuthor";
const BOOK_FORM_YEAR_ID = "bookFormYear";
const BOOK_FORM_IS_COMPLETE_ID = "bookFormIsComplete";
const INCOMPLETE_BOOK_LIST_ID = "incompleteBookList";
const COMPLETE_BOOK_LIST_ID = "completeBookList";

// DOM Elements
const bookForm = document.getElementById(BOOK_FORM_ID);
const bookFormTitle = document.getElementById(BOOK_FORM_TITLE_ID);
const bookFormAuthor = document.getElementById(BOOK_FORM_AUTHOR_ID);
const bookFormYear = document.getElementById(BOOK_FORM_YEAR_ID);
const bookFormIsComplete = document.getElementById(BOOK_FORM_IS_COMPLETE_ID);
const incompleteBookList = document.getElementById(INCOMPLETE_BOOK_LIST_ID);
const completeBookList = document.getElementById(COMPLETE_BOOK_LIST_ID);

// Functions
function getBooks() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function saveBooks(books) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

function createBookObject(id, title, author, year, isComplete) {
  return { id, title, author, year, isComplete };
}

function generateId() {
  return +new Date();
}

function addBook(title, author, year, isComplete) {
  const books = getBooks();
  const newBook = createBookObject(
    generateId(),
    title,
    author,
    parseInt(year),
    isComplete
  );
  books.push(newBook);
  saveBooks(books);
  renderBooks();
}

function deleteBook(id) {
  const books = getBooks().filter((book) => book.id !== id);
  saveBooks(books);
  renderBooks();
}

function editBook(id) {
  const books = getBooks();
  const book = books.find((book) => book.id === id);
  if (book) {
    const newTitle = prompt("Edit Judul Buku:", book.title);
    const newAuthor = prompt("Edit Penulis Buku:", book.author);
    const newYear = prompt("Edit Tahun Rilis:", book.year);
    if (newTitle && newAuthor && newYear) {
      book.title = newTitle;
      book.author = newAuthor;
      book.year = parseInt(newYear);
      saveBooks(books);
      renderBooks();
    }
  }
}

function toggleBookStatus(id) {
  const books = getBooks();
  const book = books.find((book) => book.id === id);
  if (book) {
    book.isComplete = !book.isComplete;
    saveBooks(books);
    renderBooks();
  }
}

function renderBooks() {
  incompleteBookList.innerHTML = "";
  completeBookList.innerHTML = "";

  const books = getBooks();
  books.forEach((book) => {
    const bookElement = document.createElement("div");
    bookElement.dataset.bookid = book.id;
    bookElement.innerHTML = `
      <h3>${book.title}</h3>
      <p>Penulis: ${book.author}</p>
      <p>Tahun: ${book.year}</p>
      <div>
        <button onclick="toggleBookStatus(${book.id})">${
      book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca"
    }</button>
        <button onclick="deleteBook(${book.id})">Hapus Buku</button>
        <button onclick="editBook(${book.id})">Edit Buku</button>
      </div>
    `;

    if (book.isComplete) {
      completeBookList.appendChild(bookElement);
    } else {
      incompleteBookList.appendChild(bookElement);
    }
  });
}

// Event Listeners
bookForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = bookFormTitle.value;
  const author = bookFormAuthor.value;
  const year = bookFormYear.value;
  const isComplete = bookFormIsComplete.checked;
  addBook(title, author, year, isComplete);
  bookForm.reset();
});

document.addEventListener("DOMContentLoaded", renderBooks);
