import React from 'react';
import {
  Alert,
  Button,
  FlatList,
  Image,
  Modal,
  StatusBar,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Feather from 'react-native-vector-icons/Feather';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ImageViewer from 'react-native-image-zoom-viewer';

interface Istate {
  imageUrl: string[];
  isModal: boolean;
  uri?: string | null;
  id: string;
}
interface Iprops {}
class Imagepicker extends React.Component<Iprops, Istate> {
  constructor(props: Iprops) {
    super(props);
    this.state = {
      imageUrl: [],
      isModal: false,
      uri: null,
      id: '',
    };
  }
  getStoreImage = async () => {
    try {
      const storedImage = await AsyncStorage.getItem('storedImages');
      if (storedImage !== null) {
        console.log('getStoreImage');
        this.setState({imageUrl: JSON.parse(storedImage)});
      }
    } catch (err) {
      console.log(err);
    }
  };
  storeImage = async (uri: string) => {
    try {
      const storedImages = await AsyncStorage.getItem('storedImages');
      console.log('getStoreImage2');
      let imageUrl = [];
      if (storedImages !== null) {
        imageUrl = JSON.parse(storedImages);
      }
      imageUrl.push({uri: uri, id: Date.now().toString()});
      await AsyncStorage.setItem('storedImages', JSON.stringify(imageUrl));
      this.setState({imageUrl});
      console.log('success set');
    } catch (err) {
      console.log(err);
    }
  };
  deleteImage = async (id: string) => {
    const v = this.state.imageUrl.filter((val:any) => val.id !== id && val);
    await AsyncStorage.setItem('storedImages', JSON.stringify(v));

    try {
      const storedImage = await AsyncStorage.getItem('storedImages');
      console.log('getimages3');
      let imageUrl = [];
      if (storedImage !== null) {
        imageUrl = JSON.parse(storedImage);
      }

      await AsyncStorage.setItem('storedImages', JSON.stringify(v));
      this.setState({imageUrl});
      console.log('success delete');
    } catch (err) {
      console.log(err);
    }
  };
  camera = () => {
    launchCamera({mediaType: 'photo'}, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        let source: any = response;

        this.storeImage(source.assets[0].uri);
      }
    });
  };
  library = () => {
    launchImageLibrary({mediaType: 'photo'}, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        let source: any = response;

        this.storeImage(source.assets[0].uri);
      }
    });
  };
  chooseFile = () => {
    Alert.alert('Add Image', ' ', [
      {
        text: 'take photo',
        onPress: () => this.camera(),
        style: 'cancel',
      },
      {text: 'Open gallary', onPress: () => this.library()},
    ]);
  };

  componentDidMount(): void {
    this.getStoreImage();
  }
  renderItem = ({item}: any) => (
    <View style={{marginLeft: 23, marginVertical: 10}}>
      <TouchableOpacity
        onPress={() => {
          this.setState({
            isModal: !this.state.isModal,
            uri: item.uri,
            id: item.id,
          });

          //this.props.navigation.navigate('Singleimage',{id:item.id, uri:item.uri})
          //
        }}>
        <Image
          source={{uri: item.uri}}
          style={{height: 170, width: 170, borderRadius: 10}}
        />
      </TouchableOpacity>
    </View>
  );
  render(): React.ReactNode {
    console.log(this.state.imageUrl);
    console.log(Date.now().toString());

    return (
      <View style={{flex: 1, backgroundColor: '#'}}>
        <StatusBar backgroundColor="#0288d1" barStyle={'light-content'} />
        <View
          style={{
            flexDirection: 'row',
            marginHorizontal: 20,
            marginVertical: 10,
            justifyContent: 'space-between',
          }}>
          <Fontisto
            name="nav-icon-list-a"
            size={20}
            color="#313c3d"
            style={{marginTop: 12}}
          />
          <View style={{flexDirection: 'row', margin: 0}}>
            <Text style={{color: '#7d8081', fontSize: 30, fontWeight: '300'}}>
              photo
            </Text>
            <Text style={{color: '#35464a', fontSize: 30, fontWeight: '600'}}>
              gallery
            </Text>
          </View>
          <TouchableOpacity onPress={this.chooseFile}>
            <Feather
              name="upload"
              size={25}
              color="#393f3f"
              style={{marginTop: 12}}
            />
          </TouchableOpacity>
        </View>

        <FlatList
          data={this.state.imageUrl}
          renderItem={this.renderItem}
          numColumns={2}
        />
        <Modal visible={this.state.isModal} transparent={true}>
          <View
            style={{
              flex: 1,
              backgroundColor: '#000000aa',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                height: 450,
                width: 350,
                backgroundColor: '#ffffff',
                borderRadius: 10,
              }}>
              <Image
                source={{uri: this.state.uri}}
                style={{height: 400, width: 350, borderRadius: 10}}
                resizeMode="cover"
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  onPress={() => this.setState({isModal: false})}>
                  <MaterialCommunityIcons
                    name="close-thick"
                    size={30}
                    color="#000000aa"
                    style={{marginTop: 12}}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({isModal: false});
                    this.deleteImage(this.state.id);
                  }}>
                  <MaterialCommunityIcons
                    name="delete"
                    size={30}
                    color="#000000aa"
                    style={{marginTop: 12}}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
export default Imagepicker;

function alert(customButton: any) {
  throw new Error('Function not implemented.');
}
