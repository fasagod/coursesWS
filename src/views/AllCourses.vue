<script setup lang="ts">
import {computed, onMounted, ref, watch} from "vue";
import {useAllCoursesStore} from "@/stores/allCourses";
import {useCourseStore} from "@/stores/course";
import {useMyCoursesStore} from "@/stores/myCourses";
import router from "@/router";

const allCoursesStore = useAllCoursesStore();
const courseStore = useCourseStore();
const myCoursesStore = useMyCoursesStore();

const courses = computed(() => {
  return allCoursesStore.notAssignedCoursesList
});

const searchText = ref("");
const filterDur = ref(0)

const durationFilter = computed({
  get() {
    if(filterDur.value == 0)
      return undefined
    return filterDur.value;
  },
  set(newValue) {
    let val = Number(newValue)
    if (!isNaN(val))
      filterDur.value = val;
    else
      filterDur.value = 0
  }
});

function searchCourse() {
  let duration = durationFilter.value == 0 ? undefined : durationFilter.value;
  allCoursesStore.fetchAllCourses(searchText.value, duration);
}

const assignCourse = function(id: string) {
  courseStore.assignCourse(id).then((courseId) => {
    if(courseId.length > 0) {
      myCoursesStore.fetchMyCourses().then(()=>{
        allCoursesStore.fetchAllCourses().then(() => {
          console.log("course assigned " + courseId)
          router.push("/course/" + courseId)
        });
      })
    }else {
      console.log("error while assigning course")
    }
  }).catch((err) => {
    console.log(err)
  })
}
watch(searchText, (newValue, oldValue) => {
  if((newValue != oldValue && newValue?.length > 2) || !newValue) {
    allCoursesStore.fetchAllCourses(searchText.value, durationFilter.value);
  }
})
watch(filterDur, (newValue, oldValue) => {
  if(newValue != oldValue || !newValue) {
    allCoursesStore.fetchAllCourses(searchText.value, durationFilter.value);
  }
})
</script>

<template>
  <h1 class="text-h3 font-weight-bold mb-4">Доступные курсы</h1>
  <v-divider></v-divider>
  <v-container fluid>
    <v-row class="my-1">
      <v-col>
        <v-row class="align-center ga-2">
          <v-text-field
              label="Длительность курса в днях"
              v-model="durationFilter"
              clearable
              density="compact"
              variant="outlined"
          >
          </v-text-field>

          <v-text-field
              label="Найти"
              clearable
              v-model="searchText"
              density="compact"
              variant="outlined"
          ></v-text-field>
        </v-row>
      </v-col>
    </v-row>
      <v-row>
        <v-col
            v-if="courses.length > 0"
            v-for="course in courses"
            :key="course.id"
            class="v-col-3">
          <v-card  class="mx-auto" max-width="500" border flat>
            <v-list-item class="px-6" height="88">
              <template v-slot:prepend>
                <v-avatar color="surface-light" size="32">🎯</v-avatar>
              </template>

              <template v-slot:title> <div class="text-h6" v-tooltip:top="course.name">{{course.name}}</div>  </template>


            </v-list-item>

            <v-divider></v-divider>

            <v-card-text class="text-medium-emphasis pa-6">

              <v-btn
                  class="text-none"
                  color="primary"
                  text="Открыть"
                  variant="text"
                  slim
                  @click.stop="router.push('/course/' + course.id)"
              ></v-btn>

              <v-btn
                  class="text-none ml-2"
                  color="primary"
                  text="Назначить"
                  variant="text"
                  slim
                  @click.stop="assignCourse(course.id)"
                  append-icon="md:edit"
              >
              </v-btn>
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