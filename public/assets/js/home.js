const saveNameBtn = document.querySelector('#save_name');
const userNameInput = document.querySelector('#userNameInput');
saveNameBtn.addEventListener('click', function () {
    createCookie('userName', userNameInput.value, 1);
});