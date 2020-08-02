import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Modal,
  ActivityIndicator,
  StatusBar,
  Switch
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { switchTheme } from './../redux/themeActions';
import { lightTheme, darkTheme } from './../Theme';

import Colors from './../Color';
import TodoList from './TodoList';
import AddListModal from './AddListModal';

import Fire from './../Fire';

class Home extends React.Component {
  state = {
    addTodoVisible: false,
    lists: [],
    user: {},
    loading: true
  }

  componentDidMount() {
    firebase = new Fire((error, user) => {
      if (error) {
        return alert('Ters girden bir şeyler var.')
      }

      firebase.getLists(lists => {
        this.setState({ lists, user }, () => {
          this.setState({ loading: false });
        });
      });

      this.setState({ user });
    });
  }

  componentWillUnmount() {
    firebase.detach();
  }

  toggleAddtodoModal() {
    this.setState({ addTodoVisible: !this.state.addTodoVisible });
  }

  renderList = list => {
    return <TodoList list={list} updateList={this.updateList} />
  }

  addList = list => {
    firebase.addList({
      name: list.name,
      color: list.color,
      todos: []
    })
  }

  updateList = list => {
    firebase.updateList(list);
  }

  render() {
    if (this.state.loading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size='large' color={Colors.blue} />
        </View>
      )
    }

    return (
      <ThemeProvider theme={this.props.theme}>
        <StatusBar barStyle={this.props.theme.STATUS_BAR_STYLE} />
        <View
          style={[
            styles.container,
            { backgroundColor: this.props.theme.mode === 'light' ? Colors.white : Colors.darkBlack }
          ]}
        >
          <Modal
            animationType='slide'
            visible={this.state.addTodoVisible}
            onRequestClose={() => this.toggleAddtodoModal()}
          >
            <AddListModal closeModal={() => this.toggleAddtodoModal()} addList={this.addList} />
          </Modal>

          {this.props.theme.mode === 'light' ? (
            <TouchableOpacity onPress={() => this.props.switchTheme(darkTheme)} style={styles.themeButton}>
              <Text style={{ fontSize: 15 }}>🌙</Text>
            </TouchableOpacity>
          ) : (
              <TouchableOpacity onPress={() => this.props.switchTheme(lightTheme)} style={styles.themeButton}>
                <Text style={{ fontSize: 15 }}>☀</Text>
              </TouchableOpacity>
            )}

          <View style={{ flexDirection: 'row' }}>
            <View style={styles.divider} />
            <Text style={styles.title}>
              <Text style={{ color: this.props.theme.mode === 'light' ? Colors.darkBlack : Colors.white }}>
                Todo&nbsp;
            </Text>
              <Text style={{ fontWeight: '300', color: Colors.blue }}>Lists</Text>
            </Text>
            <View style={styles.divider} />
          </View>

          <View style={{ marginVertical: 48 }}>
            <TouchableOpacity style={styles.addList} onPress={() => this.toggleAddtodoModal()}>
              <AntDesign name='plus' size={16} color={Colors.blue} />
            </TouchableOpacity>

            <Text style={styles.add}>Add List</Text>
          </View>

          <View style={{ height: 275, paddingLeft: 32 }}>
            <FlatList
              data={this.state.lists}
              keyExtractor={item => item.id.toString()}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => this.renderList(item)}
              keyboardShouldPersistTaps='always'
            />
          </View>
        </View>
      </ThemeProvider>
    );
  }
}

const mapStateToProps = (state) => ({
  theme: state.themeReducer.theme,
});

const mapDispatchToProps = dispatch => ({
  switchTheme: bindActionCreators(switchTheme, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Home);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    backgroundColor: Colors.lightBlue,
    height: 1,
    flex: 1,
    alignSelf: 'center'
  },
  title: {
    fontSize: 38,
    fontWeight: '800',
    color: Colors.black,
    paddingHorizontal: 64,
  },
  addList: {
    borderWidth: 2,
    borderColor: Colors.blue,
    borderRadius: 4,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  add: {
    color: Colors.blue,
    fontWeight: '600',
    fontSize: 14,
    marginTop: 8,
  },
  themeButton: {
    position: 'absolute',
    top: 50,
  }
});
