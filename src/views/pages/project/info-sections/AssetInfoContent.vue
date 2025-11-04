<!-- src/views/project/info-sections/AssetInfoContent.vue -->
<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ assetType: string }>()

// ✅ 자산 유형별 설명
const fuelExpenseData = computed(() => {
  if (props.assetType === 'solar') {
    return [
      { name: 'Capacity', desc: 'Rated DC capacity of PV modules under standard test conditions (MWdc).' },
      { name: 'Capacity Factor', desc: 'Average solar yield considering irradiation and temperature effects (%).' },
      { name: 'Performance Ratio', desc: 'Ratio of actual energy output to theoretical energy output under ideal conditions.' },
    ]
  }
  else {
    return [
      { name: 'Capacity', desc: 'Maximum electricity output at full load under ideal conditions (MW).' },
      { name: 'Capacity Factor', desc: 'Operational uptime and intensity relative to full capacity (%).' },
      { name: 'Heat Rate', desc: 'Thermal efficiency; lower heat rate means higher efficiency (MMBtu/MWh).' },
    ]
  }
})

const capexData = [
  { name: 'Power Generation', desc: 'Cost of turbines, generators, boilers, and auxiliaries including HRSGs.' },
  { name: 'General Facilities', desc: 'Infrastructure costs including control buildings, offices, and site utilities.' },
  { name: 'Plant Equipment', desc: 'BOP equipment such as pumps, compressors, transformers, and emission control systems.' },
  { name: 'Construction Labor', desc: 'Total cost of on-site labor, including civil, structural, and mechanical works.' },
  { name: 'Project Management', desc: 'EPC management, project planning, and quality assurance costs.' },
  { name: 'Spare Parts', desc: 'Initial spare parts and consumables required for commissioning and start-up.' },
  { name: 'Other Costs', desc: 'Transportation, import duties, insurance, and environmental compliance.' },
  { name: 'Sales Tax Rate', desc: 'Applicable VAT or sales tax rate on capital equipment and materials.' },
]
</script>

<template>
  <div>
    <h6 class="text-subtitle-1 mb-3">
      Fuel Expense
    </h6>

    <VTable
      density="comfortable"
      hover
      class="mb-6"
    >
      <thead>
        <tr>
          <th style="inline-size: 180px;">
            Item
          </th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, i) in fuelExpenseData"
          :key="i"
        >
          <td class="font-weight-medium text-high-emphasis">
            {{ item.name }}
          </td>
          <td class="text-body-2">
            {{ item.desc }}
          </td>
        </tr>
      </tbody>
    </VTable>

    <h6 class="text-subtitle-1 mb-3">
      Capex
    </h6>

    <VTable
      density="comfortable"
      hover
    >
      <thead>
        <tr>
          <th style="inline-size: 180px;">
            Item
          </th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, i) in capexData"
          :key="i"
        >
          <td class="font-weight-medium text-high-emphasis">
            {{ item.name }}
          </td>
          <td class="text-body-2">
            {{ item.desc }}
          </td>
        </tr>
      </tbody>
    </VTable>
  </div>
</template>
