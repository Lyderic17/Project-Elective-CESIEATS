<template>
  <div class='dashboard'>
    <v-row align='center' no-gutters style='height: 150px v-block'>
      <v-col>
        <v-banner>Logs :</v-banner>
      </v-col>
      <v-col>
        <v-banner>Notifications :</v-banner>
      </v-col>
    </v-row>
    <v-row align='center' no-gutters style='height: 150px v-block'>
      <v-col>
        <v-data-table
          :headers='headers'
          :items='action'
          :items-per-page='5'
          class='elevation-1'
        ></v-data-table>
      </v-col>
      <v-col>
        <!-- notification -->
        <v-card>
          <v-form>
            <v-container>
              <v-row>
                <v-col style='padding-bottom: 0px; margin-bottom: -16px;'>
                  <v-text-field
                    v-model='message'
                    append-outer-icon='mdi-send'
                    filled
                    clear-icon='mdi-close-circle'
                    clearable
                    label='Envoyer une notification'
                    type='text'
                    @click:append-outer='sendMessage'
                    @click:clear='clearMessage'
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-form>

          <v-list subheader two-line flat>
            <v-list-item-group multiple>
              <v-list-item>
                <template v-slot:default='{ active }'>
                  <v-list-item-action>
                    <v-checkbox
                      :input-value='active'
                      color='primary'
                    ></v-checkbox>
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title>Clients</v-list-item-title>
                  </v-list-item-content>
                </template>
              </v-list-item>

              <v-list-item>
                <template v-slot:default='{ active }'>
                  <v-list-item-action>
                    <v-checkbox
                      :input-value='active'
                      color='primary'
                    ></v-checkbox>
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title>Livreurs</v-list-item-title>
                  </v-list-item-content>
                </template>
              </v-list-item>

              <v-list-item>
                <template v-slot:default='{ active }'>
                  <v-list-item-action>
                    <v-checkbox
                      :input-value='active'
                      color='primary'
                    ></v-checkbox>
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title>Restaurateurs</v-list-item-title>
                  </v-list-item-content>
                </template>
              </v-list-item>

              <v-list-item>
                <template v-slot:default='{ active }'>
                  <v-list-item-action>
                    <v-checkbox
                      :input-value='active'
                      color='primary'
                    ></v-checkbox>
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title>Admins / developeurs</v-list-item-title>
                  </v-list-item-content>
                </template>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
    <v-row align='center' no-gutters style='height: 150px v-block'>
      <v-col>
        <v-banner>Nombre de Connexion :</v-banner>
      </v-col>
    </v-row>
    <v-row>
      <v-data-table
        :headers='headers2'
        :items='logins'
        :items-per-page='5'
        class='elevation-1'
        style='width: -webkit-fill-available;'
      ></v-data-table>
    </v-row>
    <v-row>
      <v-sparkline
        :value='value'
        :gradient='gradient'
        :smooth='radius || false'
        :padding='padding'
        :line-width='width'
        :stroke-linecap='lineCap'
        :gradient-direction='gradientDirection'
        :fill='fill'
        :type='type'
        :auto-line-width='autoLineWidth'
        auto-draw
      ></v-sparkline>
    </v-row>
  </div>
</template>

<script>
import Options from 'vue-class-component';
import Vue from 'vue';

const gradients = [
  ['#222'],
  ['#42b3f4'],
  ['red', 'orange', 'yellow'],
  ['purple', 'violet'],
  ['#00c6ff', '#F0F', '#FF0'],
  ['#f72047', '#ffd200', '#1feaea'],
];

@Options({
  components: {},
  data: () => ({
    width: 2,
    radius: 10,
    padding: 8,
    lineCap: 'round',
    gradient: gradients[5],
    value: [4, 5, 3, 6, 4, 2],
    gradientDirection: 'top',
    gradients,
    fill: false,
    type: 'trend',
    autoLineWidth: false,
    headers: [
      {
        text: 'Utilisateur',
        align: 'start',
        sortable: false,
        value: 'user',
      },
      { text: 'Requette', value: 'request' },
      { text: 'Page', value: 'page' },
    ],
    headers2: [
      {
        text: 'Temp',
        align: 'start',
        sortable: false,
        value: 'temps',
      },
      { text: 'Clients', value: 'clients' },
      { text: 'Livreurs', value: 'livreurs' },
      { text: 'restaurateurs', value: 'restaurateurs' },
      { text: 'devs', value: 'devs' },
      { text: 'Admins', value: 'admins' },
      { text: 'Commerciaux', value: 'commerciaux' },
      { text: 'Total', value: 'total' },
    ],
    action: [
      {
        user: 'julien hugo',
        request: 'post',
        page: 'cart',
      },
      {
        user: 'marc amon',
        request: 'get',
        page: 'account',
      },
      {
        user: 'silevie marcar',
        request: 'get',
        page: 'delivery',
      },
      {
        user: 'batien picard',
        request: 'put',
        page: 'Menu',
      },
      {
        user: 'silevie marcar',
        request: 'get',
        page: 'account',
      },
    ],
    logins: [
      {
        temps: '2021-02-07/13:25',
        clients: 1,
        livreurs: 0,
        restaurateurs: 0,
        devs: 0,
        admins: 1,
        commerciaux: 0,
        total: 2,
      },
      {
        temps: '2021-02-07/13:24',
        clients: 1,
        livreurs: 2,
        restaurateurs: 0,
        devs: 1,
        admins: 1,
        commerciaux: 0,
        total: 4,
      },
      {
        temps: '2021-02-07/13:23',
        clients: 2,
        livreurs: 2,
        restaurateurs: 0,
        devs: 2,
        admins: 0,
        commerciaux: 0,
        total: 6,
      },
      {
        temps: '2021-02-07/13:22',
        clients: 1,
        livreurs: 1,
        restaurateurs: 0,
        devs: 0,
        admins: 1,
        commerciaux: 0,
        total: 3,
      },
      {
        temps: '2021-02-07/13:21',
        clients: 2,
        livreurs: 1,
        restaurateurs: 1,
        devs: 0,
        admins: 1,
        commerciaux: 0,
        total: 5,
      },
      {
        temps: '2021-01-07/13:20',
        clients: 2,
        livreurs: 1,
        restaurateurs: 0,
        devs: 1,
        admins: 1,
        commerciaux: 0,
        total: 4,
      },
    ],
    show: false,
    message: 'Bonjours à tous, ',
    iconIndex: 0,
  }),
  methods: {
    sendMessage() {
      this.resetIcon();
      this.clearMessage();
    },
    clearMessage() {
      this.message = '';
    },
  },
  beforeMount() {
    if (this.getUserId.role !== 0
    && this.getUserId.role !== 1
    && this.getUserId.role !== 2
    && this.getUserId.role !== 6) {
      this.$router.push('/');
    }
  },
  computed: {
    icon() {
      return this.icons[this.iconIndex];
    },
    getUserId() {
      return this.$store.getters.getUser;
    },
  },
})
export default class Dashboard extends Vue {}
</script>
