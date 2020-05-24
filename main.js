let inputName = null
let currentIndex = null
let isEditing = false

let globalTasks = JSON.parse(localStorage.getItem('list_todos')) || []

window.addEventListener('load', () => {
    inputName = document.querySelector('#inputName')

    preventDefaultFormSubmit()
    activateInput()
    render()
})

const preventDefaultFormSubmit = () => {
    const handleFormSubmit = e => e.preventDefault()
    
    const form = document.querySelector('form')
    form.addEventListener('submit', handleFormSubmit)
}

const saveTasks = () => localStorage.setItem('list_todos', JSON.stringify(globalTasks))

const activateInput = () => {
    const insertTask = newTask => {
        globalTasks = [...globalTasks, newTask]
        saveTasks()
        render()
    }

    const updateTask = newTask => {
        globalTasks[currentIndex] = newTask
        saveTasks()
        render()
    }

    const handleTyping = (e) => {
        if(e.keyCode == 13 && inputName.value !== '') {
            if(isEditing) {
                updateTask(e.target.value )
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

const render = () => {
    const createSpanTask = (task, index) => {
        const editItem = () => {
            inputName.value = task
            inputName.focus()
            isEditing = true
            currentIndex = index
        }

        const span = document.createElement('span')
        span.classList.add('clickable')
        span.textContent = task

        span.addEventListener('click', editItem)


        return span
    }

    const createDeleteButton = index => {
        const deleteTask = () => {
            globalTasks = globalTasks.filter((_, i) => i !== index)
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

        const messageHelpText = () => {
            textExplained.classList.add('helpText')
            textExplained.textContent = `Clique para editar ${currentTask}`
            
            li.appendChild(textExplained)

            return textExplained
        }

        const clearMessageHelpText = () => {
            textExplained.textContent = ''
        } 

        const messageHelpTextButton = () => {
            textExplained.classList.add('helpText')
            textExplained.textContent = `Double click para deletar ${currentTask}`
            
            li.appendChild(textExplained)

            return textExplained
        }

        const clearMessageHelpTextButton = () => {
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

const clearInput = () => {
    inputName.value = ''
    inputName.focus()
}