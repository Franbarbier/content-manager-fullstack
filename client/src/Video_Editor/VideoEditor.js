import React from 'react';

import axios from 'axios';

import { FileDrop } from 'react-file-drop'
import './css/editor.css'
import Editor from './Editor'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLightbulb, faMoon } from '@fortawesome/free-solid-svg-icons'
import Testing1 from './testing1';

class VideoEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isUpload: true,
            videoUrl: "",
            isDarkMode: false,
            hayVid: false
        }
    }

    componentDidMount = () => {
        this.toggleThemes()
        document.addEventListener('drop', function(e) {
            e.preventDefault();
            e.stopPropagation();
          });


          var new_url = "https://microcontent-creator.s3.sa-east-1.amazonaws.com/videos/62535c107c59ae80c8a6acce-screen-capture+(2).mp4"
        //   const data = new FormData(new_url)


        // //Bloqueado por CORS
        var request = new XMLHttpRequest();
        request.open('GET', new_url, true);
        request.responseType = 'blob';
        request.onload = function() {
            var reader = new FileReader();
            reader.readAsDataURL(request.response);
            reader.onload =  function(e){
                console.log('DataURL:', e.target.result);
            };
        };
        request.send();



        console.log(request)
    }


    render_uploader = () => {
        

        return(
            <div className={"wrapper"}>
                <input
                    onChange={(e) => this.upload_file(e.target.files)}
                    type="file"
                    className="hidden"
                    id="up_file"
                />
                <FileDrop
                    onDrop={(e) => this.upload_file(e)}
                    onTargetClick={() => document.getElementById("up_file").click()}
                >
                    Click or drop your video here to edit!
                </FileDrop>
            </div>
        )
    }

    saveVideo = (metadata) => {
        console.log(metadata)
        
        this.setState({
            tuqui : metadata
        })
        setTimeout(() => {
            console.log(this.state.tuqui)
            
        }, 1000);


        alert("Please check your console to see all the metadata. This can be used for video post-processing.")
    }
   
    adaptadorTiming = (timing) => {

        if (timing != undefined) {
            this.props.recordTimings(timing)
            
        }
    }

    setCorteInfo = (timing, value, type) => {
        this.props.setCorteInfo(timing, value, type)
    }

    getGetTotalDuration = (duration) => {
        this.props.getTotalDuration(duration)
    }

    render_editor = () => {
        
        
        
        return(
            // Props:
            // videoUrl --> URL of uploaded video
            // saveVideo(<metadata of edited video>) --> gives the cut times and if video is muted or not
            <>
                <Editor getGetTotalDuration={this.getGetTotalDuration} videoUrl={this.state.videoUrl} activeNugget={this.props.activeNugget} checkThumb={this.props.getThumbURL} recordTimings={this.adaptadorTiming} setCorteInfo={this.setCorteInfo} saveVideo={this.saveVideo}/>
            </>
        )
    }

    toggleThemes = () =>{
        if(this.state.isDarkMode){
            document.body.style.backgroundColor = "#1f242a";
            document.body.style.color = "#fff";
        }
        else{
            document.body.style.backgroundColor = "#fff";
            document.body.style.color = "#1f242a";
        }
        this.setState({isDarkMode: !this.state.isDarkMode})
    }

    
    upload_file = (fileInput) => {


        if (fileInput[0].type != "video/mp4") {
            alert('Solo se permiten videos en formto MP4')
            return false
        }
		let fileUrl = window.URL.createObjectURL(fileInput[0]);
        let filename = fileInput.name;
        console.log(fileUrl, fileInput)
        
        this.setState({
            isUpload: false,
            videoUrl: fileUrl,
            // hayVid: true,
            // video_data : fileInput[0]
        })

        
        // let file = fileInput[0]

        this.props.setVideoURL(fileInput[0].name)
        this.props.parentCallback(true)
        
    }


    saveListener = () => {

        
        if (this.props.saved != this.state.saved) {

            this.setState({ saved: this.props.saved })
            
            if (this.state.video_data) {

                this.props.saveLoader("loading", true)

                let file = this.state.video_data
                
                const data = new FormData()

                var new_name = this.props.newId +'-'+ file.name
                data.append('new_name',new_name)

                console.log(file)
                data.append( 'file', file )
                
                // axios.post('http://localhost:5000/upload-video', data, { 
                axios.post('https://fullstack-content-manager.herokuapp.com/upload-video', data, { 
                    
                    onUploadProgress: (progressEvent) => {
                        const progress = ( (progressEvent.loaded / progressEvent.total) * 100 ).toFixed();
                        // setProgress(progress);
                    }

                } )
                .then((e)=>{
                    this.props.saveLoader("success",false, data)
                })
                .catch( (e) =>{
                    console.log('error:::', e)
                    this.props.saveLoader("error",false)

                } )

                var thumb = document.getElementsByClassName('thumbnail')[0]

                if (thumb) {
                    let thumb_url = thumb.src

                        function urltoFile(url, filename, mimeType){
                            mimeType = mimeType || (url.match(/^data:([^;]+);/)||'')[1];
                            return (fetch(url)
                                .then(function(res){return res.arrayBuffer();})
                                .then(function(buf){return new File([buf], filename, {type:mimeType});})
                            );
                        }

                        urltoFile(thumb_url, this.props.newId + '-project-thumb.png')
                        .then(function(file){

                            const data = new FormData()
                
                            var retDataThumb = new FormData()

                            retDataThumb.append( 'file', file )

                            console.log(retDataThumb.get('file'));
                            
                            // axios.post('http://localhost:5000/upload-thumb', retDataThumb)
                            axios.post('https://fullstack-content-manager.herokuapp.com/upload-thumb', retDataThumb)
                            .then((e)=>{
                                this.props.saveLoader("success",false, null)
                            })
                            .catch( (e) =>{
                                console.log('error:::', e.error)
                                this.props.saveLoader("error",false)
            
                            } )
                        })

                }

               
            }
        }

        
    }
    

    


render = () => {

        this.saveListener()
        return(
            <>
            <div>
                {this.state.isUpload ? this.render_uploader() : this.render_editor()}
                <div className={"theme_toggler"} onClick={this.toggleThemes}>{this.state.isDarkMode? (<i className="toggle" aria-hidden="true"><FontAwesomeIcon icon={faLightbulb} /></i>) : <i className="toggle"><FontAwesomeIcon icon={faMoon} /></i>}</div>
            </div>
            </>
        )
    }
}

export default VideoEditor