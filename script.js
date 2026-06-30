const fileSystem = {
    projects: [
        { name: "3x3_Macropad_Schematic", category: "Hardware", extension: ".md" },
        { name: "Privilege_Escalation_Notes", category: "Cybersecurity", extension: ".md" }
    ],
    hardware: [
        { name: "PCB_Traces_V2", category: "Engineering", extension: ".kicad_pcb" },
        { name: "Bill_of_Materials", category: "Planning", extension: ".csv" }
    ]
};

document.addEventListener('DOMContentLoaded', () => {
    
    // const welcomeDiv = document.getElementById("welcome");
    // welcomeDiv.style.position = "absolute";
    
    // makeDraggable(welcomeDiv);

    const testWindow = document.getElementById("projects-window");
    
    setupFolders();

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

function setupFolders() {
    const folder = document.querySelector(".folder-icon");
    if (folder) {
        const projectsWindow = document.getElementById("projects-window");
        folder.addEventListener("dblclick", () => {
            if (projectsWindow) {
                projectsWindow.style.display = "block";
                makeDraggable(projectsWindow);
                createFiles(projectsFolder);
            }
        });
        const button = document.getElementById("close-window-button");
        if (button) {
            button.addEventListener("click", () => {
                projectsWindow.style.display = "none";
            });
        }
    }
}
