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
            TableTasks: 1
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
                        TableTasks: this.TableTasks
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

Vue.component('first-task-list', {
    props: {
        tasks: {
            type: Array,
            required: true
        }
    },
    template: `
        <div class="task-list">
            <h2>Первый лист</h2>
            
            <div v-for="(task, index) in tasks" :key="index"  class="block-task-first">
                <strong>{{ task.title }}</strong>
                <ol>
                    <li v-for="(step, stepIndex) in task.steps" :key="stepIndex">
                        <p @click="selectStep(step)" :class="{ 'doneStep': step.done, 'pointer': true }" >{{ step.text }}</p>
                    </li>
                </ol>
            </div>
        </div>
    `,
    methods: {
        selectStep(step) {
            step.done = !step.done;
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
    template: `
        <div class="task-list">
            <h2>four лист</h2>
            
            <div v-for="(task, index) in tasks" :key="index"  class="block-task-first" v-if="task.TableTasks == 3">
                <strong>{{ task.title }}</strong>
                <ol>
                    <li v-for="(step, stepIndex) in task.steps" :key="stepIndex" >
                        <p @click="selectStep(step)" :class="{ 'doneStep': step.done, 'pointer': true }" >{{ step.text }}</p>
                    </li>
                </ol>
                <b class="text-date">Дата создания: {{ task.createDate }}</b>
                
            </div>
        </div>
    `,
    methods: {

        selectStep(step) {
            step.done = !step.done;
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

Vue.component('four-task-list', {
    props: {
        tasks: {
            type: Array,
            required: true
        }
    },
    template: `
        <div class="task-list">
            <h2>Третий лист</h2>
            
                <div v-for="(task, index) in tasks" :key="index"  class="block-task-third" v-if="task.TableTasks === 4">
                    <strong>{{ task.title }}</strong>
                    <ol>
                        <li v-for="(step, stepIndex) in task.steps" :key="stepIndex">
                        <p class="doneStep" >{{ step.text }}</p>
                    </li>
                    </ol>
                    <b class="text-date">Дата создания: {{ task.createDate }}</b>
                    <b  class="text-date">Дата завершения: {{ task.completionDate }}</b>
                </div>
            
        </div>
    `,
    methods: {

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
    template: `
        <div class="task-list">
            <h2>Второй лист</h2>
            
                <div v-for="(task, index) in tasks" :key="index" class="block-task-second" v-if="task.TableTasks === 2">
                    <strong>{{ task.title }}</strong>
                    <ol>
                        <li v-for="(step, stepIndex) in task.steps" :key="stepIndex" >
                            <p v-if="step.done == false" @click="selectStep(step)" :class="{ 'doneStep': step.done, 'pointer': true }">{{ step.text }}</p>
                            <p v-else :class="{ 'doneStep': step.done}">{{ step.text }}</p>
                        </li>     
                    </ol>
                    <b class="text-date">Дата создания: {{ task.createDate }}</b>
                </div>
            
        </div>
    `,
    methods: {
        selectStep(step) {
            step.done = !step.done;
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
    template: `
        <div class="task-list">
            <h2>Первый лист</h2>
            
            <div v-for="(task, index) in tasks" :key="index"  class="block-task-first" v-if="task.TableTasks === 1">
                <strong>{{ task.title }}</strong>
                <ol>
                    <li v-for="(step, stepIndex) in task.steps" :key="stepIndex">
                        <p @click="selectStep(step)" :class="{ 'doneStep': step.done, 'pointer': true }" >{{ step.text }}</p>
                    </li>
                </ol>
                <b class="text-date">Дата создания: {{ task.createDate }}</b>
              
            </div>
        </div>
    `,
    methods: {
        selectStep(step) {
            step.done = !step.done;
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
            if (this.modalCreate == true){
                this.modalCreate = false
            }else{
                this.modalCreate = true
            }
        }
    },
    template: `
        <div :class="{'postCreateTask': modalCreate, 'home': true}">
            <create-task v-if="modalCreate == true" @task-created="addTask" class="createtask" @close-crated="close"></create-task>
             <button @click="close(true)">Создать</button>
             <div class="tasks-table">
                <first-task-list :tasks="tasks" class="color-table-orange"></first-task-list>
                <second-task-list :tasks="tasks" class="color-table-aqua" ></second-task-list>
                <third-task-list :tasks="tasks" class="color-table-green"></third-task-list>
                <four-task-list :tasks="tasks"  class="color-table-aqua"></four-task-list>
            </div>
            
        </div>
    `
});
