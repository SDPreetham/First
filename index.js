const state = {
taskList: [],
};
//DOM
const taskContents = document.querySelector(".task__contents");
const taskModal = document.querySelector(".task__modal__body");
const htmlTaskContent = ({id,title,description,type,url}) =>`
<div class='col-md-6 col-lg-4 mt-3' id=${id} key=${id}>
<div class='card shadow task__card'>
<div class='card-header d-flex gap-2 justify-content-end task__card__header'>
<button type='button' class ='btn btn-outline-info mr-2'name=${id} onclick="editTask.apply(this,arguments)"><i class='fas fa-pencil-alt'></i></button>
<button type='button' class ='btn btn-outline-danger mr-2'name=${id} onclick="deleteTask.apply(this,arguments)"><i class='fas fa-trash-alt'></i></button>
</div>
<div class='card-body'>
${
    url ?
    `<img src=${url} alt='card image' class='card-img-top md-3 rounded-md'/>`
    :
    `<img src=https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNZo8HJXlzsEbcnfi6ciTTC9I1SF8Pb0wY6A&usqp=CAU alt='card image' class='img-fluid rounded place__holder__image mb-3' />`
}
<h4 class='card-title'>${title}</h4>
<p class='card-text text-muted'>${description}</p>
<div class='tags d-flex flex-wrap'>
<span class='badge text-white bg-primary m-1'>${type}</span>
</div>
</div>
<div class='card-footer'> 
<button type='button' class='btn btn-outline-primary float-end' data-bs-toggle='modal' data-bs-target='#showTask' id=${id}   onclick='openTask.apply(this,arguments)'>Open Task</button>
</div>
</div>
</div>
`
const htmlModalContent = ({id,title,description,url}) =>{
    const date = new Date(parseInt(id));
    return `
<div id=${id}>
${
    url ?
    `<img src=${url} alt='card image' class='img-fluid rounded place__holder__image mb-3' />`
    :
    `<img src=https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNZo8HJXlzsEbcnfi6ciTTC9I1SF8Pb0wY6A&usqp=CAU alt='card image' class='img-fluid rounded place__holder__image mb-3' />`
}
<strong class='text-sm text-muted'>Created on ${date.toDateString()}</strong>
<h4 class='my-2'>${title}</h4>
<p class='text-muted'>${description}</p>
</div>    `
};

const updateLocalStorage = () =>{
localStorage.setItem('task',JSON.stringify({
tasks:state.taskList,
}));
};

const loadInitialData =()=>{
const localStorageCopy = JSON.parse(localStorage.task);
if(localStorageCopy) state.taskList = localStorageCopy.tasks;

state.taskList.map((cardDate)=>{
    taskContents.insertAdjacentHTML("beforeend",htmlTaskContent(cardDate));
});

};
const postSubmit = ()=>{
const id = `${Date.now()}`
const input = {
    url: document.getElementById('imageUrl').value,
    title:document.getElementById('tasktitle').value,
    description:document.getElementById('taskdesc').value,
    type:document.getElementById('tags').value,
};
if(input.title==='' || input.description==='' || input.type===''){
    return alert("Please fill out all the necessary fields");
}
taskContents.insertAdjacentHTML(
    "beforeend",htmlTaskContent({...input,id})
);
state.taskList.push({...input,id});
updateLocalStorage();
}
//Open modal from the cards
const openTask = (e) =>{
    if(!e) e = window.event;
    console.log("event",e);
    const getTask = state.taskList.find(({id})=>id===e.target.id);
    taskModal.innerHTML = htmlModalContent(getTask)
}

//CRUD => Delete operation
const deleteTask = (e)=>{
    if(!e) e = window.event;
    const targetID = e.target.getAttribute("name");
    //console.log(e.target);
    const type = e.target.tagName;
    //console.log(type);
    const removeTask = state.taskList.filter(({id})=> id!==targetID);
    //console.log(removeTask);
    state.taskList = removeTask;
    console.log("updated array",state.taskList);
    updateLocalStorage();

    if(type==="BUTTON"){
        console.log(e.target.parentNode.parentNode.parentNode);
        return e.target.parentNode.parentNode.parentNode.parentNode.removeChild(e.target.parentNode.parentNode.parentNode);
    };
    return e.target.parentNode.parentNode.parentNode.parentNode.parentNode.removeChild(e.target.parentNode.parentNode.parentNode.parentNode);
}

const editTask = (e) =>{
    if(!e) e=window.event;

    const targetID = e.target.id;
    const type = e.target.tagName;
    let parentNode;
    let taskTitle;
    let taskdesc;
   let submitButton;
    let taskType;
    if(type==="BUTTON"){
        parentNode = e.target.parentNode.parentNode;
       // console.log(parentNode);
    }else{
        parentNode = e.target.parentNode.parentNode.parentNode;
    }
    //The following two lines can be uncommented soas to know about childNodes
  //  taskTitle = parentNode.childNodes;
   // console.log(taskTitle);
   taskTitle = parentNode.childNodes[3].childNodes[3];
    taskdesc = parentNode.childNodes[3].childNodes[5];
    taskType = parentNode.childNodes[3].childNodes[7].childNodes[1];
   // console.log(taskTitle,taskdesc,taskType);
    submitButton = parentNode.childNodes[5].childNodes[1];
    //console.log(submitButton);
    taskTitle.setAttribute("contenteditable","true");
    taskdesc.setAttribute("contenteditable","true");
    taskType.setAttribute("contenteditable","true");
    submitButton.setAttribute('onclick',"saveEdit.apply(this,arguments)");
    submitButton.removeAttribute("data-bs-toggle");
    submitButton.removeAttribute("data-bs-target");
    submitButton.innerHTML = "Save Changes";
};
const saveEdit = (e) =>{
    if(!e) e=window.event;
    const targetID = e.target.id;
    const parentNode = e.target.parentNode.parentNode;
    //console.log(parentNode);
    const taskTitle = parentNode.childNodes[3].childNodes[3];
    const taskdesc = parentNode.childNodes[3].childNodes[5];
    const taskType = parentNode.childNodes[3].childNodes[7].childNodes[1];
    const submitButton = parentNode.childNodes[5].childNodes[1];

    const updateData = {
        taskTitle:taskTitle.innerHTML,
        taskdesc:taskdesc.innerHTML,
        taskType:taskType.innerHTML,
    };
    //update latest info on local array
    let state1 = state.taskList;
    state1 =state1.map((task)=>task.id===targetID 
    ? {
        id:task.id,
        title:updateData.taskTitle,
        description:updateData.taskdesc,
        type:updateData.taskType,
    }
      : task),
      
      
state.taskList = state1;
console.log(state.taskList);
updateLocalStorage();
taskTitle.setAttribute("contenteditable","false");
taskdesc.setAttribute("contenteditable","false");
taskType.setAttribute("contenteditable","false");



submitButton.setAttribute('onclick',"openTask.apply(this,arguments)");
    submitButton.setAttribute("data-bs-toggle","modal");
    submitButton.setAttribute("data-bs-target","#showTask");
    submitButton.innerHTML = "Open Task";
};
    
//Search Functionality
const searchTask= (e)=>{
    if(!e) e = window.event;

    while(taskContents.firstChild){
        taskContents.removeChild(taskContents.firstChild);
    }
    const resultData = state.taskList.filter(({title})=> title.includes(e.target.value));
    console.log(resultData);
    resultData.map((cardData)=>{
        taskContents.insertAdjacentHTML("beforeend",htmlTaskContent(cardData));
    });
}