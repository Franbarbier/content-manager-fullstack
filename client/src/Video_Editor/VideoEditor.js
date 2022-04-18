import React from 'react';

import axios from 'axios';

import { FileDrop } from 'react-file-drop'
import './css/editor.css'
import Editor from './Editor'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLightbulb, faMoon } from '@fortawesome/free-solid-svg-icons'
import { serverEndpoint } from '../globals';

class VideoEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isUpload: true,
            videoUrl: "",
            isDarkMode: false,
            hayVid: false
        }
        this.playVideo = React.createRef();
    }

    componentDidMount = () => {

        console.log(this.props)

        this.toggleThemes()
        document.addEventListener('drop', function(e) {
            e.preventDefault();
            e.stopPropagation();
          });

          this.checkDefaultVid()

    }

    checkDefaultVid = () => {

        if(this.props.video_url){    

            var urlAwsEndoded = "https://content-creator-1.s3.sa-east-1.amazonaws.com/videos/"+this.props.video_url.replaceAll( "+", "%2B" )
            urlAwsEndoded = urlAwsEndoded.replace(/\s+/g,'+')
            loadDoc(urlAwsEndoded , myFunction1, this);
            // loadDoc('https://microcontent-creator.s3.sa-east-1.amazonaws.com/videos/6255e7bc4da9401cf61250c9-screen-capture%2B(2).mp4', myFunction1, this);

            function loadDoc(url, cFunction, este) {
                fetch(url)
            .then(res => res.blob() ) // Gets the response and returns it as a blob -> "https://microcontent-creator.s3.sa-east-1.amazonaws.com/videos/"+this.props.video_url.replace(/\s+/g,'+')
            
            .then( blob => { 
                cFunction(URL.createObjectURL(blob), este)
                // Here's where you get access to the blob
                // And you can use it for whatever you want
                // Like calling ref().put(blob)
                // Here, I use it to make an image appear on the page
            });

            
            }
            function myFunction1(blob,este) {
                este.setState({
                    isUpload: false,
                    videoUrl: blob,
                   })
            } 
        }
    }

    render_uploader = () => {
                
        return(
            <>
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
            </>

        )
    }

    saveVideo = (metadata) => {
        
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
        
        // if(){

        // }


        return(
            // Props:
            // videoUrl --> URL of uploaded video
            // saveVideo(<metadata of edited video>) --> gives the cut times and if video is muted or not
            <>
                

                <Editor 
                    videoUrl={this.state.videoUrl} 
                    
                    projectData={this.props.projectData} 
                    getGetTotalDuration={this.getGetTotalDuration} 
                    activeNugget={this.props.activeNugget} 
                    checkThumb={this.props.getThumbURL} 
                    recordTimings={this.adaptadorTiming} 
                    setCorteInfo={this.setCorteInfo} 
                    saveVideo={this.saveVideo}
                />
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
        console.log(fileUrl, fileInput[0])
        
        this.setState({
            isUpload: false,
            videoUrl: fileUrl,
            hayVid: true,
            video_data : fileInput[0]
        })
        
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
                 
                axios.post(serverEndpoint+'upload-video', data, {
                    
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
                            
                            axios.post(serverEndpoint+'upload-thumb', retDataThumb)
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
        // this.checkDefaultVid()
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