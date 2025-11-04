<template>
  <div>
    <h6 class="text-subtitle-1 mb-3">
      Revenue
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
        <tr>
          <td>Sell Price</td>
          <td>Market price for selling electricity, typically per MWh of generation.</td>
        </tr>
        <tr>
          <td>Sell Price Escalator</td>
          <td>Annual percentage increase applied to base energy price to reflect inflation or contract terms.</td>
        </tr>
        <tr>
          <td>Capacity Revenue</td>
          <td>Payment for maintaining available capacity to ensure system reliability ($/MW-yr).</td>
        </tr>
        <tr>
          <td>Capacity Revenue Escalator</td>
          <td>Expected growth rate of capacity payment, usually aligned with inflation (%).</td>
        </tr>
      </tbody>
    </VTable>

    <h6 class="text-subtitle-1 mb-3">
      Expense
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
        <tr>
          <td>O&M Variable</td>
          <td>Cost proportional to energy output (e.g., fuel, consumables, water usage).</td>
        </tr>
        <tr>
          <td>O&M Fixed</td>
          <td>Annual plant maintenance and labor costs independent of generation output.</td>
        </tr>
        <tr>
          <td>Fuel Price</td>
          <td>Price of primary fuel (gas, coal, etc.), typically expressed in $/MMBtu.</td>
        </tr>
        <tr>
          <td>Insurance Rate</td>
          <td>Premium rate for plant insurance coverage, as a percentage of asset value.</td>
        </tr>
      </tbody>
    </VTable>
  </div>
</template>
