const fileSystem = {
    projects: [
        { name: "3x3_Macropad_Schematic", category: "Hardware", extension: ".md" },
        { name: "Privilege_Escalation_Notes", category: "Cybersecurity", extension: ".md" }
    ],
    hardware: [
        { name: "PCB_Traces_V2", category: "Engineering", extension: ".kicad_pcb" },
        { name: "Bill_of_Materials", category: "Planning", extension: ".csv" }
    ],
    roblox: [
        { name: "Backflip", category: "Animation", extension: ".mov" },
        { name: "Haunted_House", category: "Build", extension: ".rblx" }
    ],
    Zayd: [
        { name: "Backflip", category: "Animation", extension: ".mov" },
        { name: "Haunted_House", category: "Build", extension: ".rblx" }
    ]
};

document.addEventListener('DOMContentLoaded', () => {
    const testWindow = document.getElementById("projects-window");
    
    createFolders();

    setInterval(updateTime, 1000);
});

function createFiles(element, array) {
    const contentContainer = element.querySelector(".content-container")
    
    if (!contentContainer) return;

    contentContainer.innerHTML = ""; 

    array.forEach(function(file) { 
        const rowHTML = `
            <div style="display: flex; justify-content: space-between; padding: 5px; border-bottom: 1px solid black;">
                <span>📄 ${file.name}${file.extension}</span>
                <span>${file.category}</span>
            </div>
        `;
        contentContainer.innerHTML += rowHTML;
    })
}

function makeDraggable(element) {
    let initialX = 0, initialY = 0;
    
    const header = element.querySelector(".window-header");
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

function createFolders() {
    const desktop = document.querySelector(".desktop");
    if (!desktop) return;

    const folderNames = Object.keys(fileSystem);

    folderNames.forEach((name) => {
        const folderHTML = `
            <div class="folder-icon" id="${name}">
                <div>📁</div>
                <span>${name.charAt(0).toUpperCase() + name.slice(1)}</span>
            </div>
        `;
        desktop.innerHTML += folderHTML;
    });
    setupFolders();
}

function setupFolders() {
    const folders = document.querySelectorAll(".folder-icon");

    folders.forEach((folder) => {
        folder.addEventListener("dblclick", () => {
            
            const newID = folder.id + "-window";
            if (!document.getElementById(newID)) {
                const temp = document.querySelector(".window-template");
                const clon = temp.content.cloneNode(true).firstElementChild;

                clon.id = newID;
                clon.style.display = "block";
                const path = clon.querySelector(".text-bold");
                path.innerHTML = "/home/" + folder.id;
                document.body.appendChild(clon);

                createFiles(clon, fileSystem[folder.id]);
                makeDraggable(clon);
                
                const closeBtn = clon.querySelector("#close-window-button");
                if (closeBtn) {
                    closeBtn.addEventListener("click", () => {
                        clon.remove();
                    });
                }
            }
        });
    });
}
