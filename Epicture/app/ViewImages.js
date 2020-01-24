import React, {
  View,
  Text,
  Component,
  StyleSheet,
  TouchableHighlight,
  ScrollView,
  Image,
  Dimensions,
  ListView
} from 'react-native';
let windowWidth = Dimensions.get('window').width;
import API from './api';
let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
class ViewImages extends Component {
  constructor (props) {
    super(props)
    this.state = {
      dataSource: ds,
      loading: true,
      images: []
    }
  }
componentDidMount () {
    API.get(this.props.category)
      .then((response) => {
        this.setState({
          dataSource: ds.cloneWithRows(response.data.items),
          loading: false
        })
      }, (error) => {
      console.log('error: ', error)
    })
  }
  renderRow (rowData) {
    if (rowData.link.match(/\.(jpg|png|gif)/g)) {
      return (
        <View>
          <Image
            source={{ uri: rowData.link }}
            style={{width: windowWidth, height: windowWidth}} />
        </View>)
    } else {
      return null
    }
  }
  render () {
    let { loading, images } = this.state
    if (loading) {
      images = (
        <View style={style.loadingContainer}>
          <Text style={style.loading}>Loading images…</Text>
        </View>)
    }
    if (!loading) {
      images = <ListView
                 dataSource={this.state.dataSource}
                 renderRow={this.renderRow.bind(this)} />
    }
    return (
      <View style={{flex: 1}}>
        <TouchableHighlight
          underlayColor='transparent'
          onPress={this.props.closeModal.bind(this)}
          style={style.closeButton}>
          <Text style={style.closeButtonText}>CLOSE</Text>
        </TouchableHighlight>
        <ScrollView style={{flex: 1}}>
          {images}
        </ScrollView>
      </View>
    )
  }
}