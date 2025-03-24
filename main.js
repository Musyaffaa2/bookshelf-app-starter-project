const STORAGE_KEY = 'bookshelf_app';

function getBooks() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function saveBooks(books) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

function generateId() {
    return +new Date();
}

function createBookObject(id, title, author, year, isComplete) {
    return { id, title, author, year, isComplete };
}

function addBook(title, author, year, isComplete) {
    const books = getBooks();
    const newBook = createBookObject(generateId(), title, author, parseInt(year), isComplete);
    books.push(newBook);
    saveBooks(books);
    renderBooks();
}

function toggleBookStatus(id) {
    const books = getBooks();
    const book = books.find(book => book.id === id);
    if (book) {
        book.isComplete = !book.isComplete;
        saveBooks(books);
        renderBooks();
    }
}

function deleteBook(id) {
    const books = getBooks().filter(book => book.id !== id);
    saveBooks(books);
    renderBooks();
}

function editBook(id) {
    const books = getBooks();
    const book = books.find(book => book.id === id);
    if (book) {
        const newTitle = prompt('Edit Judul Buku:', book.title);
        const newAuthor = prompt('Edit Penulis Buku:', book.author);
        const newYear = prompt('Edit Tahun Rilis:', book.year);
        if (newTitle && newAuthor && newYear) {
            book.title = newTitle;
            book.author = newAuthor;
            book.year = parseInt(newYear);
            saveBooks(books);
            renderBooks();
        }
    }
}

function renderBooks() {
    const incompleteBookList = document.getElementById('incompleteBookList');
    const completeBookList = document.getElementById('completeBookList');
    incompleteBookList.innerHTML = '';
    completeBookList.innerHTML = '';

    const books = getBooks();
    books.forEach(book => {
        const bookElement = document.createElement('div');
        bookElement.dataset.bookid = book.id;
        bookElement.innerHTML = `
            <h3>${book.title}</h3>
            <p>Penulis: ${book.author}</p>
            <p>Tahun: ${book.year}</p>
            <div>
                <button onclick="toggleBookStatus(${book.id})">${book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca'}</button>
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

document.getElementById('bookForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const title = document.getElementById('bookFormTitle').value;
    const author = document.getElementById('bookFormAuthor').value;
    const year = document.getElementById('bookFormYear').value;
    const isComplete = document.getElementById('bookFormIsComplete').checked;
    addBook(title, author, year, isComplete);
    this.reset();
});

document.addEventListener('DOMContentLoaded', renderBooks);
