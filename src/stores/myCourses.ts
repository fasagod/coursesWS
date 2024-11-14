import {ref, computed} from 'vue'
import type { Ref } from 'vue'
import { defineStore } from 'pinia'

const url = "http://localhost:80/oapi/courses"
const xAppIdHeader = "7091583612230139493";
const isDebug = false;

export const useMyCoursesStore = defineStore('myCourses', () => {

    const coursesList:Ref<ILearning[]|[]> = ref([]);


    async function fetchMyCourses( courseName?: string, status?: string): Promise<ILearning[]> {
        if(isDebug){
            return  [{
                id: 0,
                course_id: 1,
                name: "Vue 3",
                state_id: 1,
                max_score: 100,
                score: 100,
                start_usage_date: "",
                start_learning_date: "",
                last_usage_date: "",
                max_end_date:"",
                time:0,
                description: "",
            },
            {
                id: 1,
                course_id: 2,
                name: "Vite",
                state_id: 1,
                max_score: 100,
                score: 50,
                start_usage_date: "",
                start_learning_date: "",
                last_usage_date: "",
                max_end_date:"",
                time:0,
                description: "",
            },
            ]
        }

        let type = 'my';
        courseName = courseName != undefined ? courseName : '';
        status = status != undefined ? status : '';
        let urlStr = `${url}/getCourses?list_type=${type}&name=${courseName}&status=${status}`
        return fetch(urlStr, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-app-id': xAppIdHeader,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                coursesList.value = data;
                return data;
        })
            .catch((error) => {
                console.log(error)
        })
    }

    async function findCourse(id: number) {
        await fetchMyCourses();
        let res = coursesList.value.find(course => course.course_id == id);
        console.log(res)

        return res != undefined ? res : {};
    }

    if(coursesList.value.length == 0) {
        fetchMyCourses().then(() => {
            console.log(coursesList.value)
        });
    }


    return {
        coursesList, fetchMyCourses, findCourse
    }
})