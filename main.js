document.addEventListener("DOMContentLoaded", function () {
    const inputBookForm = document.getElementById("inputBook");
    const incompleteBookshelfList = document.getElementById("incompleteBookshelfList");
    const completeBookshelfList = document.getElementById("completeBookshelfList");
    const searchForm = document.getElementById("searchForm");

    // Load books from localStorage on page load
    loadBooks();

    inputBookForm.addEventListener("submit", function (event) {
        event.preventDefault();
        addBook();
    });

    searchForm.addEventListener("submit", function (event) {
        event.preventDefault();
        searchBooks();
    });

    function searchBooks() {
        const searchInput = document.getElementById("searchInput").value.toLowerCase();
        const allBooks = document.querySelectorAll(".book_item");

        allBooks.forEach(book => {
            const title = book.querySelector("h3").textContent.toLowerCase();
            if (title.includes(searchInput)) {
                book.style.display = "block"; // menampilkan buku jika judul cocok
            } else {
                book.style.display = "none"; // menyembunyikan buku jika judul tidak cocok
            }
        });
    }
    

    function addBook() {
        const inputBookTitle = document.getElementById("inputBookTitle").value;
        const inputBookAuthor = document.getElementById("inputBookAuthor").value;
        const inputBookYear = parseInt(document.getElementById("inputBookYear").value);
        const inputBookIsComplete = document.getElementById("inputBookIsComplete").checked;
        const bookId = generateId();
        const book = {
            id: bookId,
            title: inputBookTitle,
            author: inputBookAuthor,
            year: inputBookYear,
            isComplete: inputBookIsComplete
        };

        // Add book to appropriate shelf
        const bookElement = createBookElement(book);
        if (book.isComplete) {
            completeBookshelfList.appendChild(bookElement);
        } else {
            incompleteBookshelfList.appendChild(bookElement);
        }

        // Save books to localStorage
        saveBooks();
    }

    function generateId() {
        return Math.floor(Math.random() * 1000000000);
    }

    function createBookElement(book) {
        const bookItem = document.createElement("article");
        bookItem.classList.add("book_item");
        bookItem.id = book.id; // Set book id as element id for easy reference

        const title = document.createElement("h3");
        title.textContent = book.title;
        bookItem.appendChild(title);

        const author = document.createElement("p");
        author.textContent = `Penulis: ${book.author}`;
        bookItem.appendChild(author);

        const year = document.createElement("p");
        year.textContent = `Tahun: ${book.year}`;
        bookItem.appendChild(year);

        const action = document.createElement("div");
        action.classList.add("action");

        const toggleButton = document.createElement("button");
        toggleButton.textContent = book.isComplete ? "Belum selesai di Baca" : "Selesai dibaca";
        toggleButton.classList.add(book.isComplete ? "green" : "red");
        toggleButton.addEventListener("click", function () {
            toggleBookStatus(book.id);
        });
        action.appendChild(toggleButton);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Hapus buku";
        deleteButton.classList.add("red");
        deleteButton.addEventListener("click", function () {
            deleteBook(book.id);
        });
        action.appendChild(deleteButton);

        bookItem.appendChild(action);

        return bookItem;
    }

    function toggleBookStatus(bookId) {
        const bookElement = document.getElementById(bookId);
        const isComplete = bookElement.parentNode.id === "completeBookshelfList";
        const destinationShelf = isComplete ? incompleteBookshelfList : completeBookshelfList;
        const toggleButton = bookElement.querySelector(".action button:first-child");
        toggleButton.textContent = isComplete ? "Selesai dibaca" : "Belum selesai di Baca";
        toggleButton.classList.toggle("green");
        toggleButton.classList.toggle("red");
        destinationShelf.appendChild(bookElement);

        // Update book status and save changes to localStorage
        const book = {
            id: bookId,
            title: bookElement.querySelector("h3").textContent,
            author: bookElement.querySelector("p:nth-child(2)").textContent.replace("Penulis: ", ""),
            year: parseInt(bookElement.querySelector("p:nth-child(3)").textContent.replace("Tahun: ", "")),
            isComplete: !isComplete
        };
        saveBooks();
    }

    function deleteBook(bookId) {
        const bookElement = document.getElementById(bookId);
        bookElement.remove();

        // Remove book from localStorage
        saveBooks();
    }

    // Save books to localStorage
    function saveBooks() {
        localStorage.setItem("books", JSON.stringify({
            incomplete: Array.from(incompleteBookshelfList.children).map(book => ({
                id: book.id,
                title: book.querySelector("h3").textContent,
                author: book.querySelector("p:nth-child(2)").textContent.replace("Penulis: ", ""),
                year: parseInt(book.querySelector("p:nth-child(3)").textContent.replace("Tahun: ", "")),
                isComplete: false
            })),
            complete: Array.from(completeBookshelfList.children).map(book => ({
                id: book.id,
                title: book.querySelector("h3").textContent,
                author: book.querySelector("p:nth-child(2)").textContent.replace("Penulis: ", ""),
                year: parseInt(book.querySelector("p:nth-child(3)").textContent.replace("Tahun: ", "")),
                isComplete: true
            }))
        }));
    }

    // Load books from localStorage
    function loadBooks() {
        const books = JSON.parse(localStorage.getItem("books"));
        if (books) {
            books.incomplete.forEach(book => {
                const bookElement = createBookElement(book);
                incompleteBookshelfList.appendChild(bookElement);
            });
            books.complete.forEach(book => {
                const bookElement = createBookElement(book);
                completeBookshelfList.appendChild(bookElement);
            });
        }
    }
});
