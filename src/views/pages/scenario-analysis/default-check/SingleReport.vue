<script setup lang="ts">
import { computed } from 'vue'

/* ----------------------------------------
  🔹 Props: rows + selectedScenarios
----------------------------------------- */
const props = defineProps<{
  scenarioData: Record<string, number>[] // { year, baseline, ssp126 ... }
  selectedScenarios: string[] // ['baseline','ssp126']
  startYear: number // ex: 2025
}>()

/* ----------------------------------------
  🔹 Year 30개 생성 (연도만)
----------------------------------------- */
const generate30Years = (startYear: number) => {
  return Array.from({ length: 30 }, (_, i) => ({
    year: startYear + i,
  }))
}

const yearRows = computed(() => generate30Years(props.startYear))

/* ----------------------------------------
  🔹 Scenario 값 매핑: scenarioData 에서 찾아 부착
----------------------------------------- */
const mergedRows = computed(() => {
  return yearRows.value.map(row => {
    const found = props.scenarioData.find(x => x.year === row.year)

    return { ...row, ...found }
  })
})

const scenarioKeyMap: Record<string, string> = {
  Baseline: 'baseline',
  SSP126: 'ssp126',
  SSP585: 'ssp585',
  SSP170: 'ssp370',
}

/* ----------------------------------------
  🔹 조건부 색상
----------------------------------------- */
const cellClass = (v: number | undefined) => {
  if (v === undefined || v === null)
    return ''
  if (v < 1)
    return 'cell-low'
  if (v > 1)
    return 'cell-high'

  return ''
}
</script>

<template>
  <VTable
    class="scenario-table"
    density="comfortable"
  >
    <thead>
      <tr>
        <th class="text-center">
          Year
        </th>

        <!-- 🔹 Scenario Header (동적) -->
        <th
          v-for="sc in selectedScenarios"
          :key="sc"
          class="text-center"
        >
          {{ sc.toUpperCase() }}
        </th>
      </tr>
    </thead>

    <tbody>
      <!-- 🔹 30개 년도 row -->
      <tr
        v-for="item in mergedRows"
        :key="item.year"
      >
        <td class="text-center">
          {{ item.year }}
        </td>

        <!-- 🔹 Scenario 값 출력 -->
        <td
          v-for="sc in selectedScenarios"
          :key="item.year + sc"
          class="text-center"
          :class="cellClass(item[scenarioKeyMap[sc]])"
        >
          {{ item[scenarioKeyMap[sc]] ?? '-' }}
        </td>
      </tr>
    </tbody>
  </VTable>
</template>

<style scoped lang="scss">
.scenario-table th {
  background: #f4f5f7;
  font-size: 14px;
  font-weight: 600;
}

.scenario-table td {
  font-size: 14px;
  padding-block: 6px !important;
  padding-inline: 0 !important;
}

/* 🔻 < 1 → 빨강 */
.cell-low {
  color: #e53935 !important;
  font-weight: 700;
}

/* 🔻 > 1 → 노랑 */
.cell-high {

}
</style>
