import firebase from 'firebase';
import '@firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyD4_SAVeFAxGhuW7d_5SxrXR8xVkA0BRps',
  authDomain: 'todolistmobile-ebda3.firebaseapp.com',
  databaseURL: 'https://todolistmobile-ebda3.firebaseio.com',
  projectId: 'todolistmobile-ebda3',
  storageBucket: 'todolistmobile-ebda3.appspot.com',
  messagingSenderId: '591649347453',
  appId: '1:591649347453:web:adbde55d054bfbf5b5de14'
}

class Fire {
  constructor(callback) {
    this.init(callback);
  }

  init(callback) {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        callback(null, user)
      } else {
        firebase.auth().signInAnonymously().catch(error => {
          callback(error);
        });
      }
    })
  }

  getLists(callback) {
    let ref = this.ref.orderBy('name');

    this.unsubscribe = ref.onSnapshot(snapshot => {
      lists = [];

      snapshot.forEach(doc => {
        lists.push({
          id: doc.id,
          ...doc.data()
        })
      });

      callback(lists);
    });
  }

  addList(list) {
    let ref = this.ref;
    ref.add(list);
  }

  updateList(list) {
    let ref = this.ref;
    ref.doc(list.id).update(list);
  }

  get userId() {
    return firebase.auth().currentUser.uid;
  }

  get ref() {
    return firebase
      .firestore()
      .collection('users')
      .doc(this.userId)
      .collection('lists');
  }

  detach() {
    this.unsubscribe();
  }
}

export default Fire;