window.addEventListener('load', start)

const globalTasks = JSON.parse(localStorage.getItem('list_todos')) || []

let inputName = null
let currentIndex = null
let isEditing = false

function start() {
    inputName = document.querySelector('#inputName')

    preventDefaultFormSubmit()
    activateInput()
    render()
}

function preventDefaultFormSubmit() {
    function handleFormSubmit(e){
        e.preventDefault()       
    }
    
    const form = document.querySelector('form')
    form.addEventListener('submit', handleFormSubmit)
}

function saveTasks() {
    localStorage.setItem('list_todos', JSON.stringify(globalTasks))
}

function activateInput() {
    function insertTask(newTask) {
        globalTasks.push(newTask)
        saveTasks()
        render()
    }

    function updateTask(newTask) {
        globalTasks[currentIndex] = newTask
        render()
    }

    function handleTyping(e) {
        if(e.keyCode == 13 && inputName.value !== '') {
            if(isEditing) {
                updateTask(e.target.value )
                console.log('editing')
            } else {
                let typedTask = e.target.value 
                insertTask(typedTask)
            }
            isEditing = false
            clearInput()
        }
    }

    inputName.focus()
    inputName.addEventListener('keyup', handleTyping)
}

function render() {
    function createSpanTask(task, index) {
        function editItem() {
            inputName.value = task
            inputName.focus()
            isEditing = true
            currentIndex = index
            console.log(currentIndex)

        }


        const span = document.createElement('span')
        span.classList.add('clickable')
        span.textContent = task

        span.addEventListener('click', editItem)


        return span
    }

    function createDeleteButton(index) {
        
        function deleteTask() {
            globalTasks.splice(index, 1)
            saveTasks()
            render()
        }

        const button = document.createElement('a')
        button.classList.add('button')
        button.classList.add('clickable')
        button.textContent = 'Excluir'

        button.addEventListener('dblclick', deleteTask)

        return button
    }

    const divTasks = document.querySelector('#tasks')
    divTasks.innerHTML = ''

    const ul = document.createElement('ul')
    
    for (task of globalTasks) {
        let currentTask = task

        let i = globalTasks.indexOf(task)

        const li = document.createElement('li')
        const button = createDeleteButton(i)

        const span = createSpanTask(currentTask, i)

        const textExplained = document.createElement('span')

        li.appendChild(button)
        li.appendChild(span)
        
        function messageHelpText() {
            textExplained.classList.add('helpText')
            textExplained.textContent = `Clique para editar ${currentTask}`
            
            li.appendChild(textExplained)

            return textExplained
        }

        function clearMessageHelpText() {
            textExplained.textContent = ''
        }

        function messageHelpTextButton() {
            textExplained.classList.add('helpText')
            textExplained.textContent = `Double click para deletar ${currentTask}`
            
            li.appendChild(textExplained)

            return textExplained
        }

        function clearMessageHelpTextButton() {
            textExplained.textContent = ''
        }

        span.addEventListener('mouseover', messageHelpText)

        span.addEventListener('mouseleave', clearMessageHelpText)

        button.addEventListener('mouseover', messageHelpTextButton)

        button.addEventListener('mouseleave', clearMessageHelpTextButton)

        ul.appendChild(li)
    }

    divTasks.appendChild(ul)
    clearInput()
}

function clearInput() {
    inputName.value = ''
    inputName.focus()
}