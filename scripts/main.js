// TODO LIST
// 1) Setup Firebase -- online database
// 2) make it required for the input fields to be filled out when pressing the submit button
// 2) research a web API for book cover images --> if possible, pull the book cover image and have it displayed as the background of the cards
//     a) or prompt the user to insert a url of the book cover image --> this will then display as the background of the card
// all book objects will be stored in this array

if (localStorage.length === 0) {
    let myLibrary = [];
    localStorage.setItem('userLibrary', JSON.stringify(myLibrary));
}

let myLibrary = JSON.parse(localStorage.getItem('userLibrary'));

console.log(localStorage);

// DOM variables
const libraryArea = document.querySelector('.library-container');

const newBook = document.querySelector('.new-book-button');
const newBookTooltip = document.querySelector('.new-book-tooltip');
const formCancel = document.querySelector('.cancel-button');
const formField = document.querySelector('.form-container');

const formTitle = document.querySelector('#form-title');
const formAuthor = document.querySelector('#form-author');
const formPages = document.querySelector('#form-pages');
const formGenre = document.querySelector('#form-genre');
const formRead = document.querySelector('#form-read');
const formSubmit = document.querySelector('#submit-button');

// Variables that are updated with each addition or removal from the Library array
let deleteBook;
let readBook;

// Book constructor function
function Book(title, author, pages, genre, read) {
    this.title = title,
    this.author = author,
    this.pages = pages,
    this.genre = genre,
    this.read = read
}

// ** ADD FUNCTION ** add the book to the Library 
Book.prototype.addToLibrary = function() {
    myLibrary.push(this);
}

// rendering with forEach() -- avoids property of undefined errors
function renderLibrary(array) {
    libraryArea.innerHTML = '';
    array.forEach(element => {
        let book = document.createElement('div');
        book.classList.add('card-container');
        book.classList.add('shadow');

        let index = array.indexOf(element);
        book.setAttribute('data-index', index);

        // to create the read button status upon submitting from the form 
        let readStatus;
        let innerReadText;
        if (element['read']) {
            readStatus = `class="book-read"`;
            innerReadText = `Read`;
        } else {
            readStatus = `class="book-not-read"`;
            innerReadText = `Not Read`;
        }

        book.innerHTML = `<h3 class="card-title">${element['title']}</h3>
        <i id="book-info" class='fas fa-info-circle'></i>
        <i id="book-delete" class='fas fa-window-close'></i>
        <button id="read-button" ${readStatus}>${innerReadText}</button>`;

        libraryArea.appendChild(book);
    })
        // delete button nodelist updated for each new book added
        deleteBook = document.querySelectorAll('#book-delete'); 
        deleteBook.forEach(element => element.addEventListener('click', function() {
            let result = confirm("Are you sure you want to remove this book from the library?");
            if (result) {
                let parent = element.parentElement;
                let index = parent.getAttribute('data-index');
                libraryArea.removeChild(parent);
                myLibrary.splice(index, 1);
                localStorage.userLibrary = JSON.stringify(myLibrary);
                renderLibrary(myLibrary);
            }  
        }));
        // read button nodelist updated for each new book added
        readBook = document.querySelectorAll('#read-button');
        readBook.forEach(element => element.addEventListener('click', function() {
            let parent = element.parentElement;
            let index = parent.getAttribute('data-index');
            if (myLibrary[index]['read']) {
                element.classList.remove('book-read');
                element.classList.add('book-not-read');
                element.innerText = 'Not Read';
                myLibrary[index]['read'] = false;
                localStorage.setItem('userLibrary', JSON.stringify(myLibrary));
            } else {
                element.classList.remove('book-not-read');
                element.classList.add('book-read');
                element.innerText = 'Read';
                myLibrary[index]['read'] = true;
                localStorage.setItem('userLibrary', JSON.stringify(myLibrary));
            }
        }));  
        // info button nodelist for displaying the info for each book when clicked
        infoBook = document.querySelectorAll('#book-info');
        infoBook.forEach(element => element.addEventListener('click', function() {
            let parent = element.parentElement;
            let cardTitle = parent.querySelector('.card-title');
            let readButton = parent.querySelector('#read-button');
            let deleteButton = parent.querySelector('#book-delete');
            let index = parent.getAttribute('data-index');
            let title;
            let author;
            let pages;
            let genre;

            if (parent.classList.contains('card-info-styles') == false) {
                parent.classList.remove('card-container');
                parent.classList.add('card-info-styles');
                element.style.color = 'rgb(32, 32, 32)';
                cardTitle.style.display = 'none';
                readButton.style.display = 'none';
                deleteButton.style.display = 'none';
                title = document.createElement('h3');
                title.classList.add('info-title');
                title.innerText = myLibrary[index]['title'];
                author = document.createElement('h3');
                author.classList.add('info-author');
                author.innerText = myLibrary[index]['author'];
                pages = document.createElement('h3');
                pages.classList.add('info-pages');
                pages.innerText = ` Pages: ${myLibrary[index]['pages']}`;
                genre = document.createElement('h3');
                genre.classList.add('info-genre');
                genre.innerText = myLibrary[index]['genre'];

                parent.appendChild(title);
                parent.appendChild(author);
                parent.appendChild(pages);
                parent.appendChild(genre);
            } else {
                title = parent.querySelector('.info-title');
                author = parent.querySelector('.info-author');
                pages = parent.querySelector('.info-pages');
                genre = parent.querySelector('.info-genre');
                parent.removeChild(title);
                parent.removeChild(author);
                parent.removeChild(pages);
                parent.removeChild(genre);
                parent.classList.remove('card-info-styles');
                parent.classList.add('card-container');
                element.style.color = '#eefdfd';
                cardTitle.style.display = 'block';
                readButton.style.display = 'block';
                deleteButton.style.display = 'block';
            }
        }));
}

// first render call
renderLibrary(myLibrary);

//Event listener for mouseover the new Book button, brings up the tooltip
newBook.addEventListener('mouseenter', function() {
    newBookTooltip.style.opacity = 1;
})

newBook.addEventListener('mouseleave', function() {
    newBookTooltip.style.opacity = 0;
})

// Event listener for clicking the plus button which hides the plus button and reveals the form
newBook.addEventListener("click", function() {
    newBook.classList.add('hide');
    formField.classList.remove('hide');
})

// Event listener for clicking the cancel box on the form which reversese the hide classes 
formCancel.addEventListener('click', function() {
    newBook.classList.remove('hide');
    formField.classList.add('hide');
})

// Event Listener to add a user specified book to the library -- activates by clicking the submit button in the form, as of now, empty fields are accepted
formSubmit.addEventListener('click', addToLibraryHandler);

// Event Listener for when enter is pressed
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addToLibraryHandler();
    }
});

function addToLibraryHandler() {
    let title = formTitle.value;
    let author = formAuthor.value;
    let pages = formPages.value;
    let genre = formGenre.value;
    let read = formRead.checked;

    let userBook = new Book(title, author, pages, genre, read);
    userBook.addToLibrary();
    localStorage.setItem('userLibrary', JSON.stringify(myLibrary));
    renderLibrary(myLibrary);
    // reset all form values ** submit input type should help avoid this 
    formTitle.value = '';
    formAuthor.value = '';
    formPages.value = '';
    formGenre.value = '';
    formRead.checked = false;
    formField.classList.add('hide');
    newBook.classList.remove('hide');
}


