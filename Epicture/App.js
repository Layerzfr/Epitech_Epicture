import React, {
  View,
  Text,
  Component,
  TextInput,
  StyleSheet,
  TouchableHighlight,
  ScrollView
} from 'react-native'
import Realm from 'realm'
import _ from 'lodash'
let realm = new Realm({
  schema: [{name: 'Categories', properties: {name: 'string'}}]
})
let favs = realm.objects('Categories')