document.addEventListener('DOMContentLoaded', function(){
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function(){
        addBook();
    });

    const searchButton = document.getElementById('searchButton');
    searchButton.addEventListener('click', function(){
        const keyword = document.getElementById('searchBook').value;
        searchBook(keyword.toLowerCase());
    });

    if(isStorageExist()) { 
        loadDataFromStorage();
    }

    const editCancel = document.getElementById('editCancel');
    editCancel.addEventListener('click', function() {
        const edit = document.querySelector('.editSection');
        edit.setAttribute("hidden", '');
    });
});

document.addEventListener("ondatasaved", () => {
    console.log("Data tersimpan");
});
document.addEventListener("ondataloaded", () => {
    refreshDataFromBooks();
});