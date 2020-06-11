import React, {useState} from 'react';
import './App.css';
import { Inject, ScheduleComponent, Day, Week, WorkWeek, Month, Agenda, ViewsDirective, ViewDirective, EventSettingsModel } from '@syncfusion/ej2-react-schedule';
//import {DataManager, UrlAdaptor} from '@syncfusion/ej2-data';
//import {DropDownListComponent} from "@syncfusion/ej2-react-dropdowns";
import { DateTimePickerComponent} from "@syncfusion/ej2-react-calendars";
import AddSchedule from './components/AddSchedule';

var randomColor = require('randomcolor');



export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      uvs: [],
      colourMap: {}
    };
    this.getSchedule = this.getSchedule.bind(this)

  }


  componentDidMount() {
    this.setState({
      isLoaded: true
    });
    this.render();
  }

  static onEventRendered(args) {
    App.applyCategoryColor(args);
  }

  assignateColours(cal){
    let colourMap = this.state.colourMap;
    for (let [, course] of Object.entries(cal)){
      let uvName = course.Subject;
      if (uvName in colourMap){
        course.CategoryColor = colourMap[uvName];
      }
      else{
        colourMap[uvName] = randomColor({luminosity: 'bright'});
        course.CategoryColor = colourMap[uvName];
      }
    }
    console.log('colormap', colourMap);
    return cal;
  }

  static applyCategoryColor(args){
    let categoryColor = args.data.CategoryColor;
    if (!args.element || !categoryColor) {
      return;
    }
    args.element.style.backgroundColor = categoryColor;
  }

  static processJsonCal(cal) {
    let fittedCal = [];
    for (let [, course] of Object.entries(cal)) {
      let properDate = App.parseDate(course);
      fittedCal.push(properDate);
    }
    return fittedCal;
  }

  static freqCourse(type){
    if (type === 'TP'){
      return 'FREQ=WEEKLY;INTERVAL=2'
    }
    else{
      return 'FREQ=WEEKLY;INTERVAL=1'
    }
  }
  static parseDate(course) {
    const dayMapper = {
      'LUNDI': 1,
      'MARDI': 2,
      'MERCREDI': 3,
      'JEUDI': 4,
      'VENDREDI': 5,
      'SAMEDI': 6,
      'DIMANCHE': 7,
    };

    let sep1 = course.begin.split(':');
    let sep2 = course.end.split(':');
    let today = new Date();
    let begin = new Date(today.getFullYear(), today.getMonth(), dayMapper[course.day], parseInt(sep1[0]), parseInt(sep1[1]));
    let end = new Date(today.getFullYear(), today.getMonth(), dayMapper[course.day], parseInt(sep2[0]), parseInt(sep2[1]));

    return {
      Subject: course.uv,
      StartTime: begin,
      EndTime: end,
      Description: course.type + ' - ' + course.group,
      Location: course.room,
      RecurrenceRule: App.freqCourse(course.type),
      ResourceId: 1 //TODO
    }
  }

  getSchedule(id) {
    fetch('https://cors-anywhere.herokuapp.com/https://webapplis.utc.fr/Edt_ent_rest/myedt/result/?login=' + id )
        .then(res => res.json())
        .then(

            (result) => {
              console.log(Object.values(App.processJsonCal(result)));
              let cal = App.processJsonCal(result);
              cal = this.assignateColours(cal);
              this.setState({
                uvs: Object.values(cal),
                isLoaded: true
              });
              console.log(this.state.uvs);
              this.render();
            },
            (error) => {
              this.setState({
                isLoaded: true,
                error
              });

            }
        )

  }




  static editorWindowTemplate(props){
    return (
        <table className= 'utc-event-editor' style={{width: '100%'}}>
      <tbody>
      <tr>
        <td className='e-textlabel'>UV</td>
        <td><input id='UV' className='e-field e-input' data-name='Subject' type='text' value={props.Subject} style={{width: '100%'}}/></td>
      </tr>
      <tr>
        <td className='e-textlabel'>De :</td>
        <td><DateTimePickerComponent id='Start-Time' data-name='StartTime' value={new Date(props.StartTime)} className='e-field'/>
        </td>
      </tr>
      <tr>
        <td className='e-textlabel'>À :</td>
        <td><DateTimePickerComponent id='End-Time' data-name='EndTime' value={new Date(props.EndTime)} className='e-field'/>
        </td>
      </tr>
      <tr>
        <td className='e-textlabel'>Salle</td>
        <td><input id='TYPE' data-name='Location' type='text' className='e-field' value={props.Location} style={{width: '100%'}}/></td>
      </tr>
      <tr>
        <td className='e-textlabel'>Type</td>
        <td><input id='TYPE' data-name='Description' type='text' value={props.Description} className='e-field'/></td>
      </tr>

      </tbody>
    </table>)

  }

  render(){
    if (this.state.error) {
      return <div>Erreur : {this.state.error.message}</div>;
    } else if (!this.state.isLoaded) {
      return <div>Chargement…</div>;
    } else {
      return (
          <div>
            <div>
            <AddSchedule name={'add'} getSchedule={this.getSchedule}/>
              Supprimer :
            </div>
            <ScheduleComponent width='100%'  currentView='Week' eventSettings = {{dataSource: this.state.uvs}}
                               editorTemplate={App.editorWindowTemplate.bind(this.state.uvs)}
                               eventRendered={App.onEventRendered.bind(this)} >

              <ViewsDirective>
                <ViewDirective option='WorkWeek' startHour='7:00' endHour='20:00'/>
                <ViewDirective option='Week' startHour='07:00' endHour='20:00'/>
                <ViewDirective option='Month' showWeekend={true}/>
              </ViewsDirective>

              <Inject services={[Day,  Week, WorkWeek, Month, Agenda]}/>
            </ScheduleComponent>
          </div>

      )

    }

  }

}

export default App;
