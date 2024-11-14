<script setup lang="ts">
import {computed, onMounted, ref, watch} from "vue";
import {useMyCoursesStore} from "@/stores/myCourses";
import LearningsStatuses from "@/enums/LearningsStatuses";
import router from "@/router";

const myCoursesStore = useMyCoursesStore();
const courses = computed(() => {
  return myCoursesStore.coursesList
});

const searchText = ref("");
const statusFilter = ref(null);
const statusItems = [
  {
    text: "Назначен",
    value: "assigned"
  },
  {
    text: "В процессе",
    value: "inProgress"
  },
  {
    text: "Пройден",
    value: "done"
  },
  {
    text: "Не пройден",
    value: "notPass"
  },
  {
    text: "Завершен",
    value: "passed"
  },
  {
    text: "Просмотрен",
    value: "viewed"
  }
];
function itemProp(item: any) {
  if(!item) return null;
  return {
    title: item.text,
    value: item.value
  }
}

 function getStatus(state_id: number) {
   let status = LearningsStatuses[state_id];
   return status || "";
 };

 function searchCourse() {
   let status = statusFilter.value == null ? '' : statusFilter.value;
   myCoursesStore.fetchMyCourses(searchText.value, status);
 }

watch(searchText, (newValue, oldValue) => {
 if((newValue != oldValue && newValue?.length > 2) || !newValue) {
   let status = statusFilter.value == null ? '' : statusFilter.value;
   myCoursesStore.fetchMyCourses(searchText.value, status);
 }
})
watch(statusFilter, (newValue, oldValue) => {
  if(newValue != oldValue || !newValue) {
    let status = statusFilter.value == null ? '' : statusFilter.value;
    myCoursesStore.fetchMyCourses(searchText.value, status);
  }
})
</script>

<template>
  <h1 class="text-h3 font-weight-bold mb-4">Мои курсы</h1>
  <v-divider></v-divider>
  <v-container fluid>
    <v-row class="my-1">
      <v-col>
        <v-row class="align-center ga-2">
          <v-select
              label="Статус"
              clearable
              :item-props="itemProp"
              :items="statusItems"
              v-model="statusFilter"
              density="compact"
              variant="outlined"
          ></v-select>
          <v-text-field
              label="Найти"
              clearable
              v-model="searchText"
              density="compact"
              variant="outlined"
          ></v-text-field>
<!--          <v-btn-->
<!--              class="text-none"-->
<!--              color="primary"-->
<!--              text="Найти"-->
<!--              variant="text"-->
<!--              @click="searchCourse">-->
<!--          </v-btn>-->
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

            <template v-slot:title> <div class="text-h6" v-tooltip:top="course.name">{{course.name}}</div>  </template>

            <template v-slot:append>

            </template>
          </v-list-item>

          <v-divider></v-divider>

          <v-card-text class="text-medium-emphasis pa-6">
            <div class="text-subtitle-1 mb-6">Статус курса: {{getStatus(course.state_id)}}</div>

            <div class="text-h5 font-weight-black mb-4">Изучено: {{course.score}}%</div>

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
                @click.stop="router.push(`/course/${course.course_id}/`)"
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
.text-pointer:hover {

}
</style>