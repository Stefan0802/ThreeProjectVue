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
            planDate: ''
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
                        planDate: this.planDate
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
            <h2>Четвертый лист</h2>
            <div v-for="(task, index) in tasks" :key="index" class="block-task-third" v-if="task.TableTasks === 4">
                <strong>{{ task.title }}</strong>
                <ol>
                    <li v-for="(step, stepIndex) in task.steps" :key="stepIndex">
                        <p @click="selectStep(step)" class="doneStep">{{ step.text }}</p>
                    </li>
                </ol>
                <b class="text-date">Дата создания: {{ task.createDate }}</b>
                <b> Дата окончания: </b>
                <b> Заплонированая: {{ task.planDate }}</b>
            </div>
        </div>
    `,
    methods: {
        changeTable(task, direction) {
            task.TableTasks += direction;
            localStorage.setItem("tasks", JSON.stringify(this.tasks));
        },

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


Vue.component('third-task-list', {
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
            <h2>Третий лист</h2>
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
                <b class="text-date">Последнее изменение: {{ task.lastModified }}</b>
                <div>    
                    <button @click="changeTable(task, -1)" :disabled="task.TableTasks === 1">влево</button>
                    <button @click="changeTable(task, 1)" :disabled="task.TableTasks === 4">вправо</button>
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


Vue.component('second-task-list', {
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
            <h2>Второй лист</h2>
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
                    <button @click="changeTable(task, -1)" :disabled="task.TableTasks === 1">влево</button>
                    <button @click="changeTable(task, 1)" :disabled="task.TableTasks === 4">вправо</button>
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
            <h2>Первый лист</h2>
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
                    <button @click="changeTable(task, 1)" :disabled="task.TableTasks === 4">вправо</button>
                    <button @click="changeTable(task, 1)" :disabled="task.TableTasks === 4">вправо</button>
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
            modalCreate: false
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
            <button @click="close(true)" style="text-align: center">Создать</button>
            <div class="tasks-table">
                <first-task-list :tasks="tasks" class="color-table-orange" ></first-task-list>
                <second-task-list :tasks="tasks" class="color-table-aqua" ></second-task-list>
                <third-task-list :tasks="tasks" class="color-table-green" ></third-task-list>
                <four-task-list :tasks="tasks" class="color-table-aqua"></four-task-list>
            </div>
        </div>
    `
});
