import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

const url = "http://localhost:80/oapi/courses"
const xAppIdHeader = "7091583612230139493";

export const useMyCoursesStore = defineStore('myCourses', () => {

    const coursesList = ref([
        {id: 1, name: "Vue 3", score: 100, status: "success"},
        {id: 2, name: "Vite", score: 50, status: "process"},
        {id: 3, name: "Nuxt 2", score: 21, status: "process"},
        {id: 4, name: "Nuxt 3", score: 53, status: "process"},
        {id: 5, name: "Nuxt 3 + Vite + ESLint", score: 0, status: "assigned"},
        {id: 6, name: "Nuxt 2 + Vite + ESLint", score: 0, status: "assigned"},
        {id: 7, name: "Nuxt 2 + Vite + ESLint", score: 0, status: "assigned"},
    ])

    async function fetchMyCourses( courseName: string, status: string) {
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
        })
            .catch((error) => {
                console.log(error)
        })
    }

    function findCourse(id: number) {
        return coursesList.value.find(course => course.id == id);
    }

    fetchMyCourses().then(() => {
        console.log(coursesList.value)
    });
    return {
        coursesList, fetchMyCourses, findCourse
    }
})