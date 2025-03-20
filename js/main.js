Vue.component('create-task', {
    props:{
        modalCreate:{
            type: Boolean,
            required: true
        }

    },
    template: `
        <div class="back-create">
            <div class="createBlockTask">
                <form class="block">
                    <label for="title" class="textInBlock">Title</label>
                    <input type="text" v-model="title" required placeholder="Заголовок">
                    
                    <textarea v-model="comment" cols="30" rows="10" placeholder="Введите задачу" style="max-width: 320px; max-height: 320px"></textarea>

                    <input type="date" placeholder="Какая дата заплонирована?" v-model="planDate">
                    <label for="">Выберите приоритет</label>
                    <select v-model="property">
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                    </select>
                    
                    <div>
                        <button @click="onSubmit" :disabled="comment.length === 0" >отправить</button>
                        <button @click="$emit('close-crated')">Закрыть</button>
                    </div>
                </form>
            </div>
        </div>    
    `,
    data() {
        return {
            title: '',
            steps: [],
            completedDate: '',
            createDate: '',
            TableTasks: 1,
            planDate: '',
            comment: '',
            property: 0
        };
    },
    methods: {
        onSubmit() {
            let hasOnlySpaces = this.steps.some(step => step.text.trim() === '');
            if (hasOnlySpaces) {
                alert("Ошибка, нельзя писать только пробелы.");

            }else{
                this.createDate = new Date().toLocaleString()
                    let task = {
                        title: this.title,
                        steps: this.steps,
                        completedDate: this.completedDate,
                        createDate: this.createDate,
                        TableTasks: this.TableTasks,
                        planDate: new Date(this.planDate),
                        property: this.property,
                        comment: this.comment
                    };
                    this.$emit('task-created', task);
                    this.title = '';
                    this.steps = [];

            }
            this.closeAndOpen()

        },
        closeAndOpen(){
            this.$emit('close-crated', this.modalCreate = false)
        },
        addStep() {
            if (this.steps.length === 0) {
                for (let i = 0; i < 3; i++) {
                    this.steps.push({ text: '', done: false });
                }
            } else if (this.steps.length < 5) {
                this.steps.push({ text: '', done: false });
            }
        },
        removeStep() {
            if (this.steps.length > 0) {
                this.steps.pop();
            }
        }
    }
});


Vue.component('four-task-list', {
    props: {
        tasks: {
            type: Array,
            required: true
        }
    },
    template: `
        <div class="task-list">
            <h2>Завершенные задачи</h2>
            <div v-for="(task, index) in tasks" :key="index" v-if="thirdTaskIf(task)" class="block-task-third">
                <strong>{{ task.title }}</strong>
                
                <div>
                    <p>{{ task.comment }}</p>
                </div>
                
                <p v-if="task.completionDate <= task.planDate">Вы успели вовремя</p>
                <p v-else >Просрочено :(</p>
            </div>
        </div>
    `,
    methods: {
        thirdTaskIf(task) {

            if (task.TableTasks === 4) {
                if (!task.completionDate) {
                    task.completionDate = new Date();
                    localStorage.setItem("tasks", JSON.stringify(this.tasks));
                }
            }

            return task.TableTasks === 4;
        }
    }
});

Vue.component('third-task-list', {
    props: {
        tasks: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            redactTaskIndex: null,
            steps: [],
        };
    },
    template: `
        <div class="task-list">
            <h2>Тестирование</h2>
            <div v-for="(task, index) in tasks" :key="index" class="block-task-first" v-if="task.TableTasks === 3">
                
                    <strong>{{ task.title }}</strong>
                    <div>
                        <p>{{ task.comment }}</p>
                    </div>
                    
                
                <b class="text-date">Дата создания: {{ task.createDate }}</b>
                <b class="text-date" v-if="task.lastModified">Последнее изменение: {{ task.lastModified }}</b>
                <div>       
                    <textarea v-model="steps" cols="13" rows="5" placeholder="Оставьте комментарий" style="max-width: 110px"></textarea>
                    <button @click="comment(task)" class="button text-but">comment and left</button>
                    <button @click="changeTable(task, 1)" :disabled="task.TableTasks === 4" class="button bg-3">➡️</button>
                </div>
                <ol>
                        <li v-for="(step, stepIndex) in task.steps" :key="stepIndex">
                        <p>{{ step }}</p>
                    </li>
                    </ol>
            </div>
        </div>
    `,
    methods: {
        comment(task) {
            if (this.steps.trim()) {
                task.steps.push(this.steps);
                this.steps = '';
                localStorage.setItem("tasks", JSON.stringify(this.tasks));
                this.changeTable(task, -1)
            } else {
                alert('Пожалуйста, введите комментарий.');
            }
        },
        changeTable(task, direction) {
            task.TableTasks += direction;
            localStorage.setItem("tasks", JSON.stringify(this.tasks));
        },
        selectStep(step) {
            step.done = !step.done;
        },
        editTask(index) {
            this.redactTaskIndex = index;
        },
        saveTask(index) {
            this.redactTaskIndex = null;
            this.tasks[index].lastModified = new Date().toLocaleString();
            localStorage.setItem("tasks", JSON.stringify(this.tasks));
        },
        cancelEdit() {
            this.redactTaskIndex = null;
        },
        deleteTask(index) {
            this.tasks.splice(index, 1);
            localStorage.setItem("tasks", JSON.stringify(this.tasks));
        }
    },
    watch: {
        tasks: {
            handler(newTasks) {
                localStorage.setItem("tasks", JSON.stringify(newTasks));
            },
            deep: true
        }
    }
});



Vue.component('second-task-list', {
    props: {
        tasks: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            redactTaskIndex: null,


        };
    },
    template: `
        <div class="task-list">
            <h2>Задачи в работе</h2>
            <div v-for="(task, index) in tasks" :key="index" class="block-task-second" v-if="task.TableTasks === 2">
            
                <div v-if="redactTaskIndex === index">
                    <input v-model="task.title" />
                    <button @click="saveTask(index)">Сохранить</button>
                    <button @click="cancelEdit">Отменить</button>
                </div>
                <div v-else>
                    <strong>{{ task.title }}</strong>
                    <button @click="editTask(index)">Редактировать</button>
                    <button @click="deleteTask(index)">Удалить</button>
                </div>                    
                        <div v-if="redactTaskIndex === index">
                            <input v-model="task.comment" />
                        </div>
                        <div v-else>
                            <div>
                                <p>{{ task.comment }}</p>
                            </div>
                        </div>
                <b class="text-date">Дата создания: {{ task.createDate }}</b>
                <b class="text-date">Последнее изменение: {{ task.lastModified }}</b>
                <div>    
                    <button @click="changeTable(task, -1)" :disabled="task.TableTasks === 1" class="button bg-2">⬅️</button>
                    <button @click="changeTable(task, 1)" :disabled="task.TableTasks === 4" class="button bg-2">➡️</button>
                </div>
                <div>
                    <ol>
                        <li v-for="(step, stepIndex) in task.steps" :key="stepIndex">
                        <p>{{ step }}</p>
                    </li>
                    </ol>
                </div>
            </div>
        </div>
    `,
    methods: {
        changeTable(task, direction) {
            task.TableTasks += direction;
            localStorage.setItem("tasks", JSON.stringify(this.tasks));
        },
        selectStep(step) {
            step.done = !step.done;
        },
        editTask(index) {
            this.redactTaskIndex = index;
        },
        saveTask(index) {
            this.redactTaskIndex = null;
            this.tasks[index].lastModified = new Date().toLocaleString();
            localStorage.setItem("tasks", JSON.stringify(this.tasks));
        },
        cancelEdit() {
            this.redactTaskIndex = null;
        },
        deleteTask(index) {
            this.tasks.splice(index, 1);
            localStorage.setItem("tasks", JSON.stringify(this.tasks));
        }
    },
    watch: {
        tasks: {
            handler(newTasks) {
                localStorage.setItem("tasks", JSON.stringify(newTasks));
            },
            deep: true
        }
    }
});


Vue.component('first-task-list', {
    props: {
        tasks: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            redactTaskIndex: null
        };
    },
    template: `
        <div class="task-list">
            <h2>Задачи в работе</h2>
            <div v-for="(task, index) in tasks" :key="index" class="block-task-second" v-if="task.TableTasks == 1">
                <div v-if="redactTaskIndex === index">
                    <input v-model="task.title" />
                    <button @click="saveTask(index)">Сохранить</button>
                    <button @click="cancelEdit">Отменить</button>
                </div>
                <div v-else>
                    <strong>{{ task.title }}</strong>
                    <button @click="editTask(index)">Редактировать</button>
                    <button @click="deleteTask(index)">Удалить</button>
                </div>                    
                        <div v-if="redactTaskIndex === index">
                            <input v-model="task.comment" />
                        </div>
                        <div v-else>
                            <div>
                                <p>{{ task.comment }}</p>
                            </div>
                        </div>
                <b class="text-date">Дата создания: {{ task.createDate }}</b>
                <b class="text-date">Последнее изменение: {{ task.lastModified }}</b>
                <div>    
                    
                    <button @click="changeTable(task, 1)" :disabled="task.TableTasks === 4" class="button bg-2">➡️</button>
                </div>
                <ol>
                        <li v-for="(step, stepIndex) in task.steps" :key="stepIndex">
                        <p>{{ step }}</p>
                    </li>
                    </ol>
            </div>
        </div>
    `,
    methods: {
        changeTable(task, direction) {

            task.TableTasks += direction;
            localStorage.setItem("tasks", JSON.stringify(this.tasks));
        },
        selectStep(step) {
            step.done = !step.done;
        },
        editTask(index) {
            this.redactTaskIndex = index;
        },
        saveTask(index) {
            this.redactTaskIndex = null;
            this.tasks[index].lastModified = new Date().toLocaleString();
            localStorage.setItem("tasks", JSON.stringify(this.tasks));
        },
        cancelEdit() {
            this.redactTaskIndex = null;
        },
        deleteTask(index) {
            this.tasks.splice(index, 1);
            localStorage.setItem("tasks", JSON.stringify(this.tasks));
        }
    },
    watch: {
        tasks: {
            handler(newTasks) {
                localStorage.setItem("tasks", JSON.stringify(newTasks));
            },
            deep: true
        }
    }
});

Vue.component('search-modal', {
    props: {
        tasks: {
            type: Array,
            required: true
        },
        modalSearch: {
            type: Boolean,
            required: true
        }
    },
    data() {
        return {
            searchTerm: '',
        };
    },
    computed: {
        filteredTasks() {
            return this.tasks.filter(task => task.title.toLowerCase().includes(this.searchTerm.toLowerCase()) || task.steps.some(step => step.text.toLowerCase().includes(this.searchTerm.toLowerCase())));
        }
    },
    template: `
        <div class="search-modal" >
            <div class="modal-content">
                <h2>Поиск задач</h2>
                <input type="text" v-model="searchTerm" placeholder="Введите текст для поиска" />
                <button @click="$emit('close-search')">Закрыть</button>
                <div class="search-results">
                    <h3>Результаты поиска:</h3>
                    <div v-if="filteredTasks.length == 0" >Задачи не найдены</div>
                    <div v-for="(task, index) in filteredTasks" :key="index" class="task-item" class="block-task-search">
                        <strong>{{ task.title }}</strong>
                        <ol>
                            <li v-for="(step, stepIndex) in task.steps" :key="stepIndex">
                                {{ step.text }}
                            </li>
                        </ol>
                        <p>Сечас находится в столбике № {{ task.TableTasks }}</p>
                    </div>
                </div>
            </div>
        </div>
    `
});



let app = new Vue({
    el: '#app',
    data() {
        let tasks = [];
        if (localStorage.getItem("tasks")) {
            tasks = JSON.parse(localStorage.getItem("tasks"));
        }
        return {
            tasks: tasks,
            modalCreate: false,
            modalSearch: false,
        };
    },
    methods: {
        addTask(task) {
            this.tasks.push(task);
            this.tasks.sort((a, b) => a.property - b.property);
            localStorage.setItem("tasks", JSON.stringify(this.tasks));
        },
        open(){
            this.modalCreate = true;
        },
        close() {
            this.modalCreate = false;
        },
        openSearch() {
            this.modalSearch = true;
        },
        closeSearch() {
            this.modalSearch = false;
        }
    },
    template: `
        <div :class="{'postCreateTask': modalCreate, 'home': true}">
            <create-task v-if="modalCreate" @task-created="addTask" class="createtask" @close-crated="close"></create-task>
            <search-modal v-if="modalSearch" :tasks="tasks" :modalSearch="modalSearch" @close-search="closeSearch"></search-modal> 
            <div class="button-panel-div">
                <button @click="open" class="button-panel-plus">➕</button>
                <button @click="openSearch" class="button-panel-search">🔍</button> 
            </div>
            <div class="tasks-table">
                <first-task-list :tasks="tasks" class="color-table-orange"></first-task-list>
                <second-task-list :tasks="tasks" class="color-table-aqua"></second-task-list>
                <third-task-list :tasks="tasks" class="color-table-green"></third-task-list>
                <four-task-list :tasks="tasks" class="color-table-aqua"></four-task-list>
            </div>
            
        </div>
    `
});
