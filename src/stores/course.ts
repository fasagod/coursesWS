import {ref, computed} from 'vue'
import type { Ref } from 'vue'
import { defineStore } from 'pinia'
import {useMyCoursesStore} from "@/stores/myCourses";
import {useAllCoursesStore} from "@/stores/allCourses";

const url = "http://localhost:80/oapi/courses/"
const xAppIdHeader = "7091583612230139493";

export const useCourseStore = defineStore('course', () => {

    const myCoursesStore = useMyCoursesStore();
    const allCoursesStore = useAllCoursesStore();

    const courseData:Ref<ICourse|{}> = ref({});
    const learningData:Ref<ILearning|{}> = ref({});

    async function findCourseData(id: number) {
       courseData.value = await allCoursesStore.findCourse(id);
    }
    async function findLearningData(id: number) {
       learningData.value = await myCoursesStore.findCourse(id);
    }
    async function assignCourse(id: string) {
        return  fetch(url + "assignCourse", {
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
                if(data.message == "OK")
                    return data.result.message;
            })
            .catch((err) => {
                console.log(err)
            })
    }

    async function fetchCourseUrl(courseId: string, learningId: string) {
        let urlStr = `${url}getCourseUrl?course_id=${courseId}&learning_id=${learningId}`
        return fetch(urlStr, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-app-id': xAppIdHeader,
            },
        })
            .then((res) => res.text())
            .then((data) => {
                let url = "http://localhost:80/" + data;
                console.log(url)
                return url;
            })
            .catch((err) => {
                console.log(err)
            })
    }

    return {
        courseData,
        learningData,
        findCourseData,
        findLearningData,
        assignCourse,
        fetchCourseUrl,
        myCoursesStore,
        allCoursesStore
    }
})