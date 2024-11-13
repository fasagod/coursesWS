<script setup lang="ts">
import {computed, onMounted} from "vue";
 import {useRoute} from "vue-router";
 import {useCourseStore} from "@/stores/course";

 const courseStore = useCourseStore();
 const route = useRoute()

 const courseId = computed(()=> Number(route.params.id));

 const courseData  = computed(()=> courseStore.courseData);

 function assignCourse(){
   courseStore.assignCourse(courseId.value);
 }
 onMounted( ()=>{
   courseStore.fetchCourse(courseId.value)
 })
</script>

<template>
  <div class="container w-75 ma-auto">
    <v-col v-if="courseId">
      <v-row>
        <v-col>
          <h1>Name {{courseId}}</h1>
          <p class="text-wrap">
            {{courseData.desc}}
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aspernatur autem blanditiis commodi corporis cupiditate debitis dignissimos distinctio dolorum ea error, expedita facilis harum hic incidunt inventore iure magnam modi, nobis officiis placeat quas quidem quos rem repellat sapiente tempora totam voluptas!
          </p>
        </v-col>
      </v-row>
      <v-row class="my-2">
        <v-col>
          <v-btn
              class="text-none"
              color="primary"
              text="Открыть"
              variant="text"
              href="#">
          </v-btn>
          <v-btn
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
        <v-col>
          <div>Дата назначения: {{courseData.startDate}}</div>
          <div>Дата необходимого завершения: {{courseData.endDate}}</div>
          <div>Максимальный балл: {{courseData.maxMark}}</div>
          <div>Текущий балл: {{courseData.currentMark}}</div>
          <div>Процент прохождения курса: {{courseData.progress}}</div>
          <div>Длительность обучения в днях: {{courseData.days}}</div>

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