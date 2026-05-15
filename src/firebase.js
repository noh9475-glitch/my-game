import { initializeApp } from 'firebase/app'
import { getAnalytics, isSupported } from 'firebase/analytics'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyBhhxx9v0i_kYWOwizv61V3ktkAvnlNBHY',
  authDomain: 'black-room-8145e.firebaseapp.com',
  projectId: 'black-room-8145e',
  storageBucket: 'black-room-8145e.firebasestorage.app',
  messagingSenderId: '830489884836',
  appId: '1:830489884836:web:3921f2835b9b8a6c3f8e31',
  measurementId: 'G-VSR07ZJVED',
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
export const db = getFirestore(app)

export const analyticsPromise = isSupported().then((supported) => {
  if (!supported) return null
  return getAnalytics(app)
})
