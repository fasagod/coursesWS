<script setup lang="ts">
import {computed, onMounted} from "vue";
import {useRoute} from "vue-router";
import {useCourseStore} from "@/stores/course";
import {useAllCoursesStore} from "@/stores/allCourses";
import {useMyCoursesStore} from "@/stores/myCourses";
import router from "@/router";


const allCoursesStore = useAllCoursesStore();
const courseStore = useCourseStore();
const myCoursesStore = useMyCoursesStore();
const route = useRoute()

const courseId = computed(()=> route.params.id);
const courseData  = computed(()=> courseStore.courseData);
const learningData  = computed(()=> {
  let data = courseStore.learningData
  if(data.id) return courseStore.learningData
  else return null;
});
console.log(courseId);
const percent = computed(()=> {
  if(learningData.value) return Math.floor((learningData.value.score/learningData.value.max_score) * 100)
})

function getDuration(param: number) {
  if(param === 0) return "Без ограничения";
  else return param + " дней";
}
 function assignCourse(){
   courseStore.assignCourse(courseId.value).then(() => {
     UpdateInfo()
   })

 }
 async function openCourse(courseId: string, learningId: string) {
   const sUrl = await courseStore.fetchCourseUrl(courseId, learningId);
   window.open(sUrl, "_blank");
 }
 function backToPage(){
   if(router.getRoutes().length>0){
     router.back();
   }else {
     router.push("/")
   }
 }

 async function UpdateInfo() {
   courseStore.findLearningData(courseId.value).then(()=>{
     courseStore.findCourseData(courseId.value)
   })
 }
 onMounted( async ()=>{
  await UpdateInfo();
 })
</script>

<template>
  <v-btn
      class="text-none"
      color="primary"
      text="Назад"
      variant="text"
      @click="backToPage"
      prepend-icon="md:arrow_back"
  >
  </v-btn>
  <div class="container w-75 ma-auto">
    <v-col v-if="courseId">
      <v-row>
        <v-col>
          <h1 class="text-h4 mb-4">{{courseData.name}}</h1>
          <p class="" v-html="courseData.desc">
          </p>
        </v-col>
      </v-row>
      <v-row class="my-2">
        <v-col>
          <v-btn
              v-if="learningData"
              class="text-none"
              color="primary"
              text="Открыть курс"
              variant="text"
              @click.stop="openCourse(courseId, learningData.id)">
          </v-btn>
          <v-btn
              v-else
              class="text-none"
              color="primary"
              text="Назначить"
              variant="text"
              @click.stop="assignCourse">
          </v-btn>
        </v-col>
      </v-row>

      <v-divider></v-divider>

      <v-row>
        <v-col v-if="learningData">
          <div>Дата назначения: {{learningData.start_usage_date}}</div>
          <div>Дата необходимого завершения: {{learningData.max_end_date}}</div>
          <div>Максимальный балл: {{learningData.max_score}}</div>
          <div>Текущий балл: {{learningData.score}}</div>
          <div>Процент прохождения курса: {{percent}}%</div>
          <div>Длительность обучения в днях: {{getDuration(learningData.duration)}}</div>
        </v-col>
      </v-row>
    </v-col>
    <v-col v-else>
      <h1>Курс не найден</h1>
    </v-col>
  </div>
</template>

<style scoped>

</style>