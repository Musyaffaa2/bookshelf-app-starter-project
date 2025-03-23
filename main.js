document.addEventListener("DOMContentLoaded", function () {
  const bookForm = document.getElementById("bookForm");
  const searchForm = document.getElementById("searchBook");
  const incompleteBookList = document.getElementById("incompleteBookList");
  const completeBookList = document.getElementById("completeBookList");

  const BOOKS_STORAGE_KEY = "BOOKSHELF_APP";
  let books = JSON.parse(localStorage.getItem(BOOKS_STORAGE_KEY)) || [];

  function saveBooks() {
    localStorage.setItem(BOOKS_STORAGE_KEY, JSON.stringify(books));
  }

  function renderBooks(filteredBooks = null) {
    incompleteBookList.innerHTML = "";
    completeBookList.innerHTML = "";

    (filteredBooks || books).forEach((book) => {
      const bookElement = document.createElement("div");
      bookElement.classList.add("book-item");
      bookElement.setAttribute("data-bookid", book.id);
      bookElement.innerHTML = `
          <h3>${book.title}</h3>
          <p>Penulis: ${book.author}</p>
          <p>Tahun: ${book.year}</p>
          <div>
            <button class="toggle-complete">${
              book.isComplete ? "Belum Selesai" : "Selesai"
            } dibaca</button>
            <button class="delete">Hapus Buku</button>
          </div>
        `;

      bookElement
        .querySelector(".toggle-complete")
        .addEventListener("click", () => toggleBookStatus(book.id));
      bookElement
        .querySelector(".delete")
        .addEventListener("click", () => deleteBook(book.id));

      if (book.isComplete) {
        completeBookList.appendChild(bookElement);
      } else {
        incompleteBookList.appendChild(bookElement);
      }
    });
  }

  function addBook(event) {
    event.preventDefault();
    const title = document.getElementById("bookFormTitle").value;
    const author = document.getElementById("bookFormAuthor").value;
    const year = parseInt(document.getElementById("bookFormYear").value);
    const isComplete = document.getElementById("bookFormIsComplete").checked;

    const newBook = {
      id: Date().getTime(),
      title,
      author,
      year,
      isComplete,
    };
    books.push(newBook);
    saveBooks();
    renderBooks();
    bookForm.reset();
  }

  function toggleBookStatus(bookId) {
    const book = books.find((b) => b.id === bookId);
    if (book) {
      book.isComplete = !book.isComplete;
      saveBooks();
      renderBooks();
    }
  }

  function deleteBook(bookId) {
    books = books.filter((b) => b.id !== bookId);
    saveBooks();
    renderBooks();
  }

  function searchBooks(event) {
    event.preventDefault();
    const query = document
      .getElementById("searchBookTitle")
      .value.toLowerCase();
    const filteredBooks = books.filter((book) =>
      book.title.toLowerCase().includes(query)
    );
    renderBooks(filteredBooks);
  }

  bookForm.addEventListener("submit", addBook);
  searchForm.addEventListener("submit", searchBooks);

  renderBooks();
});
