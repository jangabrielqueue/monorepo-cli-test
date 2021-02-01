import React, { useState, useEffect } from 'react'
import * as firebase from 'firebase/app'
import 'firebase/analytics'

export const FirebaseContext = React.createContext({})

function FirebaseProvider ({ children }) {
  const [firebaseAnalytics, setFirebaseAnalytics] = useState(null)

  useEffect(() => {
    const queryString = window.location.search
    const urlQueryString = new URLSearchParams(queryString)
    const bank = urlQueryString.get('b')
    const merchant = urlQueryString.get('m')
    const reference = urlQueryString.get('r')
    const currency = urlQueryString.get('c1')
    const amount = urlQueryString.get('a')

    function initializeFirebase () { // Initialize Firebase
      if (!firebase.apps.length) {
        const {
          REACT_APP_FIREBASE_API_KEY,
          REACT_APP_FIREBASE_APP_ID,
          REACT_APP_FIREBASE_PROJ_ID,
          REACT_APP_FIREBASE_MSG_SENDER_ID,
          REACT_APP_FIREBASE_MEASUREMENT_ID
        } = process.env
        const firebaseConfig = {
          apiKey: REACT_APP_FIREBASE_API_KEY,
          authDomain: '',
          databaseURL: '',
          projectId: REACT_APP_FIREBASE_PROJ_ID,
          storageBucket: '',
          messagingSenderId: REACT_APP_FIREBASE_MSG_SENDER_ID,
          appId: REACT_APP_FIREBASE_APP_ID,
          measurementId: REACT_APP_FIREBASE_MEASUREMENT_ID
        }
        firebase.initializeApp(firebaseConfig)

        try {
          const analytics = firebase.analytics()
          analytics.logEvent('open_deposit_page', {
            bank,
            merchant,
            reference,
            currency,
            amount
          })
          setFirebaseAnalytics(analytics)
        } catch (error) {
          console.error(error)
        }
      }
    }

    initializeFirebase()
  }, [])

  return (
    <FirebaseContext.Provider value={firebaseAnalytics}>
      {
        children
      }
    </FirebaseContext.Provider>
  )
}

export default FirebaseProvider
