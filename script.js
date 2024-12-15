//backup storage
const state={
    tasklist:[],
};

// Dom operations

const taskcontent= document.querySelector(".task_content");
const taskmodal= document.querySelector(".task_modal_body");

// console.log(taskcontent);
// console.log(taskmodal);

const htmltaskcontent=({id,title,description,type,url})=>`
<div class='col-md-6 col-lg-4 mt-3' id=${id} >
  <div class='card shadow-sm task_card'>
      
  <div class=' card_header d-flex justify-content-end task_card_header'>
      <button class='btn btn-outline-info mr-3' name=${id} onclick='editTask(event)'>
      <i class='fas fa-pencil-alt' name=${id}></i>
      </button>
      <button class='btn btn-outline-dangermr-3' name=${id} onclick='deletecard(event)'>
       <i class='fas fa-trash-alt' name=${id}></i>
      </button>
    </div>

    <div class='card-body'>
    ${
        url ? 
        `<img width='100%' src=${url} alt='card image' class='img-fluid place_holder_image mb-3'/>`
        : `<img width='100%' src="2.jpg" alt='card image' class='img-fluid place_holder_image mb-3'/>`
    }
    <h5 class="card-title task_card_title">${title}</h5>
     <p class="card-description trim-3-lines text-muted">${description}</p>
    <div class='tags text-white d-flex flex-wrap'>
    <span class='badge bg-primary m-1'>${type}</span>
    </div>
    </div>

    <div class='card-footer'>
    <button type='button' class='btn btn-outline-primary float-right' 
    data-bs-toggle='modal' 
    data-bs-target='#showTask' 
    data-id='${id}' 
    onclick='OpenTask(event)'>
    Open Task
</button>


    </div>
  
  
    </div>
</div>
`;

// modal body  for on click of open task
const htmlModalcontent=({id,title,description,url})=>{
    const date=new Date(parseInt(id));
    return`
    <div id=${id}>
    ${
        url ? 
        `<img width='100%' src=${url} alt='card image' class='img-fluid place_holder_image mb-3'/>`
        : `<img width='100%' src="2.jpg" alt='card image' class='img-fluid place_holder_image mb-3'/>`
    }
    <strong class='text-muted text-sm'>
    Created on: ${date.toDateString()}
    </strong>
    <h5 class="my-3">${title}</h5>
<p class="trim-3-lines text-muted">${description}</p>
    </div>
    `;
};
//convert json to str(for local storage)
const updateLocalStorage=()=>{
    localStorage.setItem(
        "task",
        JSON.stringify({
            tasks:state.tasklist,
        })
    );

};

// load initial data_(for showing cards)
const LoadInitialData = () => {
    const localStorageData = localStorage.getItem("task"); // Use getItem to retrieve the data safely
    if (localStorageData) {
        const localStorageCopy = JSON.parse(localStorageData); // Parse the JSON string.

        state.tasklist = localStorageCopy.tasks; // Update state with the parsed tasks
        state.tasklist.map((cardData) => {
            taskcontent.insertAdjacentHTML("beforeend", htmltaskcontent({
                id: cardData.id,
                title: cardData.task, // Match key with what you are saving
                description: cardData.taskdesc, // Match key with what you are saving
                type: cardData.tags, // Match key with what you are saving
                url: cardData.url,
            }));
        });
    }
};




// event is here for submit
const handleSubmit=(event)=>{
    const id=`${Date.now()}`;
    const input={
          url:document.getElementById("imageUrl").value,
          task:document.getElementById("tasktitle").value,
          tags:document.getElementById("tasktype").value,
          taskdesc:document.getElementById("taskdesc").value,
        
        
    };
    if(input.task==="" || input.tags===""|| input.taskdesc===""){
        return alert("Please fill all the details Properly");
    }
    taskcontent.insertAdjacentHTML(
        "beforeend",
        htmltaskcontent({...input,id})
    );
    state.tasklist.push({...input,id});
    updateLocalStorage();
    window.location.reload();
};

const OpenTask = (e) => {
    if (!e) e = window.event;

    // Get the task ID
    const taskId = e.target.getAttribute("data-id") || e.target.parentElement.getAttribute("data-id");

    // Find the task in state
    const getTask = state.tasklist.find(({ id }) => id === taskId);

    if (getTask) {
        // Ensure proper key mapping for htmlModalcontent
        taskmodal.innerHTML = htmlModalcontent({
            id: getTask.id,
            title: getTask.task, // Use `task` key from state.tasklist
            description: getTask.taskdesc, // Use `taskdesc` key from state.tasklist
            url: getTask.url, // Use `url` key from state.tasklist
        });
    } else {
        console.error("Task not found for ID:", taskId);
    }
};


const deletecard = (e) => {
    if (!e) e = window.event;

    const targetId = e.target.getAttribute("name");

    state.tasklist = state.tasklist.filter(({ id }) => id !== targetId);

    updateLocalStorage();

    return e.target.parentNode.parentNode.parentNode.parentNode.removeChild(
        e.target.parentNode.parentNode.parentNode
    );
};

const editTask=(e)=>{
    if (!e) e = window.event;
    const targetId = e.target.id;
    const type =e.target.tagName;

    let parentNode;
    let taskTitle;
    let taskDesc;
    let taskTags;
    let submitButton;

    if(type==="BUTTON"){
        parentNode=e.target.parentNode.parentNode;

    }
    else{
        parentNode=e.target.parentNode.parentNode.parentNode;

    }
    

    // Tasktitle=parentNode.childNodes;
    //console.log(Tasktitle);
    taskTitle=parentNode.childNodes[3].childNodes[3];
    taskDesc=parentNode.childNodes[3].childNodes[5];
    taskTags=parentNode.childNodes[3].childNodes[7].childNodes[1];
    submitButton=parentNode.childNodes[5].childNodes[1];
    console.log(taskTitle,taskDesc,taskTags,submitButton);

    taskDesc.setAttribute("contenteditable","true");
    taskTags.setAttribute("contenteditable","true");
    taskTitle.setAttribute("contenteditable","true");
    submitButton.setAttribute("onclick","saveEdit()");
    console.log("button is clicked");
    submitButton.removeAttribute("data-bs-toggle");
    submitButton.removeAttribute("data-bs-target");
    submitButton.innerHTML="Save Changes";

};

const saveEdit = (e) => {
    if (!e) e = window.event;

    // Get the task ID
    const targetId = e.target.getAttribute("data-id"); // Use `data-id` to track task ID

    // Locate the parent card
    const parentNode = e.target.parentNode.parentNode;

    // Get the edited values from the card
    const taskTitle = parentNode.querySelector(".task_card_title").innerText;
    const taskDesc = parentNode.querySelector(".trim-3-lines").innerText;
    const taskTags = parentNode.querySelector(".badge").innerText;

    // Update the task in `state.tasklist`
    state.tasklist = state.tasklist.map((task) => {
        if (task.id === targetId) {
            return {
                ...task,
                task: taskTitle,
                taskdesc: taskDesc,
                tags: taskTags,
            };
        }
        return task;
    });

    // Update local storage
    updateLocalStorage();

    // Reset contenteditable to false
    parentNode.querySelector(".task_card_title").setAttribute("contenteditable", "false");
    parentNode.querySelector(".trim-3-lines").setAttribute("contenteditable", "false");
    parentNode.querySelector(".badge").setAttribute("contenteditable", "false");

    // Reset button functionality
    const submitButton = parentNode.querySelector("button[data-id]");
    submitButton.setAttribute("onclick", "OpenTask(event)");
    submitButton.setAttribute("data-bs-toggle", "modal");
    submitButton.setAttribute("data-bs-target", "#showTask");
    submitButton.innerHTML = "Open Task";

    console.log("Task updated successfully!");
};


const searchTask = (e) => {
    if (!e) e = window.event;

    // Get search input and convert to lowercase
    const searchInput = e.target.value.toLowerCase();

    // Clear existing task cards
    while (taskcontent.firstChild) {
        taskcontent.removeChild(taskcontent.firstChild);
    }

    // Filter tasks based on the search query
    const resultData = state.tasklist.filter(({ task }) =>
        task.toLowerCase().includes(searchInput)
    );

    // Render the filtered tasks
    resultData.map((cardData) => {
        taskcontent.insertAdjacentHTML(
            "beforeend",
            htmltaskcontent({
                id: cardData.id,
                title: cardData.task, // Match the saved key in `state.tasklist`
                description: cardData.taskdesc,
                type: cardData.tags,
                url: cardData.url,
            })
        );
    });

    // If no tasks match, show a "No results found" message
    if (resultData.length === 0) {
        taskcontent.innerHTML = `<p class="text-center text-muted">No tasks found.</p>`;
    }

};


