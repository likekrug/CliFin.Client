<script setup lang="ts">
import { ref } from 'vue'
import CashFlowReportCard from '@/views/pages/cash-flow/CashFlowReportCard.vue'
import EChart from '@/views/pages/cash-flow/EChart.vue'
import ProjectList from '@/views/pages/cash-flow/ProjectList.vue'

// ----------------------
// 🔹 프로젝트 리스트 데이터
// ----------------------
const projects = ref([
  { id: 1, name: 'AAAAAAAAAAAAAAAAAAAAAAA', type: 'Coal', location: '53.339688, -6.236688' },
  { id: 2, name: 'Project name', type: 'Asset', location: 'Latitude, Longitude' },
  { id: 3, name: 'Project name', type: 'Asset', location: 'Latitude, Longitude' },
  { id: 4, name: 'Project name', type: 'Asset', location: 'Latitude, Longitude' },
])

const selectedProject = ref(projects.value[0])
</script>

<template>
  <VRow>
    <!-- 왼쪽: 프로젝트 리스트 -->
    <VCol
      cols="12"
      md="2"
    >
      <ProjectList
        v-model:selected-project="selectedProject"
        :projects="projects"
      />
    </VCol>

    <!-- 오른쪽: 보고서 + 그래프 -->
    <VCol
      cols="12"
      md="10"
    >
      <VRow>
        <!-- 상단: 보고서 -->
        <VCol cols="12">
          <CashFlowReportCard />
        </VCol>
        <!-- 상단: 보고서 -->
        <!--
          <VCol cols="12">
          <CashFlowReport :project="selectedProject" />
          </VCol>
        -->

        <!-- 하단: 그래프 -->

        <!--
          <VCol cols="12">
          <CashFlowChart :project="selectedProject" />
          </VCol>
        -->

        <!-- 하단: 그래프2 라인 그래프 -->

        <!--
          <VCol cols="12">
          <CashFlowChart2 />
          </VCol>
        -->

        <!-- 2차트 2 개 분리 한것 -->
        <!--
          <VCol cols="12">
          <CashFlowChart3 />
          </VCol>
        -->

        <!-- <VCol cols="12"> -->
        <!-- <CashFlowPlotly /> -->

        <VCol cols="12">
          <EChart />
        </VCol>

        <!--
          <VCol cols="12">
          <TestChart />
          </VCol>
        -->

        <!-- 하단: 제미나이 -->
        <!--
          <VCol cols="12">
          <CashFlowChartJM />
          </VCol>
        -->

        <!-- 하단: 그래프2 chart js -->
        <!--
          <VCol cols="12">
          <CashFlowChartJS />
          </VCol>
        -->
        <!--  -->
      </VRow>
    </VCol>
  </VRow>
</template>
