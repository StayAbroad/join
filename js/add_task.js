let currentPrio = -1;
let currentCategory = '';
let currentCategoryColor = '';
let currentSubtasks = [];
let currentAssignees = [];


async function initAddTask() {

    await init();
    await loadCategories();
    await dateLimitation();
}


window.addEventListener("load", function () {
    // do things after the DOM loads fully
    console.log("Everything is loaded");
});


// Help Functions //

/**
 * Toggles a class list of an element
 * @param {number} id The ID of the element
 * @param {string} classList The classlist which will be toggled
 */
function toggleClassList(id, classList,) {
    document.getElementById(id).classList.toggle(classList);
    // document.body.classList.toggle("overlay");
}


/**
 * Toggles the visibility of the dropdown menu
 * @param {string} dropdown The dropdown container
 * @param {string} icon The triangle icon
 */
function toggleDropdown(dropdown, icon) {
    toggleClassList(dropdown, 'd-none');
    toggleClassList(icon, 'rotate180');
}


// Input Fields//

/**
 * Shows the input field and the color selection if needed
 * @param {string} inputContainer The input container
 * @param {string} container The dropdown container
 * @param {string} dropdown The dropdown itself
 * @param {string} icon The triangle icon
 */
function showInputField(inputContainer, container, dropdown, icon) {
    toggleClassList(inputContainer, 'd-none');
    toggleClassList(container, 'd-none');
    toggleDropdown(dropdown, icon);
    if (inputContainer == 'category-input-container')
        toggleClassList('category-colors', 'd-none');
}


/**
 * Hides the input field and the color selection if needed
 * @param {string} input The input field
 * @param {string} inputContainer The input container
 * @param {string} container The dropwdown container
 */
function hideInputField(input, inputContainer, container) {
    document.getElementById(input).value = '';
    toggleClassList(inputContainer, 'd-none');
    toggleClassList(container, 'd-none');
    if (inputContainer == 'category-input-container') {
        toggleClassList('category-colors', 'd-none');
        resetActiveColor();
    }
}


/**
 * Shows the buttons inside the input field
 * @param {string} btns The Buttons from the input fields
 * @param {string} icon The triangle icon
 */
function showInputBtns(btns, icon) {
    document.getElementById(btns).classList.remove('d-none');
    document.getElementById(icon).classList.add('d-none');
}


// Category Section //

/**
 * Adds a new category to the selection
 * @param {string} input The input field
 * @param {string} container The category container
 * @param {string} dropdown The category dropdown menu
 */
function addNewCategory(input, container, dropdown) {
    let catInput = document.getElementById(input);
    if (catInput.value.length > 0 && currentCategoryColor) {
        pushCategory(catInput.value, currentCategoryColor);
        selectCategory(catInput.value, currentCategoryColor);
        hideInputField(input, container, dropdown);
        loadCategories();
        resetActiveColor();
        currentCategoryColor = '';
    }
}


/**
 * Pushes a new category to the selection on the server
 * @param {string} catInput The category input field
 * @param {string} currentCategoryColor The current category color
 */
async function pushCategory(catInput, currentCategoryColor) {

    let newCategory =

    {
        "name": catInput,
        "color": currentCategoryColor
    }
    categories.push(newCategory);
}


/**
 * Loads all categories from the server inside the selection
 */
async function loadCategories() {
    let list = document.getElementById('category-list');
    list.innerHTML = '';
    for (let i = 0; i < categories.length; i++) {
        let category = categories[i]['name'];
        let color = categories[i]['color'];
        list.innerHTML += categoryHTML(category, color);
    }
    list.innerHTML += addCategoryHTML();
}


/**
 * Selects a category for the task and validates the field
 * @param {string} category Clicked category
 * @param {string} color Belonging color of the category
 */
function selectCategory(category, color) {
    let field = document.getElementById('selected-category');
    let dropdown = document.getElementById('category-dropdown');
    field.innerHTML = '';
    field.innerHTML = selectedCategoryHTML(category, color);
    if (!dropdown.classList.contains('d-none'))
        toggleDropdown('category-dropdown', 'triangle1');
    currentCategory = category;
    validationForField(2, currentCategory);
}


/**
 * Adds a new color to the category which will be added
 * @param {string} color The selected color
 * @param {number} id The ID of the selected color
 */
function addNewColorToCategory(color, id) {
    currentCategoryColor = color;
    toggleActiveColor(id);
}


/**
 * Toggles the active color selection
 * @param {number} id The ID of the selected color
 */
function toggleActiveColor(id) {
    let btns = document.querySelectorAll("#category-colors .color-dot");

    for (let i = 0; i < btns.length; i++) {
        btns[i].classList.remove('active');
    }
    toggleClassList(`color${id}`, 'active');
}


/**
 * Resets the active color
 */
function resetActiveColor() {
    let btns = document.querySelectorAll("#category-colors .color-dot");

    for (let i = 0; i < btns.length; i++) {
        btns[i].classList.remove('active');
    }
}


// Assignee Section //


/**
 * Adds a contact from the listed contacts on the server and validates the field
 * @param {string} input The assignees input field
 * @param {string} container The assignees input container
 * @param {string} dropdown The assignees dropdown container
 */
function inviteContact(input, container, dropdown) {
    let assignInput = document.getElementById(input);
    let user = users.find(element => element['email'] == assignInput.value);
    let assignedUser = currentAssignees.find(element => element['email'] == assignInput.value);

    if (user && !assignedUser) {
        currentAssignees.push(user);
        assignInput.value = '';
        renderAssignees();
        hideInputField(input, container, dropdown);
        validationForField(3, currentAssignees);
    }
}


/**
 * Renders the added assignees
 */
function renderAssignees() {
    let list = document.getElementById('assignee-list');
    let badgeList = document.getElementById('add-task-assignees');
    list.innerHTML = '';
    badgeList.innerHTML = '';

    for (let i = 0; i < currentAssignees.length; i++) {
        let assignee = currentAssignees[i]['name'];
        list.innerHTML += assigneeHTML(i, assignee);
    }
    showAssigneeBadge();
    list.innerHTML += inviteContactHTML();
}


/**
 * Shows the Badges of selected assignees
 */
function showAssigneeBadge() {
    let badgeList = document.getElementById('add-task-assignees');
    badgeList.innerHTML = '';

    for (let i = 0; i < currentAssignees.length; i++) {
        let initials = currentAssignees[i]['short_name'];
        let color = currentAssignees[i]['color'];
        badgeList.innerHTML += assigneeBadgeHTML(initials, color);
    }
}


/**
 * Selects an assignee for the task
 * @param {number} i Index of the selected assignee
 * @param {string} assignee Name of the assignee
 */
function selectAssignee(i, assignee) {
    let user = currentAssignees.find(element => element['name'] == assignee);

    if (!user) {
        let user = users.find(element => element['name'] == assignee);
        currentAssignees.push(user);
    } else {
        let index = currentAssignees.findIndex(element => element['name'] == assignee);
        currentAssignees.splice(index, 1);
    }
    changeCheckbox(i);
    showAssigneeBadge();
    validationForField(3, currentAssignees);
}


/**
 * Toggles the checkbox if is selected or not
 * @param {number} i Index of the clicked checkbox
 */
function changeCheckbox(i) {
    let checkbox = document.getElementById(`checkbox${i}`);
    let checked = './assets/img/checkbox-assignee-checked.svg';
    let unchecked = './assets/img/checkbox-assignee-unchecked.svg';

    if (checkbox.src.indexOf("unchecked") >= 0) { // TODO Why !== -1 ?? IndexOf gives "-1" back when nothing is found.
        checkbox.src = checked;
    } else {
        checkbox.src = unchecked;
    }
}


// Prio Section //

/**
 * Sets the priority for the task
 * @param {number} index 
 */
function setPrio(index) {
    let btns = document.getElementsByClassName("prio-btn");

    for (let i = 0; i < btns.length; i++) {
        let btn = btns[2 - i];
        let id = prio[i]['name'].toLowerCase() + '-btn-img';
        let img = document.getElementById(id);
        let color = prio[i]['color'];
        let signWhite = prio[i]['sign-white'];
        let signColor = prio[i]['sign-color'];

        if (index === i) {
            btn.style.backgroundColor = color;
            btn.style.color = 'white';
            img.src = signWhite;
            currentPrio = index;
            validationForField(5, currentPrio + 1);
        }
        else {
            btn.style.backgroundColor = '#FFFFFF';
            btn.style.color = 'black';
            img.src = signColor;
        }
    }
}


// Subtask Function //

/**
 * Adds a subtask to the list
 * @param {string} input 
 * @param {string} container 
 * @param {string} dropdown 
 */
function addSubtask(input, container, dropdown) {
    let inputSubtask = document.getElementById('subtask-input');
    if (inputSubtask.value.length >= 1) {
        currentSubtasks.push(
            {
                "title": inputSubtask.value,
                "status": false
            });
        inputSubtask.value = '';
        hideInputField(input, container, dropdown);
    }
    renderSubtasks();
}

/**
 * Renders the subtask list
 */
function renderSubtasks() {
    list = document.getElementById('subtask-list');
    list.innerHTML = '';
    for (let i = 0; i < currentSubtasks.length; i++) {
        let subtask = currentSubtasks[i]['title'];
        list.innerHTML += subTaskHTML(subtask, i);
    }
}

/**
 * Deletes a subtask from the list
 * @param {number} i 
 */
function deleteSubtask(i) {
    currentSubtasks.splice(i, 1);
    renderSubtasks();
}


// Create Task //

/**
 * Creates a new task
 */
function createNewTask() {
    getDataForNewTask();
}


/**
 * Collects data from the add task sheet
 */
function getDataForNewTask() {
    let title = document.getElementById('title');
    let desc = document.getElementById('description');
    let date = document.getElementById('date-input');
    let assigneesMail = emailOfCurrentAssignee();

    if (submitValidation(title, desc, date, assigneesMail)) {
        addNewTask(title, desc, date, assigneesMail);
        showAddedTaskPopup();
        directsToBoard();
    }
}


/**
 * Returns the email addresses from selected assignees in an array
 * @returns {array}
 */
function emailOfCurrentAssignee() {
    let assigneesMail = [];
    for (let i = 0; i < currentAssignees.length; i++) {
        assigneesMail.push(currentAssignees[i]['email']);
    }
    return assigneesMail;
}


/**
 * Creates a new task and saves it on the server
 * @param {string} title 
 * @param {string} desc 
 * @param {string} date 
 * @param {object} assigneesMail // TODO Is that correct?!
 */
async function addNewTask(title, desc, date, assigneesMail) {

    let newTask = {

        "title": title.value,
        "desc": desc.value,
        "cat": currentCategory,
        "date": date.value,
        "prio": currentPrio,
        "assignees": Array.from(assigneesMail),
        "subtasks": Array.from(currentSubtasks)
    };

    await saveOnServer('categories', categories);

    tasks[0].push(newTask);
    await saveOnServer('tasks', tasks);
}


/**
 * Resets the complete add task sheet
 */
function resetAddTask() {
    clearAllInputs();
    loadCategories();
    renderAssignees();
    resetActiveColor();
    setPrio();
    renderSubtasks();
    resetValidation();
}


/**
 * Clears all inputs and sets back the variables
 */
function clearAllInputs() {
    let title = document.getElementById('title');
    let desc = document.getElementById('description');
    let date = document.getElementById('date-input');
    let cat = document.getElementById('selected-category');
    let catInput = document.getElementById('category-input');
    let assignee = document.getElementById('assign-input');
    let subtask = document.getElementById('subtask-input');

    cat.innerHTML = 'Select task category';
    title.value = '';
    desc.value = '';
    date.value = '';
    assignee.value = '';
    catInput.value = '';
    subtask.value = '';
    currentPrio = -1;
    currentAssignees = [];
    currentCategory = [];
    currentCategoryColor = '';
    currentSubtasks = [];
}


// Validation //

/**
 * Validates the complete add task sheet
 * @returns {boolean} 
 */
function submitValidation() {
    let title = document.getElementById('title');
    let desc = document.getElementById('description');
    let date = document.getElementById('date-input');
    let assigneesMail = emailOfCurrentAssignee();
    let validation = true;

    let allData = [title.value, desc.value, currentCategory, assigneesMail, date.value, currentPrio + 1];

    for (let i = 0; i < allData.length; i++) {
        const value = allData[i];
        let required = document.getElementById(`required${i}`);
        if (value == 0) {
            required.classList.remove('hidden');
            validation = false;
        } else {
            required.classList.add('hidden');
        }
    }
    return validation;
}


/**
 * Live validation for a field where the selection got pushed
 * @param {number} id 
 * @param {string} input 
 */
function validationForField(id, input) {
    let required = document.getElementById(`required${id}`);

    if (input == 0) {
        required.classList.remove('hidden');
    } else {
        required.classList.add('hidden');
    }
}


/**
 * Live validation for an input field
 * @param {number} id 
 * @param {string} input 
 */
function validationForInput(id, input) {
    let required = document.getElementById(`required${id}`);
    let value = document.getElementById(input).value;

    if (value == 0) {
        required.classList.remove('hidden');
    } else {
        required.classList.add('hidden');
    }
}


/**
 * Resets the complete validation 
 */
function resetValidation() {

    for (let i = 0; i < 6; i++) {
        let text = document.getElementById(`required${i}`);
        text.classList.add('hidden');
    }
}


/**
 * Limits the date to present day
 */
function dateLimitation() {

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();

    if (dd < 10) {
        dd = '0' + dd;
    }

    if (mm < 10) {
        mm = '0' + mm;
    }

    today = yyyy + '-' + mm + '-' + dd;
    document.getElementById("date-input").setAttribute("min", today);
}


/**
 * Shows the popup "Task added to board" with animation
 */
function showAddedTaskPopup() {
    let popup = document.getElementById('popup-btn');

    popup.classList.add('animation');
    setTimeout(function () {
        removeAnimate(popup);
    }, 3000);
}


/**
 * Removes the animation class from the popup
 * @param {string} popup 
 */
function removeAnimate(popup) {
    popup.classList.remove('animation');
}


/**
 * Directs from add task site to the board site
 */
function directsToBoard() {
    let url = window.location.pathname;
    if (url.indexOf('board') > -1) {
        setTimeout(renderNewTask, 2000);
    } else {
        setTimeout(function () {
            window.location.href = "board.html";
        }, 2000)
    }
}


/**
 * Adds a function for 
 * @param {object} e // TODO Is that correct?
 */
function enterFunctionSubtasks(e) {
    if (e.code == "Enter") {
        addSubtask('subtask-input', 'input-btns', 'plus-icon');
    }
}


/**
 * Adds a function for 
 * @param {object} e 
 */
function enterFunctionAssignees(e) {
    if (e.code == "Enter") {
        inviteContact('assign-input', 'assign-input-container', 'assign-dropdown-container');
    }
}


/**
 * Adds a function for 
 * @param {object} e 
 */
function enterFunctionNewCategory(e) {
    if (e.code == "Enter") {
        addNewCategory('category-input', 'category-input-container', 'category-dropdown-container');
    }
}


/*  Hide Dropdown By Clicking Next To It //

function toggleDropdown(id, icon) {
    toggleClassList(id, icon, 'd-none', 'rotate180');
    window.addEventListener('click', function handleClickOutsideBox(event) {
        let area = document.getElementById(id);
        if (!area.contains(event.target))
        document.getElementById(id).classList.add('d-none');
    })
}; */








