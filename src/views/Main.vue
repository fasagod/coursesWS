<script setup lang="ts">
import {computed, onMounted, ref, watch} from "vue";
import {useMyCoursesStore} from "@/stores/myCourses";
import LearningsStatuses from "@/enums/LearningsStatuses";

const myCoursesStore = useMyCoursesStore();
const searchText = ref("");
const statusFilter = ref("");
const statusFilterList = ["Назначен", "В процессе", "Пройден", "Не пройден", "Завершен", "Просмотрен"];
const statusList = [
  "assigned",
  "inProgress",
  "done",
  "notPass",
  "passed",
  "viewed"
]

const courses = computed(() => {
  return myCoursesStore.coursesList
});

 const getStatus = function(state_id: number) {
   return LearningsStatuses[state_id] || "";
 };

 function searchCourse() {
   let status = statusList[statusFilterList.indexOf(statusFilter.value)];
   myCoursesStore.fetchMyCourses(searchText.value, status);
 }

 watch(searchText, (newValue, oldValue) => {
   if(newValue != oldValue && !newValue) {
     myCoursesStore.fetchMyCourses(searchText.value, statusFilter.value);
   }
 })
 //
 // onMounted(() => {
 //   myCoursesStore.fetchMyCourses();
 // })
</script>

<template>

  <h1 class="text-h3 font-weight-bold mb-4">Мои курсы</h1>
  <v-divider></v-divider>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-row class="align-center ga-2">
          <v-select
              label="Статус"
              clearable
              :items="statusFilterList"
              v-model="statusFilter"
          ></v-select>
          <v-text-field label="Поиск" clearable v-model="searchText"></v-text-field>
          <v-btn
              class="text-none"
              color="primary"
              text="Найти"
              variant="text"
              @click="searchCourse">
          </v-btn>
      </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col
          v-if="courses.length > 0"
          v-for="course in courses" :key="course.id"
          class="v-col-3">
        <v-card class="mx-auto" max-width="500" border flat>
          <v-list-item class="px-6" height="88">
            <template v-slot:prepend>
              <v-avatar color="surface-light" size="32">🎯</v-avatar>
            </template>

            <template v-slot:title> {{course.name}} </template>

            <template v-slot:append>

            </template>
          </v-list-item>

          <v-divider></v-divider>

          <v-card-text class="text-medium-emphasis pa-6">
            <div class="text-h6 mb-6">Статус курса - {{getStatus(course.state_id)}}</div>
<!--            <div class="text-h6 mb-6">Описание: {{course.description}}</div>-->

            <div class="text-h4 font-weight-black mb-4">{{course.score}}%</div>

            <v-progress-linear
                bg-color="surface-variant"
                class="mb-6"
                color="primary"
                height="10"
                :model-value="course.score"
                rounded="pill"
            ></v-progress-linear>
            <v-btn
                class="text-none"
                color="primary"
                text="Перейти к курсу"
                variant="text"
                slim
                :href="`/course/${course.course_id}/`"
            ></v-btn>
          </v-card-text>

        </v-card>
      </v-col>

      <v-col v-else>
        <span class="text-h5 mb-4">Курсы не найдены</span>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>

</style>