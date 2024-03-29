import React, { useState, useEffect } from 'react';

import './css/editor.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faVolumeMute, faVolumeUp, faPause, faPlay, faGripLinesVertical, faSync, faStepBackward, faStepForward, faCamera, faDownload, faEraser } from '@fortawesome/free-solid-svg-icons'
import Testing1 from './testing1';
import './testing1.css';




class Editor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isMuted: false,
            timings: this.props.projectData.nuggets[0].timings ? this.props.projectData.nuggets[0].timings : [],
            playing: false,
            currently_grabbed: {"index": 0, "type": "none"},
            difference: 0.2,
            deletingGrabber: false,
            current_warning: null,
            imageUrl: "",
            tuqui : "",
            totalDuration: 0,
            formatedTimings: []
            
        }
        this.playVideo = React.createRef();
        this.progressBar = React.createRef();
        this.playBackBar = React.createRef();

        
    }
    
    // if (this.props.projectData) {
    //     var bornTimings =  this.props.projectData.nuggets[0].timings
    // }else{
    //     var bornTimings = [{
    //         start: 0,
    //         end: 0
    //     }]
    // }
  
    warnings = {
        "delete_grabber": (<div>Seleccione el punto de partida o de fin del corte que desea eliminar.</div>)
    }

    reader = new FileReader();


    componentDidMount = () => {
        
        if (this.props.projectData) {
            this.setState({timings: this.props.projectData.nuggets[0].timings })
        }

        
        // Check if video ended
        var self = this
        
        this.playVideo.current.addEventListener('timeupdate', function () {
            
            self.playVideo.current.duration = 120
            self.playVideo.current.start = 0

            var curr_idx = self.state.currently_grabbed.index
            var seek = (self.playVideo.current.currentTime - self.state.timings[curr_idx].start) / self.playVideo.current.duration * 100;
            self.progressBar.current.style.width = `${seek}%`;
            
            // this.setState({duration: 25})

            if ((self.playVideo.current.currentTime >= self.state.timings[self.state.timings.length-1].end)){
                self.playVideo.current.pause()
                self.setState({playing: false})
            }
            else if(self.playVideo.current.currentTime >= self.state.timings[curr_idx].end){
                if((curr_idx+1) < self.state.timings.length){
                    self.setState({currently_grabbed: {"index": curr_idx+1, "type": "start"}}, () => {
                        self.progressBar.current.style.width = '0%'
                        self.progressBar.current.style.left = `${self.state.timings[curr_idx+1].start / self.playVideo.current.duration * 100}%`;
                        self.playVideo.current.currentTime = self.state.timings[curr_idx+1].start;
                    })
                }
            }

        });
        
        window.addEventListener("keyup", function (event) {
            if (event.key === " ") {
                self.play_pause();
            }
        });
        var time = this.state.timings

        


        this.playVideo.current.onloadedmetadata = () => {
            
            this.setState({ totalDuration: this.playVideo.current.duration}, () => {
                this.addActiveSegments()
            });
        }
        
        
        
        this.props.recordTimings(this.state.timings)
    }

    reset = () => {
        
        this.playVideo.current.pause()
        this.setState({
            isMuted: false,
            timings: [{'start': 0, 'end': this.playVideo.current.duration}],
            playing: false,
            currently_grabbed: {"index": 0, "type": "none"},
            difference: 0.2,
            deletingGrabber: false,
            current_warning: null,
            imageUrl: ""
        }, () => {
            this.playVideo.current.currentTime = this.state.timings[0].start;
            this.progressBar.current.style.left = `${this.state.timings[0].start / this.playVideo.current.duration * 100}%`;
            this.progressBar.current.style.width = "0%";
            this.addActiveSegments();
        })
    }

    captureSnapshot = () => {

        var video = this.playVideo.current
        video.setAttribute('crossorigin', 'anonymous')
        video.origin = 'anonymus'
        const canvas = document.createElement("canvas");
        // scale the canvas accordingly
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        // draw the video at that frame
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        // convert it to a usable data URL
        const dataURL = canvas.toDataURL();
        this.setState({imageUrl: dataURL})
        this.props.checkThumb(dataURL)
    }

    downloadSnapshot = () => {
        var a = document.createElement("a"); //Create <a>
        a.href = this.state.imageUrl; //Image Base64 Goes here
        a.download = "thumbnail.png"; //File name Here
     
        a.click(); //Downloaded file
    }

    skipPrevious = () => {
        if(this.state.playing){
            this.playVideo.current.pause()
        }
        var prev_idx = (this.state.currently_grabbed.index != 0) ? (this.state.currently_grabbed.index-1) : (this.state.timings.length-1)
        this.setState({currently_grabbed: {"index": prev_idx , "type": "start"}, playing: false}, () => {
            this.progressBar.current.style.left = `${this.state.timings[prev_idx].start / this.playVideo.current.duration * 100}%`;
            this.progressBar.current.style.width = '0%'
            this.playVideo.current.currentTime = this.state.timings[prev_idx].start;
        })
    }

    play_pause = () => {
        var self = this
        if(this.state.playing){
            this.playVideo.current.pause()
        }
        else{
            if ((self.playVideo.current.currentTime >= self.state.timings[self.state.timings.length-1].end)){
                self.playVideo.current.pause()
                self.setState({playing: false, currently_grabbed: {"index": 0, "type": "start"}}, () => {
                    self.playVideo.current.currentTime = self.state.timings[0].start;
                    self.progressBar.current.style.left = `${self.state.timings[0].start / self.playVideo.current.duration * 100}%`;
                    self.progressBar.current.style.width = "0%";
                })
            }
            this.playVideo.current.play()
        }
        this.setState({playing: !this.state.playing})
    }


    skipNext = () => {
        if(this.state.playing){
            this.playVideo.current.pause()
        }
        var next_idx = (this.state.currently_grabbed.index != (this.state.timings.length-1)) ? (this.state.currently_grabbed.index+1) : 0
        this.setState({currently_grabbed: {"index": next_idx , "type": "start"}, playing: false}, () => {
            this.progressBar.current.style.left = `${this.state.timings[next_idx].start / this.playVideo.current.duration * 100}%`;
            this.progressBar.current.style.width = '0%'
            this.playVideo.current.currentTime = this.state.timings[next_idx].start;
        })
    }

    updateProgress = (event) => {
        var playbackRect = this.playBackBar.current.getBoundingClientRect();
        var seekTime = ((event.clientX - playbackRect.left) / playbackRect.width) * this.playVideo.current.duration
        this.playVideo.current.pause()
        // find where seekTime is in the segment
        var index = -1;
        var counter = 0;
        for(let times of this.state.timings){
            if(seekTime >= times.start && seekTime <= times.end){
                index = counter;
            }
            counter += 1;
        }
        if(index == -1){
            return
        }

        this.setState({playing: false, currently_grabbed: {"index": index, "type": "start"}}, () => {
            this.progressBar.current.style.width = '0%' // Since the width is set later, this is necessary to hide weird UI
            this.progressBar.current.style.left = `${this.state.timings[index].start / this.playVideo.current.duration * 100}%`
            this.playVideo.current.currentTime = seekTime
        })

        
    }

    startGrabberMove = (event) => {
        this.playVideo.current.pause()
        var playbackRect = this.playBackBar.current.getBoundingClientRect();
        var seekRatio = (event.clientX - playbackRect.left) / playbackRect.width
        const index = this.state.currently_grabbed.index
        const type = this.state.currently_grabbed.type
        window.addEventListener("mouseup", () => {window.removeEventListener('mousemove', this.startGrabberMove); this.addActiveSegments()})
        var time = this.state.timings
        var seek = this.playVideo.current.duration * seekRatio
        if((type == "start") && (seek > ((index != 0) ? (time[index-1].end+this.state.difference+0.2) : 0)) && seek < time[index].end-this.state.difference){
            this.progressBar.current.style.left = `${seekRatio*100}%`
            this.playVideo.current.currentTime = seek
            time[index]["start"] = seek
            this.setState({timings: time, playing: false})
        }
        else if((type == "end") && (seek > time[index].start+this.state.difference) && (seek < (index != (this.state.timings.length-1) ? time[index+1].start-this.state.difference-0.2 : this.playVideo.current.duration))){
            this.progressBar.current.style.left = `${time[index].start / this.playVideo.current.duration * 100}%`
            this.playVideo.current.currentTime = time[index].start
            time[index]["end"] = seek
            this.setState({timings: time, playing: false})
        }
        this.progressBar.current.style.width = "0%"

        setTimeout(() => {
            this.props.recordTimings(this.state.timings)
        }, 300);
        
    }

    renderGrabbers = () => {


        return this.state.timings.map((x, index) => (
            <div key={"grabber_"+index}>
                <div className="grabber start" style={{left: `${x.start / this.playVideo.current.duration * 100}%`}} onMouseDown={(event) => {
                    if(this.state.deletingGrabber){
                        this.deleteGrabber(index)
                    }
                    else{
                        this.setState({currently_grabbed: {"index": index, "type": "start"}}, () => {
                            window.addEventListener('mousemove', this.startGrabberMove);
                        });
                    }
                }}>
                   [
                </div>
                <div className="grabber end" style={{left: `${x.end / this.playVideo.current.duration * 100}%`}} onMouseDown={(event) => {
                    if(this.state.deletingGrabber){
                        this.deleteGrabber(index)
                    }
                    else{
                        this.setState({currently_grabbed: {"index": index, "type": "end"}}, () => {
                            window.addEventListener('mousemove', this.startGrabberMove);
                        });
                    }
                }}>
                    ]
                </div>
            </div>
        ))
    }

    addGrabber = () => {
        var time = this.state.timings
        var end = time[time.length-1].end+this.state.difference
        this.setState({deletingGrabber: false, current_warning: null})
        if(end >= this.playVideo.current.duration){
            alert('Asegurate que el ultimo corte no llegue hasta el final del video :)')
            return
        }
        time.push({"start": end+0.2, "end": this.playVideo.current.duration})
        this.setState({timings: time}, () => {
            this.addActiveSegments()
        })
    }

    preDeleteGrabber = () => {
        if(this.state.deletingGrabber){
            this.setState({deletingGrabber: false, current_warning: null})
        }
        else{
            this.setState({deletingGrabber: true, current_warning: "delete_grabber"});
        }
    }

    deleteGrabber = (index) => {
        var time = this.state.timings
        this.setState({timings: time, deletingGrabber: false, current_warning: null, currently_grabbed: {"index": 0, "type": "start"}})
        if(time.length == 1){
            return
        }
        time.splice(index, 1);
        this.progressBar.current.style.left = `${time[0].start / this.playVideo.current.duration * 100}%`;
        this.playVideo.current.currentTime = time[0].start;
        this.progressBar.current.style.width = "0%";
        this.addActiveSegments();
    }

    addActiveSegments = () => {
        var colors = ""
        var counter = 0
        colors += `, rgb(240, 240, 240) 0%, rgb(240, 240, 240) ${this.state.timings[0].start / this.playVideo.current.duration * 100}%`
        for(let times of this.state.timings){
            if(counter > 0){
                colors += `, rgb(240, 240, 240) ${this.state.timings[counter-1].end / this.playVideo.current.duration * 100}%, rgb(240, 240, 240) ${times.start / this.playVideo.current.duration * 100}%`
            }
            colors += `, #7f45c4 ${times.start / this.playVideo.current.duration * 100}%, #7f45c4 ${times.end / this.playVideo.current.duration * 100}%`
            counter += 1
        }
        colors += `, rgb(240, 240, 240) ${this.state.timings[counter-1].end / this.playVideo.current.duration * 100}%, rgb(240, 240, 240) 100%`
        
        if (this.playBackBar.current != null ) {
            this.playBackBar.current.style.background = `linear-gradient(to right${colors})`;
        }
        // setTimeout(() => {
            //  this.playBackBar.current.style.background = `linear-gradient(to right${colors})`;
        // }, 250);
    }

    saveVideo = () => {
        var metadata = {
            "trim_times": this.state.timings,
            "mute": this.state.isMuted
        }
        console.log(this.state)
        this.props.saveVideo(metadata)
    }


    // Aca viene mi papota
    formatDecimals = (num) => {
          num = num.toFixed(2)
          return num;
    }
    
    pasarAPor = (num) => {
        return (num * 100) / this.state.totalDuration
    }

    
    refreshInputVal = (value, index, point, type) => {
        
        var mins = document.querySelectorAll('.cortes')[index].querySelector('#'+point+'minutos'+index).value
        var segs = document.querySelectorAll('.cortes')[index].querySelector('#'+point+'segundos'+index).value

        
        var newTime = (mins*60)*1 + segs*1
        
        var childData = {
            "value" : newTime,
            "point" : point,
            "index" : index
        }
        
        console.log(childData)

        let newTimings = this.state.timings
        newTimings[childData.index][childData.point] = childData.value

        this.setState({
            timings: newTimings
        })

        // this.props.recordTimings(newTimings)
    }

    corteInfo = (e, index, type) => {
        let newTimings = this.state.timings
        newTimings[index][type] = e.target.value

        this.setState({
            timings: newTimings
        })

        // this.props.setCorteInfo( index, e.target.value, type )
    }
  
    getValueTime = (index, point, type) => {

        const formateo = this.state.timings[index][point]

        var minutes = Math.floor(formateo / 60);
        var seconds = Math.floor(formateo - minutes * 60);

        console.log(minutes, seconds)
        
        var final_num
        if (type == 'minutos') {
            final_num = minutes
        }
        if (type == 'segundos') {
            final_num = seconds
            if (final_num < 10) {
                final_num = '0'+final_num
            }
            console.log(seconds)
        }
                    
        return final_num

    }
    

    onRender = () =>{
        if (this.props.activeNugget.length == 0) {
            let timer = this.props.activeNugget[0]
            // this.addActiveSegments()
            return false
        }

        if (this.props.activeNugget[0].timings != this.state.timings) {

            this.setState({
                timings: this.props.activeNugget[0].timings
            }, () => {
                this.addActiveSegments()
            }); 

            if (this.props.activeNugget[0].timings.length  == 0) {
                
                var time = this.props.activeNugget[0].timings
                time.push({'start': 0, 'end': this.state.totalDuration})

                this.setState({timings: time }, () => {
                    this.addActiveSegments()
                });

            }

        }else{
            return false
        }
        
    }

    InputComponent = (index, point, type) =>{
        return(
            <>
            {/* onChange={ e => this.newManualChange(e, index, 'end', 'segundos') } */}
                <input type="number"  id={point+type+index} value={this.getValueTime( index, point, type)} onChange={ e => this.refreshInputVal(e, index, point, type) } className="segundos-de-corte" />
            </>
        )
    }

    

    render = () => {
       
        this.onRender()

        return(
            <div id="wrapper-cont" >

            <div className="wrapper">
               
                <video className="video" autoload="metadata" muted={this.state.isMuted} ref={this.playVideo} controls onClick={this.play_pause.bind(this)} >
                    <source src={this.props.videoUrl} type="video/mp4" />
                </video>

                <div className="playback">
                    {this.renderGrabbers()}
                    <div className="seekable" ref={this.playBackBar} onClick={this.updateProgress}></div>
                    <div className="progress" ref={this.progressBar}></div>
                    <div className="palito"></div>
                </div>
                <div className="controls">
                    <div className="player-controls">
                        {/* <button className="settings-control" title="Reset Video" onClick={this.reset}><FontAwesomeIcon icon={faSync} /></button> */}
                        <button className="settings-control" title="Mute/Unmute Video" onClick={() => this.setState({isMuted: !this.state.isMuted})}>{this.state.isMuted ? <FontAwesomeIcon icon={faVolumeMute} /> : <FontAwesomeIcon icon={faVolumeUp} />}</button>
                        {window.location.toString().includes("new-project") &&
                        <button className="settings-control" style={{'width':'fit-content'}} title="Capture Thumbnail" onClick={this.captureSnapshot}>Elegir thumbnail  <FontAwesomeIcon icon={faCamera} /></button>
                        }
                    </div>
                    <div className="player-controls">
                        <button className="seek-start" title="Skip to previous clip" onClick={this.skipPrevious}><FontAwesomeIcon icon={faStepBackward} /></button>
                        <button className="play-control" title="Play/Pause" onClick={this.play_pause.bind(this)} >{this.state.playing ? <FontAwesomeIcon icon={faPause} /> : <FontAwesomeIcon icon={faPlay} /> }</button>
                        <button className="seek-end" title="Skip to next clip" onClick={this.skipNext}><FontAwesomeIcon icon={faStepForward} /></button>
                    </div>
                    <div>
                        <button title="Add grabber" className="trim-control margined" onClick={this.addGrabber}>Add <FontAwesomeIcon icon={faGripLinesVertical} /></button>
                        <button title="Delete grabber" className="trim-control margined" onClick={this.preDeleteGrabber}>Delete <FontAwesomeIcon icon={faGripLinesVertical} /></button>
                        {/* <button title="Save changes" className="trim-control" onClick={this.saveVideo}>Save</button> */}
                    </div>
                </div>
                {this.state.current_warning != null ? <div className={"warning"}>{this.warnings[this.state.current_warning]}</div> : ""}
                {(this.state.imageUrl != "") ? 
                    <div className={"marginVertical"}>
                        <img src={this.state.imageUrl} className={"thumbnail"} />
                        <div className="controls">
                            <div className="player-controls">
                                <button className="settings-control" title="Reset Video" onClick={this.downloadSnapshot}><FontAwesomeIcon icon={faDownload} /></button>
                                <button className="settings-control" title="Save Video" onClick={() => {this.setState({imageUrl: ""})}}><FontAwesomeIcon icon={faEraser} /></button>
                            </div>
                        </div>
                    </div>
                : ""}
            </div>

            <>
            <div id="Testing1-view">
                <article>
                    <h2>Cortes</h2>
                    <ul>
                    {this.state.timings.map((corte, index)=>(
                        <li className="cortes" id={Math.floor(Math.random() * (0-500 + 1)) + 0}>
                              <input type="name" className="corte-titulo" onChange={ e => this.corteInfo(e, index, "titulo") }value={corte.titulo ? corte.titulo : 'Corte ' + index }  />

                              <div  className='corte-progress' style={{'background':`linear-gradient(90deg, var(--gris2) ${this.pasarAPor(corte.start)}%, var(--violeta) ${this.pasarAPor(corte.start)}%, var(--violeta) ${this.pasarAPor(corte.end)}%, var(--gris2) ${this.pasarAPor(corte.end)}%)`}}>
                              </div>


                              <div className="input-cont">
                              <div className="label-cont"></div>
                                    {this.InputComponent(index, 'start', 'minutos')}
                                    :
                                    <div className="label-cont"></div>
                                    {this.InputComponent(index, 'start', 'segundos')}
                                    
                              </div>
                              <span> - </span>
                              <div className="input-cont">
                                    <div className="label-cont"></div>
                                    {this.InputComponent(index, 'end', 'minutos')}
                                    :
                                    <div className="label-cont"></div>
                                    {this.InputComponent(index, 'end', 'segundos')}
                              </div>
                              <br />
                              <textarea onChange={ e => this.corteInfo(e, index, "descripcion") } value={corte.descripcion ? corte.descripcion : ''} placeholder='Notas'/>

                                <div className="deleteCorte">
                                    <img src="/assets/delete-trash.png" onClick={ ()=>{ if (this.state.timings.length > 1) { this.deleteGrabber(index) }else{ alert('Tiene que haber por lo menos 1 corte') } } } />
                                </div>

                            </li>
                        
                      ))
                    }
                  </ul>
                   
                </article>
              </div>
            </>
            
            </div>

        )
    }
}

export default Editor