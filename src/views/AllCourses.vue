<script setup lang="ts">
import {computed, onMounted} from "vue";
import {useAllCoursesStore} from "@/stores/allCourses";
import {useCourseStore} from "@/stores/course";
import router from "@/router";

const allCoursesStore = useAllCoursesStore();
const courseStore = useCourseStore();

const courses = computed(() => {
  return allCoursesStore.coursesList
});

const assignCourse = function(id: number) {

  courseStore.assignCourse(id).then((id) => {
    if(id) {
      router.push("/course/" + id)
    }else {
      console.log("error while assigning course")
    }
  }).catch((err) => {
    console.log(err)
  })
}
onMounted(() => {
  allCoursesStore.fetchAllCourses();

})
</script>

<template>
  <h1 class="text-h3 font-weight-bold mb-4">Доступные курсы</h1>
  <v-divider></v-divider>
  <v-container fluid>
      <v-row>
        <v-col v-for="course in courses" :key="course.id" class="v-col-3">
          <v-card  class="mx-auto" max-width="500" border flat>
            <v-list-item class="px-6" height="88">
              <template v-slot:prepend>
                <v-avatar color="surface-light" size="32">🎯</v-avatar>
              </template>

              <template v-slot:title> {{course.name}} </template>

              <template v-slot:append>
                <v-btn
                    class="text-none"
                    color="primary"
                    text="Назначить"
                    variant="text"
                    slim
                    @click.stop="assignCourse(course.id)"
                ></v-btn>
              </template>
            </v-list-item>

            <v-divider></v-divider>

            <v-card-text class="text-medium-emphasis pa-6">
              <div class="text-h6 mb-6">Статус курса {{course.status}}</div>

              <div class="text-h4 font-weight-black mb-4">{{course.description}}</div>

            </v-card-text>

          </v-card>
        </v-col>
      </v-row>


  </v-container>
</template>

<style scoped>

</style>