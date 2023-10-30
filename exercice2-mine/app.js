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
new Vue({
  el: '#app',
  components: {
    'notification-message': NotificationMessageComponent,
  },
});
