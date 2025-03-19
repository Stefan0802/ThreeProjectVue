Vue.component('create-task', {
    props:{
        modalCreate:{
            type: Boolean,
            required: true
        }

    },
    template: `
        <div class="createBlockTask">
            <form @submit.prevent="onSubmit" class="block">
                <label for="title" class="textInBlock">Title</label>
                <input type="text" v-model="title" required placeholder="Заголовок">
                
                <ol>
                    <li v-for="(step, index) in steps" :key="index" class="section textInBlock">
                        <input type="text" v-model="step.text" placeholder="Введите задачу" required>
                    </li>
                    <input type="date" placeholder="Какая дата заплонирована?" v-model="planDate">
                </ol>
                
                <label for="">Выберите приоритет</label>
                <select v-model="property">
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                </select>
                
                <div>
                    <button type="button" @click="addStep" :disabled="steps.length === 5" >добавить шаг</button>
                    <button type="button" @click="removeStep" :disabled="steps.length <= 3 ">убавить шаг</button>
                </div>
                
                <button type="submit" :disabled="steps.length === 0" >отправить</button>
            </form>
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
                        property: this.property
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
                <ol>
                    <li v-for="(step, stepIndex) in task.steps" :key="stepIndex">
                        <p class="doneStep">{{ step.text }}</p>
                    </li>
                </ol>
                
                <p v-if="task.completionDate <= task.planDate">Вы успели вовремя</p>
                <p v-else >Просрочено :(</p>
            </div>
        </div>
    `,
    methods: {
        thirdTaskIf(task) {
            let trueDone = task.steps.filter(step => step.done).length;
            let fullLength = task.steps.length;

            if (fullLength === 0) {
                return false;
            }

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
            commentTable: ''
        };
    },
    template: `
        <div class="task-list">
            <h2>Тестирование</h2>
            <div v-for="(task, index) in tasks" :key="index" class="block-task-first" v-if="task.TableTasks === 3">
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
                <ol>
                    <li v-for="(step, stepIndex) in task.steps" :key="stepIndex">
                        <div v-if="redactTaskIndex === index">
                            <input v-model="step.text" />
                        </div>
                        <div v-else>
                            <p @click="selectStep(step)" :class="{ 'doneStep': step.done, 'pointer': true }">{{ step.text }}</p>
                        </div>
                    </li>
                </ol>
                <b class="text-date">Дата создания: {{ task.createDate }}</b>
                <b class="text-date" v-if="task.lastModified">Последнее изменение: {{ task.lastModified }}</b>
                <div>       
                    <textarea v-model="commentTable" cols="10" rows="5" placeholder="Оставьте комментарий"></textarea>
                    <button @click="comment(task)" class="button text-but">comment and left</button>
                    <button @click="changeTable(task, 1)" :disabled="task.TableTasks === 4" class="button bg-3">➡️</button>
                </div>
            </div>
        </div>
    `,
    methods: {
        comment(task) {
            if (this.commentTable.trim()) {
                task.comment = this.commentTable;
                this.commentTable = '';
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
            <strong v-if="task.comment" style="color:red">{{task.comment}}</strong>
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
                <ol>
                    <li v-for="(step, stepIndex) in task.steps" :key="stepIndex">
                        <div v-if="redactTaskIndex === index">
                            <input v-model="step.text" />
                        </div>
                        <div v-else>
                            <p @click="selectStep(step)" :class="{ 'doneStep': step.done, 'pointer': true }">{{ step.text }}</p>
                        </div>
                    </li>     
                </ol>
                <b class="text-date">Дата создания: {{ task.createDate }}</b>
                <b class="text-date">Последнее изменение: {{ task.lastModified }}</b>
                <div>    
                    <button @click="changeTable(task, -1)" :disabled="task.TableTasks === 1" class="button bg-2">⬅️</button>
                    <button @click="changeTable(task, 1)" :disabled="task.TableTasks === 4" class="button bg-2">➡️</button>
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
            <h2>Заплонированные задачи</h2>
            <div v-for="(task, index) in tasks" :key="index" class="block-task-first" v-if="task.TableTasks === 1">
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
                <ol>
                    <li v-for="(step, stepIndex) in task.steps" :key="stepIndex">
                        <div v-if="redactTaskIndex === index">
                            <input v-model="step.text" />
                        </div>
                        <div v-else>
                            <p @click="selectStep(step)" :class="{ 'doneStep': step.done, 'pointer': true }">{{ step.text }}</p>
                        </div>
                    </li>
                </ol>
                <b class="text-date">Дата создания: {{ task.createDate }}</b>
                <b class="text-date">Последнее изменение: {{ task.lastModified }}</b>
                <div>   
                    <button @click="changeTable(task, 1)" :disabled="task.TableTasks === 4" class="button">➡️ </button>
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
            commentTableTwoCheck: false
        };
    },
    methods: {
        addTask(task) {
            this.tasks.push(task);

            localStorage.setItem("tasks", JSON.stringify(this.tasks));
        },
        close(modalCreate) {
            this.modalCreate = !this.modalCreate;
        }
    },
    template: `
        <div :class="{'postCreateTask': modalCreate, 'home': true}">
            <create-task v-if="modalCreate" @task-created="addTask" class="createtask" @close-crated="close"></create-task>
            <button @click="close(true)" style="">➕</button>
            <div class="tasks-table">
                <first-task-list :tasks="tasks" class="color-table-orange" ></first-task-list>
                <second-task-list :commentTableTwoCheck="commentTableTwoCheck" :tasks="tasks" class="color-table-aqua" ></second-task-list>
                <third-task-list :commentTableTwoCheck="commentTableTwoCheck" :tasks="tasks" class="color-table-green" ></third-task-list>
                <four-task-list :tasks="tasks" class="color-table-aqua"></four-task-list>
            </div>
        </div>
    `
});
