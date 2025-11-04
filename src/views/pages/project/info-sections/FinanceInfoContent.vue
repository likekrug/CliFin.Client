<template>
  <div>
    <h6 class="text-subtitle-1 mb-3">
      Financial Terms
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
          <td>Tenor</td>
          <td>Loan repayment duration, typically 15–30 years for energy projects.</td>
        </tr>
        <tr>
          <td>Interest Rate</td>
          <td>Annual rate charged by lenders on the borrowed capital.</td>
        </tr>
        <tr>
          <td>Debt to Equity Ratio</td>
          <td>Capital structure balance; higher debt increases leverage but risk.</td>
        </tr>
        <tr>
          <td>Commitment Fee</td>
          <td>Fee charged by lenders for unused committed loan portions (% of undrawn balance).</td>
        </tr>
        <tr>
          <td>Upfront Fee</td>
          <td>Initial fee at loan closing to cover lender administrative costs (% of total debt).</td>
        </tr>
        <tr>
          <td>Maintenance Capex</td>
          <td>Reserve for future maintenance or refurbishment (% of total Capex).</td>
        </tr>
      </tbody>
    </VTable>

    <h6 class="text-subtitle-1 mb-3">
      Tax
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
          <td>Federal Tax Rate</td>
          <td>Applicable corporate income tax rate on project profits (%).</td>
        </tr>
        <tr>
          <td>Depreciation</td>
          <td>Tax-deductible allocation of capital expenditure over the asset lifetime.</td>
        </tr>
      </tbody>
    </VTable>
  </div>
</template>
