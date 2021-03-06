<script>
import { mapState, mapGetters } from 'vuex'
import { generateRoutes } from '@utils/generate-routes'
import { generateDateList } from '@utils/format-date'
import ArtworkSlide from '@components/artwork-slide.vue'
import TimelineNav from '@components/timeline-nav.vue'
import TimelineNavButton from '@components/timeline-nav-button.vue'
import DetailsCarousel from '@components/details-carousel.vue'

export default {
  name: 'ArtworkPage',
  components: {
    ArtworkSlide,
    TimelineNav,
    DetailsCarousel,
    TimelineNavButton,
  },
  validate({ params }) {
    const allRoutes = generateRoutes()

    return allRoutes.includes(params.date)
  },
  async fetch({ store, params }) {
    const slideDates = generateDateList(params.date)

    const slides = await Promise.all(
      slideDates.map(async item => {
        // Break the date parameters into an array so we can access the month
        // and day separately.
        const date = item.split('-')

        // Use the function form of import to dynamically parse the .json
        // content files.
        const artwork = await import(
          `../data/${date[0]}/${date[0]}-${date[1]}.json`
        )

        return artwork.default
      })
    )

    await store.dispatch('updateSlideData', slides)
    await store.dispatch('updateCurrentSlideIndex', slides.length - 1)
    store.dispatch('updateCurrentPage', params.date)
  },
  head() {
    return {
      title: `${this.page.title} | Dutch Art Daily`,
      meta: [
        // hid is used as unique identifier. Do not use `vmid` for it as it will
        // not work
        {
          hid: 'og:title',
          name: 'og:title',
          content: this.page.title,
        },
        {
          hid: 'author',
          name: 'author',
          content: this.page.artist,
        },
        {
          hid: 'description',
          name: 'description',
          content: `${this.page.title} by ${this.page.artist}`,
        },
        {
          hid: 'og:title',
          name: 'og:title',
          content: this.page.title,
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content: `${this.page.title} by ${this.page.artist}`,
        },
        {
          hid: 'og:site_name',
          name: 'og:site_name',
          content: 'Dutch Art Daily',
        },
        {
          hid: 'og:image',
          name: 'og:image',
          content: `https://dutchartdaily.com/photos/${this.page.id}/${this.page.id}--xs3-${this.page.hash}.jpg`,
        },
        {
          hid: 'og:url',
          name: 'og:url',
          content: `https://dutchartdaily.com/${this.page.id}`,
        },
        {
          hid: 'twitter:card',
          name: 'twitter:card',
          content: 'photo',
        },
        {
          hid: 'twitter:site',
          name: 'twitter:site',
          content: 'Dutch Art Daily',
        },
        {
          hid: 'twitter:title',
          name: 'twitter:title',
          content: this.page.title,
        },
        {
          hid: 'twitter:creator',
          name: 'twitter:creator',
          content: this.page.artist,
        },
        {
          hid: 'twitter:url',
          name: 'twitter:url',
          content: `https://dutchartdaily.com/${this.page.id}`,
        },
        {
          hid: 'twitter:image',
          name: 'twitter:image',
          content: `https://dutchartdaily.com/photos/${this.page.id}/${this.page.id}--xs3-${this.page.hash}.jpg`,
        },
      ],
      link: [{ rel: 'apple-touch-icon', href: this.touchIcon }],
    }
  },
  computed: {
    ...mapState({
      slides: 'slides',
      currentArtworkHeight: 'currentArtworkHeight',
    }),
    ...mapGetters(['getArtworkById']),
    touchIcon() {
      return this.$icon ? this.$icon(192) : ''
    },
    routeDate() {
      return this.$route.params.date
    },
    artwork() {
      return this.getArtworkById(this.routeDate)
    },
    page() {
      return this.artwork
        ? this.artwork
        : {
            id: '',
            title: '',
            description: '',
            hash: '',
          }
    },
    currentSlideHeight() {
      return `height:${this.currentArtworkHeight}px`
    },
  },
}
</script>

<template>
  <div>
    <main class="l-page__main">
      <base-carousel
        name="carousel"
        :keyboard="true"
        :simulate-touch="true"
        class="l-page__carousel"
        :style="currentSlideHeight"
      >
        <artwork-slide
          v-for="slide in slides"
          :key="slide.id"
          :artwork="slide"
        />
      </base-carousel>
    </main>
    <nav class="l-page__nav">
      <timeline-nav-button direction="prev" />
      <timeline-nav class="l-page__timeline" />
      <timeline-nav-button direction="next" />
    </nav>
    <details-carousel class="l-page__details" />
  </div>
</template>

<style lang="scss">
@import '@theme';

.l-page__main {
  position: relative;
}

.l-page__carousel {
  height: calc(100vh - 280px);

  &.carousel--initialized {
    transition: height $speed-medium $base-easing;
  }

  @include media('<md') {
    margin-top: -#{$half-spacing + $quarter-spacing};
  }
}

.l-page__nav {
  z-index: z-index(fixed);
  display: flex;
  justify-content: space-between;
  margin: 0 $spacing;

  @include media('<md') {
    margin-top: -#{$half-spacing};
  }

  @include media('>max-width') {
    width: 100%;
    max-width: $max-width;
    margin-right: auto;
    margin-left: auto;
  }
}

.l-page__timeline {
  position: relative;
  z-index: z-index(step);
  max-width: 100%;
  margin: 0;
}

.l-page__details {
  margin: $half-spacing 0 $spacing 0;
  transition: height $speed-medium $base-easing;

  @include media('>md') {
    margin: $spacing 0;
  }
}
</style>
