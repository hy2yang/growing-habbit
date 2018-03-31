import React, { Component } from 'react';
import './App.css';
import Alert from './Alert';
import Banner from './Banner';
import StudyPage from './StudyPage';
import FavPage from './FavPage';
import MyCardsPage from './MyCards';
import SharedCardsPage from './SharedCardsPage';
const connection = require('./connection');


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentId : this.props.currentId,
      selectedId : null,
      selectedWordId: null,
      '.study-page' : '',
      '.favorite-page' : '',
      '.my-cards-page' : '',
      '.shared-cards-page' : ''
    };
  }

  componentDidMount(){
    this.addSelectListener();
    this.initializeOption();
  }

  render() { 
    
    const loading=require('./loading.gif');

    return (
      <div className='App'>
        <div className='hidden' id='loading'><p className='img'><img src={loading} alt="loading gif"/></p></div>

        <div className='homepage'>
          
          <Banner text={'Welcome to Vermillion Flashcard! User '} id={this.state.currentId}/>

          <div className='slogan'>
            <p id='slogan-study'>STUDY: <span id='slogan-easier'>Easier</span></p>
            <p id='slogan-faster'>Faster</p>
            <p id='slogan-harder'>Harder</p>
          </div>

          <div className='homepage-buttons'>
            <button onClick={() => this.goToView('.study-page')}>PRESTORED</button>
            <button onClick={() => this.goToView('.favorite-page')}>FAVORITE</button>
            <button onClick={() => this.goToView('.my-cards-page')}>CUSTOM</button>            
            <select id='homepage-dropbtn'></select>            
          </div>
          
        </div>

        <div>
          <StudyPage actualJSON={this.state['.study-page']} currentUserId={this.state.currentId} 
          clickExitButton={() => this.backToHome('.study-page')}/>
          
          <FavPage wordList={this.state['.favorite-page']} currentUserId={this.state.currentId} 
          clickBackButton={() => this.backToHome('.favorite-page')} setStudyList={(list)=>this.setStudyList(list)}/>

          <MyCardsPage wordList={this.state['.my-cards-page']} currentUserId={this.state.currentId} 
          clickBackButton={() => this.backToHome('.my-cards-page')} setStudyList={(list)=>this.setStudyList(list)}/>

          <SharedCardsPage wordList={this.state['.shared-cards-page']} currentUserId={this.state.currentId} 
          clickBackButton={() => this.backToHome('.shared-cards-page')} setStudyList={(list)=>this.setStudyList(list)}/>

        </div>       
        
        <Alert message='custom alert message' onClick={() => this.hideElement('.alert')} />

      </div>
    );

  }

  setStudyList(list){
    this.setState({'.study-page': list}, ()=>{
      this.studyList();
    });    
  }

  studyList(){
    const views=['.favorite-page','.my-cards-page','.shared-cards-page'];
    for (let i of views){
      this.hideElement(i);
    }
    this.showElement('.study-page');
  }

  goToView(queryString) {

    this.hideElement('.homepage');
    this.showElement('#loading');

    const views={'.study-page':'/prestored'
    ,'.favorite-page':'/users/'+this.state.currentId+'/fav'
    ,'.my-cards-page':'/users/'+this.state.currentId+'/custom'
    ,'.shared-cards-page' : '/users/'+this.state.selectedId+'/custom'
    };

    for (let i in views){
      this.hideElement(i);
    }

    connection.fetchJsonFrom(views[queryString],'get', this.state.currentId)
    .then(json => {
      this.setState({[queryString] : json}, ()=>{
        this.hideElement('#loading');      
        this.showElement(queryString);
      });
      
    })
    .catch((error) => {
    if (error.toString().startsWith('error-')) {
        return Promise.reject(error);
    }
    return Promise.reject('error-response-json-bad');
    });    

  }

  async initializeOption(){
    const drop = document.getElementById('homepage-dropbtn');
    drop.options.length = 0;
    const placeholder = document.createElement('option');
    placeholder.text = 'SHARED';
    placeholder.value = 'placeholder';
    placeholder.selected = 'selected';
    placeholder.disabled = 'disabled';
    drop.add(placeholder); 

    let list = await connection.getUserList();
    for (let id of list.activeUsers){
        if (id === this.state.currentId) continue;
        let option = document.createElement('option');
        option.text = +id;        
        drop.add(option);
    }    
  }

  addSelectListener(){
    const select=document.getElementById('homepage-dropbtn');
    select.addEventListener('change', ()=>{
      this.setState({selectedId : select.value}, 
        ()=>{
          this.goToView('.shared-cards-page');
          select.value = 'placeholder';
        }
      )
    });
  }

  hideElement(queryString) {
    document.querySelector(queryString).classList.add('hidden');
  }

  showElement(queryString) {
    document.querySelector(queryString).classList.remove('hidden');
  }

  backToHome(curView){
    this.hideElement(curView);
    this.showElement('.homepage');
    this.setState({selectedWordId: null})
  }

}

export default App;
