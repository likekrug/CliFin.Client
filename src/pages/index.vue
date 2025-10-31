<script setup lang="ts">
import briefcase from '@images/cards/briefcase.png'
</script>

<template>
  <div>
    <VCard
      class="mb-6"
      title="What is Clifin?"
    >
      <VCardText>
        <!-- SECTION Upgrade plan banner -->
        <div class="plan-upgrade-banner pa-4 d-flex rounded align-center">
          <VAvatar
            rounded
            size="40"
            class="plan-details border-opacity-100 border-primary me-4"
          >
            <img
              :src="briefcase"
              alt="briefcase"
              height="20"
            >
          </VAvatar>

          <div class="d-flex flex-column me-3">
            <h6 class="text-h6">
              CliFin
            </h6>
            <span class="text-primary text-body-2"> A Flexible Framework for Asset-Level Climate Risk Assessment in Infrastructure Investment</span>
          </div>
          <VSpacer />
        </div>
      <!-- !SECTION -->
      </VCardText>

      <VCardText>
        You can read our research paper “A Flexible Framework for Asset-Level Climate Risk Assessment in Infrastructure Investment” published on SSRN <a
          href="https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5077980"
          target="_blank"
          rel="noopener noreferrer"
          class="text-decoration-none"
        >
          here
        </a>
      </VCardText>
    </VCard>

    <VCard title="Let’s get started">
      <VCardText>
        Watch this short introduction video to learn how CliFin helps you assess and manage climate risks at the asset level.
      </VCardText>
      <VCardText class="d-flex justify-center">
        <div class="youtube-wrapper">
          <iframe
            src="https://www.youtube.com/embed/SUBnM6P9qho"
            title="CliFin - Getting Started"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          />
        </div>
      </VCardText>
    </VCard>
  </div>
</template>

<style lang="scss" scoped>
.plan-upgrade-banner {
  .plan-details {
    border: 1px solid rgb(var(--v-theme-primary));
  }

  background-color: rgba(var(--v-theme-primary), 0.16);
}

.youtube-wrapper {
  overflow: hidden;
  border-radius: 12px;
  aspect-ratio: 16 / 9;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 15%);
  inline-size: 100%;
  max-inline-size: 960px; /* 💡 유튜브 기본 16:9 사이즈 */
}

.youtube-wrapper iframe {
  display: block;
  block-size: 100%;
  inline-size: 100%;
}
</style>
