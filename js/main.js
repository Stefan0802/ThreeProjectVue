Vue.component('create-task', {
    props:{
        firstTableTasks: {
            type: Number,
            required: true
        },
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
            completedDate: ''
        };
    },
    methods: {
        onSubmit() {
            let hasOnlySpaces = this.steps.some(step => step.text.trim() === '');
            if (hasOnlySpaces) {
                alert("Ошибка, нельзя писать только пробелы.");

            }else{
                    let task = {
                        title: this.title,
                        steps: this.steps,
                        completedDate: this.completedDate
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

Vue.component('four-task-list', {
    props: {
        tasks: {
            type: Array,
            required: true
        }
    },
    template: `
        <div class="task-list">
            <h2>four лист</h2>
            
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
            <h2>Третий лист</h2>
            
                <div v-for="(task, index) in tasks" :key="index"  class="block-task-third">
                    <strong>{{ task.title }}</strong>
                    <ol>
                        <li v-for="(step, stepIndex) in task.steps" :key="stepIndex">
                        <p class="doneStep" >{{ step.text }}</p>
                    </li>
                    </ol>
                    <b class="text-date">Дата завершения: {{ task.completionDate }}</b>
                </div>
            
        </div>
    `,
    methods: {
        // thirdTaskIf(task) {
        //     let trueDone = task.steps.filter(step => step.done).length;
        //     let fullLength = task.steps.length;
        //
        //
        //     if (fullLength === 0) {
        //         return false;
        //     }
        //
        //     if (trueDone == fullLength && !task.completionDate){
        //         task.completionDate = new Date().toLocaleString()
        //         this.$emit('update-tasks', this.tasks);
        //     }
        //
        //
        //     return trueDone == fullLength;
        // }
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
            
                <div v-for="(task, index) in tasks" :key="index" class="block-task-second">
                    <strong>{{ task.title }}</strong>
                    <ol>
                        <li v-for="(step, stepIndex) in task.steps" :key="stepIndex" >
                            <p v-if="step.done == false" @click="selectStep(step)" :class="{ 'doneStep': step.done, 'pointer': true }">{{ step.text }}</p>
                            <p v-else :class="{ 'doneStep': step.done}">{{ step.text }}</p>
                        </li>     
                    </ol>
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

let app = new Vue({
    el: '#app',
    data() {
        let tasks = [];
        if (localStorage.getItem("tasks")) {
            tasks = JSON.parse(localStorage.getItem("tasks"));
        }
        let firstTableTasks = 0
        if (localStorage.getItem("firstTableTasks")){
            firstTableTasks = localStorage.getItem("firstTableTasks")
        }
        let secondTableTasks = 0
        if (localStorage.getItem("secondTableTasks")){
            secondTableTasks = localStorage.getItem("secondTableTasks")
        }
        return {
            tasks: tasks,
            firstTableTasks: firstTableTasks,
            secondTableTasks: secondTableTasks,
            modalCreate: false
        };
    },
    methods: {
        updateCount(count) {
            this.firstTableTasks = count;
            localStorage.setItem("firstTableTasks", this.firstTableTasks);
        },
        updateCountSecond(count){
            this.secondTableTasks = count;
            localStorage.setItem("secondTableTasks", this.secondTableTasks);
        },
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
            <create-task v-if="modalCreate == true" @task-created="addTask" :firstTableTasks="firstTableTasks" class="createtask" @close-crated="close"></create-task>
             <button @click="close(true)">Создать</button>
             <div class="tasks-table">
                <first-task-list :tasks="tasks" :secondTableTasks="secondTableTasks" :firstTableTasks="firstTableTasks" @update-count="updateCount" class="color-table-orange"></first-task-list>
                <second-task-list :tasks="tasks" :secondTableTasks="secondTableTasks" class="color-table-aqua" @update-count="updateCountSecond" ></second-task-list>
                <third-task-list :tasks="tasks" class="color-table-green"></third-task-list>
                <four-task-list :tasks="tasks"  class="color-table-aqua"></four-task-list>>
            </div>
            
        </div>
    `
});
