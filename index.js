document.querySelectorAll('.social-links a').forEach(link => {
    link.addEventListener('mouseover', () => {
        console.log('Mouse over');
        link.querySelector('.social-logo').classList.add('hovered');
    });
    link.addEventListener('mouseout', () => {
        console.log('Mouse out');
        link.querySelector('.social-logo').classList.remove('hovered');
    });
});

const fileSystem = {
    home: {
        nathan: {
            "portfolio": {
                "about.txt": "I am a software dev focused on building both my front and back end skills :)",
                "contact_me.txt": "Email: nathan.wigley@hotmail.com",
                "projects":{
                    "portfolio.txt": "I built this portfolio all by myself! See it on my [[b;#50e0ff;]GitHub]",
                    "crl_database.txt": "With a team of peers, I helped build a UI to\nstreamline univeristy admissions"
                },
            },
        }
    }
};

let currentPath = ["home", "nathan", "portfolio"];

function getPath(path) {
    return path.reduce((acc, dir) => {
        if (dir in acc) {
            return acc[dir];
        } else {
            throw new Error('Directory not found');
        }
    }, fileSystem);
}

function ls() {
    const path = getPath(currentPath);
    const items = Object.keys(path).map(item => {
        const color = item.endsWith('.txt') ? '#33cc33' : '#ffffff';

        if (typeof path[item] === 'object') {
            return '[[b;#50e0ff;]/' + item + ']';
        } else {
            return `[[b;${color};]${item}]`;
        }
    });

    const maxLength = items.reduce((max, item) => Math.max(max, item.length), 0);
    const columnWidth = maxLength + 4;
    const numColumns = Math.floor($('#terminal').width() / columnWidth);

    let output = '';
    for (let i = 0; i < items.length; i++) {
        output += items[i].padEnd(columnWidth);
        if ((i + 1) % numColumns === 0 || i === items.length - 1) {
            output += '\n';
        }
    }

    return output;
}


function cd(dir) {
    if (dir === '..') {
        if (currentPath.length > 1) {
            currentPath.pop();
        }
    } else if (dir === '/') {
        currentPath = ['home', 'nathan'];
    } else {
        try {
            getPath([...currentPath, dir]);
            currentPath.push(dir);
        } catch (error) {
            return error.message;
        }
    }
    this.set_prompt('nathan:' + currentPath.join('/') + '> ');
    return '';
}

function pwd() {
    return '/' + currentPath.join('/') + '/';
}

function mkdir(dirName) {
    const path = getPath(currentPath);
    if (!(dirName in path)) {
        path[dirName] = {};
        return '';
    } else {
        return 'Directory already exists';
    }
}

function cat(filename) {
    const path = getPath(currentPath);
    if (filename in path) {
        return path[filename];
    } else {
        return 'File not found';
    }
}

function isValidExtension(fileName) {
    const validExtensions = ['txt', 'js', 'html', 'css', 'py'];
    const extension = fileName.split('.').pop();
    return validExtensions.includes(extension);
}

function touch(fileName) {
    if (!isValidExtension(fileName)) {
        return 'Invalid file extension';
    }
    const path = getPath(currentPath);
    if (!(fileName in path)) {
        path[fileName] = 'Empty file';
        return '';
    } else {
        return 'File already exists';
    }
}

function rm(fileName) {
    const path = getPath(currentPath);
    if (fileName in path) {
        delete path[fileName];
        return '';
    } else {
        return 'File not found';
    }
}

function echo(message) {
    return message;
}

function help() {
    return "Available commands:\n" +
           " - ls: Lists a directory’s content\n" +
           " - pwd: Shows the current working directory’s path\n" +
           " - cd [directory]: Changes the working directory\n" +
           " - mkdir [directory]: Creates a new directory\n" +
           " - rm [file]: Deletes a file\n" +
           " - touch [file]: Creates a new empty file\n" +
           " - cat [file]: Lists, combines, and writes a file’s content as a standard output\n" +
           " - echo [message]: Prints a message\n" +
           " - whoami: Returns user's identity\n" +
           " - hello [name]: Sample greeting command\n" +
           " - clear: Clears the terminal\n" +
           " - help: Lists available commands";
}

function whoami() {
    return "Hi, I'm Nathan!";
}

function whereami() {
    return '/' + currentPath.join('/') + '/';
}

function typeStutteredName() {
    const nameElement = document.getElementById('stuttered-name');
    const fullName = 'Nathan Wigley';
    let currentText = '';
    const cursorSpan = document.createElement('span');
    cursorSpan.classList.add('cursor');
    nameElement.appendChild(cursorSpan);

    function typeLetter(index) {
        if (index < fullName.length) {
            currentText += fullName[index];
            nameElement.textContent = currentText;
            nameElement.appendChild(cursorSpan);
            setTimeout(() => typeLetter(index + 1), Math.random() * 300 + 200);
        } else {
            setTimeout(() => {
                currentText = '';
                nameElement.textContent = '';
                nameElement.appendChild(cursorSpan);
                typeLetter(0);
            }, Math.random() * 3000 + 5000);
        }
    }
    setTimeout(() => typeLetter(0), 2000);
}
let editingFile = null;
let isVimMode = false;
let vimCommand = '';

function vi(filename) {
    const path = getPath(currentPath);
    if (filename in path) {
        document.getElementById('editor-content').value = path[filename];
        document.getElementById('text-editor').style.display = 'block';
        document.getElementById('vim-hint').textContent = 'INSERT MODE';
        $('#terminal').hide();
        editingFile = filename;
        isVimMode = false;
    } else {
        return 'File not found';
    }
}

function handleVimCommands(key) {
    if (vimCommand === ':wq') {
        saveFile();
        closeEditor();
        $('#terminal').show();
        vimCommand = '';
        isVimMode = false;
    } else if (vimCommand.startsWith(':') && key === 'Enter') {
        document.getElementById('vim-hint').textContent = 'Unrecognized command: ' + vimCommand;
        vimCommand = '';
        isVimMode = false;
    } else if (key === 'Enter') {
        vimCommand = '';
        isVimMode = false;
    }
}

function saveFile() {
    if (!editingFile) return;

    const editorContent = document.getElementById('editor-content').value;
    let path = fileSystem;
    for (let dir of currentPath) {
        path = path[dir];
    }
    path[editingFile] = editorContent;
    document.getElementById('vim-hint').textContent = 'File saved';
}

function closeEditor() {
    document.getElementById('text-editor').style.display = 'none';
    editingFile = null;
    isVimMode = false;
    vimCommand = '';
    $('#terminal').show();
    document.getElementById('vim-hint').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', typeStutteredName);
document.addEventListener('DOMContentLoaded', typeStutteredName);
document.addEventListener('DOMContentLoaded', typeStutteredName);

document.getElementById('text-editor').addEventListener('keydown', function(e) {
    if (e.key === 'Shift') {
        return;
    }
    if (e.key === 'Escape') {
        isVimMode = !isVimMode;
        document.getElementById('vim-hint').textContent = isVimMode ? 'COMMAND MODE' : 'INSERT MODE';
        e.preventDefault();
    } else if (isVimMode) {
        e.preventDefault();
        if (e.key === 'i') {
            isVimMode = false;
            vimCommand = '';
            document.getElementById('vim-hint').textContent = 'INSERT MODE';
            return;
        }
        if (e.key !== 'Enter') {
            vimCommand += e.key;
            document.getElementById('vim-hint').textContent = `COMMAND: ${vimCommand}`;
        } else {
            executeVimCommand(vimCommand);
            vimCommand = '';
            isVimMode = false;
        }
    }
});

function executeVimCommand(command) {
    switch (command) {
        case ':wq':
            saveFile();
            closeEditor();
            $('#terminal').show();
            break;
        case ':q':
            closeEditor();
            $('#terminal').show();
            break;
        case ':w':
            saveFile();
            document.getElementById('vim-hint').textContent = 'File saved';
            break;
        default:
            document.getElementById('vim-hint').textContent = `Unknown command: ${command}`;
            break;
    }
}

$(document).ready(function() {
    $('#terminal').terminal({
        hello: function(what) {
            this.echo('Hello, ' + what + '. Welcome to Nathan Wigley\'s terminal.');
        },
        ls: ls,
        cd: cd,
        cat: cat,
        whoami: whoami,
        help: help,
        pwd: pwd,
        mkdir: mkdir,
        touch: touch,
        rm: rm,
        echo: echo,
        vi: vi, // need this to act like the vim editor
    }, {
        greetings: '[[;#FFDB58;]Nathan\'s Interactive Terminal]\nType "help" to see the list of commands.',
        prompt: 'nathan/home/portfolio> ',
        onKeydown: function(e, term) {
            if (e.key === 'Tab') {
                e.preventDefault();
                const commandLine = term.get_command();
                const parts = commandLine.split(' ');
                const lastPart = parts[parts.length - 1];
        
                if (parts[0] === 'cd') {
                    try {
                        const path = getPath(currentPath);
                        const dirSuggestions = Object.keys(path).filter(item => 
                            typeof path[item] === 'object' && item.startsWith(lastPart)
                        );
        
                        if (dirSuggestions.length === 1) {
                            parts[parts.length - 1] = dirSuggestions[0];
                            term.set_command(parts.join(' '));
                        } else if (dirSuggestions.length > 1) {
                            term.echo(dirSuggestions.join(' '));
                        }
                    } catch (error) {
                        term.echo(error.message);
                    }
                } else {
                    try {
                        const path = getPath(currentPath);
                        suggestions = Object.keys(path).filter(item => item.startsWith(lastPart));
                    } catch (error) {
                        term.echo(error.message);
                    }
                }
                if (suggestions.length === 1) {
                    parts[parts.length - 1] = suggestions[0];
                    term.set_command(parts.join(' '));
                } else if (suggestions.length > 1) {
                    term.echo(suggestions.join(' '));
                }
            }
        }
    });
});