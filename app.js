const firebaseConfig = {
  apiKey: 'AIzaSyB1QUF0y6-GPU0P_rYeWCkWGuQENZa_fLs',
  authDomain: 'vs-firebase-auth-8b92a.firebaseapp.com',
  projectId: 'vs-firebase-auth-8b92a',
  storageBucket: 'vs-firebase-auth-8b92a.appspot.com',
  messagingSenderId: '380375543997',
  appId: '1:380375543997:web:420a005bf70ece3a61c7d4',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

new Vue({
  el: '#app',
  data: {
    email: '',
    password: '',
    newEmail: '',
    newPassword: '',
    authUser: null,
    feedback: {
      cssClass: 'success',
      message: null,
    },
    editUserProps: {
      displayName: null,
      photoURL: null,
    },
  },
  methods: {
    register() {
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        .then((user) => {
          this.resetInputs();
          this.resetFeedback();
        })
        .catch((err) => {
          this.setFeedback('error', err.message);
        });
    },
    signIn() {
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then((user) => {
          this.resetInputs();
          this.resetFeedback();
        })
        .catch((err) => {
          this.setFeedback('error', err.message);
        });
    },
    signInWithGoogle() {
      const googleProvider = new firebase.auth.GoogleAuthProvider();
      firebase
        .auth()
        .signInWithPopup(googleProvider)
        .then((data) => console.log(data.user, data.credential.accessToken))
        .catch((err) => {
          this.setFeedback(err.message);
        });
    },
    updateProfile() {
      this.authUser.updateProfile({
        displayName: this.editUserProps.displayName,
        photoURL: this.editUserProps.photoURL,
      });
    },
    sendEmailVerification() {
      const actionCodeSettings = {
        url: `https://127.0.0.1:8000/?email=${this.authUser.email}`,
        iOS: {
          bundleId: 'com.example.ios',
        },
        android: {
          packageName: 'com.example.android',
          installApp: true,
          minimumVersion: '12',
        },
        handleCodeInApp: false,
      };

      firebase
        .auth()
        .currentUser.sendEmailVerification(actionCodeSettings)
        .then(function () {
          this.setFeedback(
            'success',
            'Check your email for a link or code to verify your account',
          );
        })
        .catch(function (err) {
          this.setFeedback('error', err.message);
        });
    },

    verifyEmail() {
      const actionCodeSettings = {
        url: `https://127.0.0.1:8000/?email=${this.authUser.email}`,
        iOS: {
          bundleId: 'com.example.ios',
        },
        android: {
          packageName: 'com.example.android',
          installApp: true,
          minimumVersion: '12',
        },
        handleCodeInApp: true,
      };
      firebase
        .auth()
        .currentUser.verifyBeforeUpdateEmail(
          // this.authUser,
          this.newEmail,
          actionCodeSettings,
        )
        .then(() => {
          this.setFeedback(
            'success',
            'Check your inbox and copy the verification code below.',
          );
        })
        .catch((err) => {
          this.setFeedback('error', err.message);
        });
    },
    updateEmail() {
      this.authUser
        .updateEmail(this.newEmail)
        .then(() => {
          this.signOut();
        })
        .catch((err) => {
          this.setFeedback('error', err.message);
        });
    },

    updatePassword() {
      this.authUser
        .updatePassword(this.newPassword)
        .then(() => {
          this.signOut(false);
          this.setFeedback(
            'success',
            'Please signin again following your password modification.',
          );
        })
        .catch((err) => {
          if (err.code === 'auth/requires-recent-login') {
            this.authUser.reauthenticateWithCredential();
            this.updatePassword();
            return;
          }
          this.setFeedback('error', err.message);
        });
    },
    signOut(runFeedbackReset = true) {
      firebase
        .auth()
        .signOut()
        .then(() => {
          if (runFeedbackReset) this.resetFeedback();
          this.setUser(null);
        });
    },
    setUser(user) {
      console.log(user);
      this.authUser = user;
      if (user) {
        this.editUserProps.displayName = user.displayName;
        this.editUserProps.photoURL = user.photoURL;
      }
    },
    setFeedback(result, message) {
      this.feedback.cssClass = result;
      this.feedback.message = message;
    },
    resetFeedback() {
      this.feedback.message = '';
    },
    resetInputs() {
      this.email = '';
      this.password = '';
    },
  },
  created() {
    firebase.auth().onAuthStateChanged((user) => this.setUser(user));
  },
});
