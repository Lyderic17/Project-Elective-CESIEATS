<template>
  <div>
    <v-card :loading="loading" class="mx-auto my-12" max-width="374">
      <template slot="progress">
        <v-progress-linear color="deep-purple" height="10" indeterminate></v-progress-linear>
      </template>

      <v-img height="250" :src="info.image.url"></v-img>

      <v-card-title>{{ info.name }}</v-card-title>

      <v-card-text>
        <v-row align="center" class="mx-0">
          <v-rating
            :value="rating"
            color="amber"
            dense
            half-increments
            readonly
            size="14"
          ></v-rating>

          <div class="grey--text ms-4">
            {{ rating }} ({{ Math.round(Math.random() * 2000) }})
          </div>
        </v-row>

        <div class="my-4 text-subtitle-1">$ • Italian, Cafe</div>

        <div>{{ info.description }}</div>
      </v-card-text>

      <v-divider class="mx-4"></v-divider>

      <v-card-title>Horaires :</v-card-title>

      <v-card-text>
        <v-chip-group
          v-model="selection"
          active-class="deep-purple accent-4 white--text"
          column
          v-for="op in info.openings"
          :key="op.name"
        >
          <v-chip>{{ op.open }}</v-chip>
          <v-chip>{{ op.close }}</v-chip>
        </v-chip-group>
      </v-card-text>

      <v-card-actions>
        <v-btn color="deep-purple lighten-2" text @click="reserve(info.id)">
          Commander
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

interface RestoInfo {
  image: {
    url: string;
    alt: string;
  };
  name: string;
  description: string;
  openings: Array<{ open: string; close: string }>;
  id: string;
}

@Component
export default class RestoCard extends Vue {
  @Prop({ required: true, default: () => ({}) }) public info!: RestoInfo;

  private loading = false;

  private selection = 1;

  private rating = Math.round(Math.random() * 50) / 10;

  private tags = ['Italien', 'Grill', 'Kebab', 'Grec'];

  private reserve(restoId: string) {
    this.$router.push(`/menu/${restoId}`);
    // this.loading = true
    // setTimeout(() => (this.loading = false), 2000)
  }
}
</script>
