const projectsFolder = [
    {
        name: "3x3_Macropad_Schematic",
        category: "Hardware",
        extension: ".md"
    },
    {
        name: "Privilege_Escalation_Notes",
        category: "Cybersecurity",
        extension: ".md"
    },
    {
        name: "Ghazal_Draft_01",
        category: "Creative Writing",
        extension: ".md"
    }
];

document.addEventListener('DOMContentLoaded', () => {
    
    const welcomeDiv = document.getElementById("welcome");
    welcomeDiv.style.position = "absolute";
    
    makeDraggable(welcomeDiv);

    const testWindow = document.getElementById("projects-window");
    if (testWindow) {
        testWindow.style.display = "block"; 
        makeDraggable(testWindow);
        createFiles(projectsFolder);
    }

    setInterval(updateTime, 1000);
});

function createFiles(array) {
    const contentContainer = document.getElementById("projects-content");
    contentContainer.innerHTML = ""; 

    array.forEach(function(file) { 
        const rowHTML = `
            <div style="display: flex; justify-content: space-between; padding: 5px; border-bottom: 1px solid black;">
                <span>📄 ${file.name}${file.extension}</span>
                <span>${file.category}</span>
            </div>
        `;
        contentContainer.innerHTML += rowHTML;
    });
}

function makeDraggable(element) {
    let initialX = 0, initialY = 0;
    
    const header = document.getElementById(element.id + "-header");
    if (header) {
        header.onmousedown = dragMouseDown;
    } else {
        element.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e.preventDefault();
        initialX = e.clientX;
        initialY = e.clientY;
        
        document.onmouseup = stopDragging;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e.preventDefault();
        
        const deltaX = initialX - e.clientX;
        const deltaY = initialY - e.clientY;
        
        
        element.style.top = (element.offsetTop - deltaY) + "px";
        element.style.left = (element.offsetLeft - deltaX) + "px";
        
        
        initialX = e.clientX;
        initialY = e.clientY;
    }

    function stopDragging() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

function updateTime() {
    const timeText = document.querySelector("#time-element");
    if(timeText) {
        timeText.innerHTML = new Date().toLocaleString();
    }
}
