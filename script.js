let highestZ = 10;

const fileSystem = {
    Digital_Art: [
        { name: "Photoshop", category: "Art", extension: ".md", url: "./videos/demo.mp4" },
        { name: "Blender", category: "Art", extension: ".md", url:"./markdown/BPCS.md" }
    ],
    Hardware: [
        { name: "PCB_Traces_V2", category: "Engineering", extension: ".png", url:"./images/capybara.png" },
        { name: "Bill_of_Materials", category: "Planning", extension: ".csv" }
    ],
    Roblox: [
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
    const contentContainer = element.querySelector(".content-container");
    if (!contentContainer) return;

    contentContainer.innerHTML = ""; 

    array.forEach((file) => { 
        const fileRow = document.createElement("div");
        fileRow.style.cssText = `
            display: flex; 
            justify-content: space-between; 
            padding: 5px; 
            border-bottom: 1px solid black; 
            cursor: pointer;
        `;
        
        fileRow.innerHTML = `
            <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; padding-right: 10px;">
                📄 ${file.name}${file.extension}
            </span>
            <span style="white-space: nowrap; flex-shrink: 0;">
                ${file.category}
            </span>
        `;

        fileRow.addEventListener("mouseover", () => fileRow.style.backgroundColor = "#eee");
        fileRow.addEventListener("mouseout", () => fileRow.style.backgroundColor = "transparent");

        fileRow.addEventListener("dblclick", () => {
            const newID = file.name + "-app";
            if (document.getElementById(newID)) return;

            const temp = document.querySelector(".app-template");
            const clon = temp.content.cloneNode(true).firstElementChild;

            clon.id = newID;
            clon.style.display = "block";
            highestZ ++;
            clon.style.zIndex = highestZ;
            
            clon.querySelector(".app-title").textContent = file.name;

            const iframe = clon.querySelector(".app-iframe");

            if (file.extension == ".md") {
                fetch(file.url)
                    .then(response => response.text())
                    .then(markdownText => {
                        const htmlContent = marked.parse(markdownText);
                        const styledHTML = `
                            <!DOCTYPE html>
                            <html>
                            <head>
                                <style>
                                    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; line-height: 1.6; color: #333; padding: 20px; }
                                    h1, h2 { border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; margin-top: 24px; }
                                    code { background-color: #f6f8fa; padding: 0.2em 0.4em; border-radius: 6px; font-family: monospace; font-size: 0.9em; }
                                    pre { background-color: #f6f8fa; padding: 16px; border-radius: 6px; overflow: auto; }
                                    pre code { background-color: transparent; padding: 0; }
                                    blockquote { border-left: 4px solid #dfe2e5; color: #6a737d; padding: 0 1em; margin-left: 0; }
                                    img { max-width: 100%; border-radius: 6px; }
                                </style>

                                <script>
                                    MathJax = {
                                        tex: {
                                            inlineMath: [['$', '$'], ['\\\\(', '\\\\)']],
                                            displayMath: [['$$', '$$'], ['\\\\[', '\\\\]']]
                                        }
                                    };
                                </script>
                                <script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
                            </head>
                            <body>
                                ${htmlContent}
                            </body>
                            </html>
                        `;

                        iframe.srcdoc = styledHTML;
                    })
                    .catch(error => {
                        iframe.srcdoc = `
                        <html>
                            <body style='font-family:sans-serif; padding:20px;'>
                                <h3>Error loading Markdown file.</h3>
                                <p>Make sure the file exists and you are running this on a live server (like GitHub Pages).</p>
                            </body>
                        </html>`;
                    });
            } else if ([".png", ".jpg", ".jpeg", ".gif", ".webp"].includes(file.extension)) {
                const photoHTML = `
                    <!DOCTYPE html>
                    <html style="height: 100%; margin: 0;">
                    <body style="margin: 0; height: 100%; background-color: #1a1a1a; display: flex; justify-content: center; align-items: center; overflow: hidden;">
                        <img src="${file.url}" style="max-width: 95%; max-height: 95%; object-fit: contain; box-shadow: 0 10px 25px rgba(0,0,0,0.5); border-radius: 4px;">
                    </body>
                    </html>
                `;
                iframe.srcdoc = photoHTML;

            } else if ([".mp4", ".webm", ".mov"].includes(file.extension)) {
                const videoHTML = `
                    <!DOCTYPE html>
                    <html style="height: 100%; margin: 0;">
                    <body style="margin: 0; height: 100%; background-color: #000; display: flex; justify-content: center; align-items: center; overflow: hidden;">
                        <video controls autoplay style="max-width: 100%; max-height: 100%; object-fit: contain;">
                            <source src="${file.url}">
                            Your browser does not support HTML5 video.
                        </video>
                    </body>
                    </html>
                `;
                iframe.srcdoc = videoHTML;

            } else {
                iframe.src = file.url;
            }

            document.body.appendChild(clon);
            centerWindow(clon); 
            makeDraggable(clon);
            
            const closeBtn = clon.querySelector(".close-window-button");
            if (closeBtn) {
                closeBtn.addEventListener("click", () => clon.remove());
            }
        });
        contentContainer.appendChild(fileRow);
    });
}

function makeDraggable(element) {
    let initialX = 0, initialY = 0;

    element.addEventListener("mousedown", (e) => {
        if (e.target.closest(".window-buttons")) return;
        highestZ += 1;
        element.style.zIndex = highestZ;
    });
    
    const header = element.querySelector(".window-header");
    if (header) {
        header.onmousedown = dragMouseDown;
    } else {
        element.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {

        if (e.target.closest(".window-buttons")) return;

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
            if (document.getElementById(newID)) return;
            const temp = document.querySelector(".window-template");
            const clon = temp.content.cloneNode(true).firstElementChild;

            highestZ ++;
            clon.style.zIndex = highestZ;

            clon.id = newID;
            clon.style.display = "block";
            const path = clon.querySelector(".text-bold");
            path.innerHTML = "/home/" + folder.id;
            document.body.appendChild(clon);

            createFiles(clon, fileSystem[folder.id]);
            centerWindow(clon); 
            makeDraggable(clon);
            
            const closeBtn = clon.querySelector(".close-window-button");
            if (closeBtn) {
                closeBtn.addEventListener("click", () => {
                    clon.remove();
                });
            }
            
        });
    });
}

function centerWindow(element) {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const windowWidth = element.offsetWidth || 400;
    const windowHeight = element.offsetHeight || 300;

    const centerX = (viewportWidth / 2) - (windowWidth / 2);
    const centerY = (viewportHeight / 2) - (windowHeight / 2);

    const randomOffset = Math.floor(Math.random() * 30);
    element.style.left = (centerX + randomOffset) + "px";
    element.style.top = (centerY + randomOffset) + "px";
}