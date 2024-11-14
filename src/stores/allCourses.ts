import {ref, computed} from 'vue'
import type { Ref } from 'vue'
import { defineStore } from 'pinia'
import {useMyCoursesStore} from "@/stores/myCourses";

const url = "http://localhost:80/oapi/courses"
const xAppIdHeader = "7091583612230139493";
const isDebug = false;

export const useAllCoursesStore = defineStore('allCourses', () => {

    const myCoursesStore = useMyCoursesStore();

    const coursesList:Ref<ICourse[]|[]> = ref([]);

    const notAssignedCoursesList:Ref<ICourse[]|[]> = ref([]);

    const myCourses = computed(() => {
        return myCoursesStore.coursesList
    });

    async function fetchAllCourses( courseName?: string, duration?: number) {
        if(isDebug){
            return  [
                {id: 1, name: "Vue 3", score: 100, status: "success", max_score: 100, duration: 1, progress: 100},
                {id: 2, name: "Vite", score: 50, status: "process", max_score: 100, duration: 1, progress: 10},
                {id: 3, name: "Nuxt 2", score: 21, status: "process", max_score: 100, duration: 1, progress: 20},
                {id: 4, name: "Nuxt 3", score: 53, status: "process", max_score: 100, duration: 1, progress: 0},
            ]
        }

        let type = 'all';
        courseName = courseName != undefined ? courseName : '';
        let newDuration = duration != undefined ? duration : '';
        let urlStr = `${url}/getCourses?list_type=${type}&name=${courseName}&duration=${newDuration}`
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
                console.log("fetchAllCourses",  myCourses.value)
                myCoursesStore.fetchMyCourses().then(() => {
                    notAssignedCoursesList.value = coursesList.value.filter((crs) => {
                        let a = myCourses.value.find((my)=>my.course_id === crs.id)
                        if(a==undefined) return crs;
                    })
                });
                return data;
            })
            .catch((error) => {
                console.log(error)
            })
    }

    async function findCourse(id: number) {
        await fetchAllCourses()
        let res = coursesList.value.find(course => course.id == id);
        console.log(res)
        return res != undefined ? res : {};
    }

    if(coursesList.value.length == 0) {
        fetchAllCourses().then(() => {
            console.log(coursesList.value)
        })
    };

    return {
        coursesList,
        notAssignedCoursesList,
        fetchAllCourses,
        findCourse,
        myCourses,
        myCoursesStore
    }
})