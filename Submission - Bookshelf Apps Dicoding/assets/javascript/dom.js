const UNCOMPLETED_ID = 'notReadedList';
const COMPLETED_ID = 'readedList';
const BOOK_ID = "itemId";

function addBook() {
    const inputBookTitle = document.getElementById("inputBookTitle").value;
    const inputBookAuthor = document.getElementById("inputBookAuthor").value;
    const inputBookYear = document.getElementById("inputBookYear").value;
    const inputReaded = document.getElementById("readed").checked;

    const book = inputBook(inputBookTitle, inputBookAuthor, inputBookYear, inputReaded);
    const bookObject = composeBookObject(inputBookTitle, inputBookAuthor, inputBookYear, inputReaded);
  
    book[BOOK_ID] = bookObject.id;
    books.push(bookObject);

    if(inputReaded){
        document.getElementById(COMPLETED_ID).append(book);
    } else {
        document.getElementById(UNCOMPLETED_ID).append(book);
    }
    updateDataToStorage();
}

function searchBook(keyword) {
    const bookList = document.querySelectorAll('.cardList');
    for(let book of bookList){
        const title = book.childNodes[0];
        if(!title.innerText.toLowerCase().includes(keyword)) {
            title.parentElement.style.display = 'none';
        } else {
            title.parentElement.style.display = '';
        }
    }
}

function inputBook(inputTitle, inputAuthor, inputYear, inputReaded){
    const bookTitle = document.createElement('h3');
    bookTitle.classList.add('bookTitle');
    bookTitle.innerText = inputTitle;

    const bookAuthor = document.createElement('p');
    bookAuthor.classList.add('bookDetails');
    bookAuthor.innerText = inputAuthor;

    const bookYear = document.createElement('p');
    bookYear.classList.add('bookDetails');
    bookYear.innerText = inputYear;

    const buttons = document.createElement('div');
    buttons.classList.add('bookButtons');
    buttons.append(greenButton(inputReaded));
    buttons.append(yellowButton());
    buttons.append(redButton());

    const bookContainer = document.createElement('div');
    bookContainer.classList.add('cardList');
    bookContainer.append(bookTitle, bookAuthor, bookYear, buttons);

    return bookContainer;
};

function createButton(buttonType, buttonText, eventListener){
    const button = document.createElement("button");
    button.innerText = buttonText;
    button.classList.add(buttonType);
    button.addEventListener("click", function (event) {
        eventListener(event); 
    });
    return button;
}

function greenButton(status) {
    return createButton('buttonDone', (status ? 'Belum Selesai' : 'Selesai'), function(event) {
        if(status) {
            undoBookFromCompleted(event.target.parentElement.parentElement);
        } else {
            addBookToCompleted(event.target.parentElement.parentElement);
        }
    });
}

function yellowButton() {
    return createButton('buttonEdit', 'Ubah', function(event) {
        editBook(event.target.parentElement.parentElement);
    });
}

function redButton() {
    return createButton('buttonDelete', 'Hapus', function(event) {
        removeBook(event.target.parentElement.parentElement);
    });
}

function addBookToCompleted(taskElement) {
    const book = findBook(taskElement[BOOK_ID]);
    book.isCompleted = true;

    const newBook = inputBook(book.title, book.author, book.year, inputReaded = true);
    newBook[BOOK_ID] = book.id;

    const bookCompleted = document.getElementById(COMPLETED_ID);
    bookCompleted.append(newBook);

    taskElement.remove();
    updateDataToStorage();
}

function editBook(taskElement) {
    const edit = document.querySelector('.editSection');
    edit.removeAttribute("hidden");

    const book = findBook(taskElement[BOOK_ID]);

    const editBookTitle = document.getElementById("editBookTitle");
    editBookTitle.value = book.title;
    const editBookAuthor = document.getElementById("editBookAuthor");
    editBookAuthor.value = book.author;
    const editBookYear = document.getElementById("editBookYear");
    editBookYear.value = book.year;
    const editReaded = document.getElementById("editReaded");
    editReaded.checked = book.isCompleted;

    const submitEdit = document.getElementById('editSubmit');
    submitEdit.addEventListener('click', function(event) {

        updateEditBook(editBookTitle.value, editBookAuthor.value, editBookYear.value, editReaded.checked, book.id);

        const edit = document.querySelector('.editSection');
        edit.setAttribute("hidden", '');
    });
}

function updateEditBook(title, author, year, readed, id) {

    const bookStorage = JSON.parse(localStorage[STORAGE_KEY]);
    const bookIndex = findBookIndex(id);

    bookStorage[bookIndex] = {
        id: id,
        title: title,
        author: author,
        year: year,
        isCompleted: readed
    };

    const parsed = JSON.stringify(bookStorage);
    localStorage.setItem(STORAGE_KEY, parsed);
    location.reload(true);
    alert('Data berhasil diubah');
}

function removeBook(taskElement) {
    const erase = confirm('Yakin ingin menghapus buku?');
    if(erase) {

        const bookPosition = findBookIndex(taskElement[BOOK_ID]);
        books.splice(bookPosition, 1);

        taskElement.remove();
        updateDataToStorage();
    }
}

function undoBookFromCompleted(taskElement){
    const book = findBook(taskElement[BOOK_ID]);
    book.isCompleted = false;

    const newBook = inputBook(book.title, book.author, book.year, book.isCompleted);
    newBook[BOOK_ID] = book.id;

    const uncompletedRead = document.getElementById(UNCOMPLETED_ID);
    uncompletedRead.append(newBook);

    taskElement.remove();
    updateDataToStorage();
}