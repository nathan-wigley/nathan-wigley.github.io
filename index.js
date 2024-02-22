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
            "about.txt": "I am a software developer...",
            projects: {
                "project1.txt": "Project 1 details...",
                "project2.txt": "Project 2 details..."
            },
            "contact.txt": "Email: nathan.wigley@hotmail.com"
        }
    }
};

let currentPath = ["home", "nathan"];

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
    return Object.keys(path).join('\n');
}

function cd(dir) {
    if (dir === '..' || dir === undefined) {
        if (currentPath.length > 1) {
            currentPath.pop();
        }
    } else {
        try {
            getPath([...currentPath, dir]);
            currentPath.push(dir);
        } catch (error) {
            return error.message;
        }
    }
    return '';
}

function cat(filename) {
    const path = getPath(currentPath);
    if (filename in path) {
        return path[filename];
    } else {
        return 'File not found';
    }
}
function whoami() {
    return "Hi, I'm Nathan!";
}

function whereami() {
    return '/' + currentPath.join('/') + '/';
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
        whereami: whereami
    }, {
        greetings: 'Nathan Wigley\'s Interactive Terminal',
        prompt: 'nathan> ',
    });
});
