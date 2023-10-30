let NotificationMessageComponent = {
  template: '#notification-message-template',
  props: {
    notificationType: {
      type: String,
      default: 'info',
    },
  },
  data() {
    return {
      hidden: false,
    };
  },
  methods: {
    hideMessage() {
      this.hidden = true;
    },
  },
};
Vue.createApp({
  components: {
    'notification-message': NotificationMessageComponent,
  },
}).mount('#app');
