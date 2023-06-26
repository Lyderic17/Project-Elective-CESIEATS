<template>
  <div>
    <v-text-field v-model="new_address"
    :rules="otherRules" label="Adresse" clearable>{{
      deliveryData.adresse
    }}</v-text-field>
    <v-text-field v-model="new_number"
    :rules="otherRules" label="Numéro d'appartement, porte, étage" clearable>{{
      deliveryData.number
    }}</v-text-field>
    <v-text-field v-model="new_code"
    :rules="otherRules" label="Code de la porte / nom de famille" clearable>{{
      deliveryData.code
    }}</v-text-field>
    <v-text-field v-model="new_complement" label="Complement" clearable>{{
      deliveryData.complement
    }}</v-text-field>
  </div>
</template>

<script>
import Options from 'vue-class-component';
import Vue from 'vue';

@Options({
  components: {},
  data: () => ({
    new_address: null,
    new_number: null,
    new_code: null,
    new_complement: null,
    otherRules: [
      (v) => (!!v) || 'Requis',
      /* (v) => (v && v.length <= 10) || "Doit étre d'au moins 10 characters", */
    ],
  }),
  props: {
    deliveryData: Object,
  },
  watch: {
    value() {
      this.$emit('input', this.value);
    },
  },
})
export default class DeliveryInfos extends Vue {}
</script>
