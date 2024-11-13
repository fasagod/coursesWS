import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import {useMyCoursesStore} from "@/stores/myCourses";

const url = "http://localhost:80/oapi/courses/"

export const useCourseStore = defineStore('course', () => {

    const myCoursesStore = useMyCoursesStore();
    const courseData = ref({
        id: 1,
        name: "Vue 3",
        progress: 100,
        status: "success",
        desc:""
    })

    async function fetchCourse(id: number) {
       courseData.value = myCoursesStore.findCourse(id);
    }

    async function assignCourse(id: number) {
        await fetch(url + "assignCourse", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-app-id': '7091583612230139493',
            },
            body: JSON.stringify({
                courseId: id
            })
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data)
                return data
            })
            .catch((err) => {
                console.log(err)
            })
    }

    return {
        courseData,
        fetchCourse,
        assignCourse
    }
})