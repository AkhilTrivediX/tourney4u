'use client'
import Image from "next/image";
import styles from "./page.module.css";
import SingleTournament from "./components/singleTournament";
import { useState,useRef, useEffect, useReducer} from "react";
import { DiscordSDK } from "@discord/embedded-app-sdk";
import domtoimage from 'dom-to-image-more';
import html2canvas from "html2canvas";
import { exportComponentAsJPEG, exportComponentAsPDF, exportComponentAsPNG } from 'react-component-export-image';


export default function Home() {
  const [coverVisible, setCoverVisible] = useState(false);
  const [currentTab, setCurrentTab] = useState('Brackets');
  const [interfaceHidden, setInterfaceHidden] = useState(false);
  const teamCountTextRef = useRef(null);
  const layoutDirectionRef = useRef(null);
  const centralizedRef = useRef(null);
  const strokeStyleRef = useRef(null);
  const [setting, settingDispatch] = useReducer(settingReducer,{teamsCount:8,layoutDirection:'leftToRight',centralized:false,strokeStyle:'grid',strokeWidth:2,mainColor:'#ff5482',textRequirements:[], blockNames:{}});
  const coverRef = useRef(null);
  const mainRef = useRef(null);
  const mainColorRef = useRef(null);
  const [backgroundEnabled, setBackgroundEnabled] = useState(false);
  const [textColorEnabled, setTextColorEnabled] = useState(false);
  const settingsAreaRef = useRef(null);
  

  
  const discordSdk = new DiscordSDK(process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID);

  setupDiscordSdk().then(() => {
    console.log("Discord SDK is ready");
  });
  
  async function setupDiscordSdk() {
    await discordSdk.ready();
  }

  function settingReducer(state,action)
  {
    let pastState = {...state};
    switch(action.type)
    {
      case 'SET_SETTING':
        return {...action.payload};
      case 'CHANGE_SETTING':
        pastState[action.key] = action.value;
        return pastState;
      default:
        return pastState;
    }
  }
  
  function changeTab(tab)
  {
    setCurrentTab(tab);
  }

  function changeTeamCount(count)
  {
    teamCountTextRef.current.innerHTML = (count<10?'0':'')+count;
  }

  function changeBrightness(value)
  {
    mainRef.current.style.setProperty('--brightness',value+'%');
  }

  function changeContrast(value){
    mainRef.current.style.setProperty('--contrast',value+'%');
  }

  function changeSaturation(value)
  {
    mainRef.current.style.setProperty('--grayscale',100-value+'%');
  }

  function invertBackground(invert)
  {
    mainRef.current.style.setProperty('--invert',invert?'1':'0');
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        changeSourceURL(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      console.error('Please select an image file.');
      setSelectedFile(null);
    }
  };

  function changeSourceURL(dataURI) {
    console.log('FileURI',dataURI);
    mainRef.current.style.setProperty('--backgroundurl',`url("${dataURI}")`);
  }

  function changeBackgroundColor(color)
  {
    mainRef.current.style.setProperty('--backgroundcolor',color);
  }

  function changeBlur(value)
  {
    mainRef.current.style.setProperty('--blur',value+'px');
  }

  function changeBorderRadius(value)
  {
    mainRef.current.style.setProperty('--borderradius',value+'px');
  }

  function changeStrokeWidth(value)
  {
    mainRef.current.style.setProperty('--strokewidth',value+'px');
    let newSetting ={...setting};
    newSetting.strokeWidth = value;
    settingDispatch({type:'SET_SETTING',payload:newSetting});
  }

  function changeTextColor(color)
  {
    mainRef.current.style.setProperty('--textcolor',color);
  }

  function changeTextWeight(weight)
  {
    mainRef.current.style.setProperty('--textweight',weight);
  }

  function changeBlendMode(mode)
  {
    mainRef.current.style.setProperty('--blendmode',mode);
  }

  function toggleInterface(hidden)
  {
    setInterfaceHidden(!hidden);
  }

  function generateBrackets()
  {
    let pastSetting = {...setting};
    pastSetting.teamsCount = Number.parseInt(teamCountTextRef.current.innerHTML);
    pastSetting.layoutDirection = layoutDirectionRef.current.value;
    pastSetting.centralized = centralizedRef.current.checked;
    pastSetting.strokeStyle = strokeStyleRef.current.value;
    pastSetting.mainColor = mainColorRef.current.value;
    pastSetting.strokeWidth = setting.strokeWidth;

    //console.log('Updated',newSetting)
    coverRef.current.classList.remove(styles.invisible);
    setTimeout(()=>{
      settingDispatch({type:'SET_SETTING',payload:pastSetting});
      mainRef.current.style.setProperty('--maincolor',pastSetting.mainColor);
      if(!backgroundEnabled) mainRef.current.style.setProperty('--backgroundcolor',pastSetting.mainColor);
      if(!textColorEnabled) mainRef.current.style.setProperty('--textcolor',pastSetting.mainColor);
    },500);
    setTimeout(()=>{coverRef.current.classList.add(styles.invisible)},1000);
    
  }

  function getNamingInputs(){
    let namingInputs = [];
    for(let i=0;i<setting.teamsCount;i++)
    {
      namingInputs.push(
        <div className={styles.option}>
          <div className={styles.optionTitle}>Team {i+1}</div>
          <input type='text' className={styles.optionText} onChange={(e)=>changeBlockName(i,e.target.value)}/>
        </div>
      )
    }
    return namingInputs;
  
  }

  function getQualifierSelects(){
    let qualifierSelects=[]
    for(let i=0;i<setting.teamsCount;i++){
      if(!setting.blockNames[i.toString()]) return;
    }
    let keepGoing = true;
    for(let i=0;i<setting.textRequirements.length;i++){
      qualifierSelects.push(
          <div className={styles.sectionDivision}>
            <div className={styles.sectionTitle}>{setting.textRequirements.length-i==1?'Winner':setting.textRequirements.length-i==2?'Finalists':setting.textRequirements.length-i==3?'Semi-Finalists':`Round ${i+1} Qualifiers`}</div>
            <div className={styles.sectionLine}></div>
          </div>)
          let req =setting.textRequirements[i].map((qualifier,index)=>{if(!setting.blockNames[qualifier.winner]) keepGoing=false;return (
            <div className={styles.option}>
              <div className={styles.optionTitle}>Qualifier {qualifier.qualifier}</div>
              <select className={styles.optionSelect} onChange={(e)=>changeBlockName(qualifier.winner,e.target.value)}>
                <option value={''}>Select one...</option>
                <option value={setting.blockNames[qualifier.team1]}>{setting.blockNames[qualifier.team1]}</option>
                <option value={setting.blockNames[qualifier.team2]}>{setting.blockNames[qualifier.team2]}</option>
              </select>
            </div>
          )})
          qualifierSelects.push(...req)
          if(!keepGoing) break;
        }
    

    return qualifierSelects
  }

  function changeBlockName(index,name){
    let newSetting = {...setting};
    newSetting.blockNames[index] = name;
    settingDispatch({type:'SET_SETTING',payload:newSetting});
  
  }

  let noBackTabs = ['Teams'];
/*
  useEffect(()=>{
    //Print client height and width;
    console.log('Client Height:',window.innerHeight);
    console.log('Client Width:',window.innerWidth);
    let ratio = window.innerWidth/1920;
    mainRef.current.style.setProperty('--scaleRatio',ratio);
  })
*/


  function captureScreenshot(){
    console.log('Capturing Screenshot');
    mainRef.current.style.setProperty('--globalWidth','1920px');
    mainRef.current.style.setProperty('--globalHeight','1080px');
    settingsAreaRef.current.style.setProperty('display','none');
    let node = mainRef.current;
    domtoimage
    .toJpeg(node)
    .then(function (dataUrl) {
      console.log(dataUrl)
      var link = document.createElement('a');
        link.download = 'Tourney4U Bracket.jpeg';
        link.href = dataUrl;
        link.click();
    })
    .catch(function (error) {
        console.error('oops, something went wrong!', error);
    }).finally(()=>{
      mainRef.current.style.setProperty('--globalWidth','100vw');
      mainRef.current.style.setProperty('--globalHeight','100vh');
      settingsAreaRef.current.style.setProperty('display','flex');
    })
      }
  return (
    <main className={styles.main} ref={mainRef}>
      <div className={styles.backgroundOverlay}></div>
      <div className={styles.bracketsBackground}></div>
      <SingleTournament teamsCount={setting.teamsCount} centralized={setting.centralized} layoutDirection={setting.layoutDirection} strokeStyle={setting.strokeStyle} mainColor={setting.mainColor} strokeWidth={setting.strokeWidth} settingData={setting} settingDispatch={settingDispatch}/>
      <div className={`${styles.settingInterface} ${interfaceHidden?styles.hidden:null}`} ref={settingsAreaRef}>
        <div className={styles.hideButton} onClick={()=>toggleInterface(interfaceHidden)}>{interfaceHidden?'⚙':'→'}</div>
        <div className={styles.interfaceTitle}>Tourney4U</div>
        {!noBackTabs.includes(currentTab)?<div className={styles.tabs}>
          <div className={`${styles.tab} ${currentTab=='Brackets'?styles.active:null}`} onClick={()=>setCurrentTab('Brackets')}>Brackets</div>
          <div className={`${styles.tab} ${currentTab=='Background'?styles.active:null}`} onClick={()=>setCurrentTab('Background')}>Background</div>
          <div className={`${styles.tab} ${currentTab=='Stroke'?styles.active:null}`} onClick={()=>setCurrentTab('Stroke')}>Stroke</div>
        </div>:
          <div className={styles.tabs}>
            <div className={`${styles.tab} ${currentTab=='Teams'?styles.active:null}`} onClick={()=>setCurrentTab('Teams')}>Teams</div>
          </div>
        }
        <div className={styles.settingsArea} >
          <div className={styles.setting} style={currentTab!='Brackets'?{maxWidth:'0%'}:null}>
            <div className={styles.option}>
              <div className={styles.optionTitle}>Teams Count</div>
              <input type='range' min='2' max='20' step='1' defaultValue='8' className={styles.optionRange} onChange={(e)=>{changeTeamCount(e.target.value)}}/>
              <div className={styles.optionValue} ref={teamCountTextRef}>08</div>
            </div>
            <div className={styles.option}>
              <div className={styles.optionTitle}>Layout Direction</div>
              <select className={styles.optionSelect} ref={layoutDirectionRef}>
                <option value='leftToRight'>Left to Right</option>
                <option value='rightToLeft'>Right to Left</option>
                <option value='topToDown'>Top to Down</option>
                <option value='downToTop'>Down to Top</option>
              </select>
            </div>
            <div className={styles.option}>
              <div className={styles.optionTitle}>Centralized</div>
              <input type='checkbox' className={styles.optionCheckbox} ref={centralizedRef}/>
            </div>
            <div className={styles.option}>
              <div className={styles.optionTitle}>Main Color</div>
              <input type='color' className={styles.optionColor} ref={mainColorRef} defaultValue={'#ff5482'}/>
            </div>
            <div className={styles.option}>
              <div className={styles.optionTitle}>Radius</div>
              <input type='range' min='0' max='50' defaultValue='0' className={styles.optionRange} onChange={(e)=>{changeBorderRadius(e.target.value)}}/>
            </div>
            <div className={styles.option}>
              <div className={styles.optionTitle}>Line Width</div>
              <input type='range' min='2' max='5' defaultValue='2' className={styles.optionRange} onChange={(e)=>{changeStrokeWidth(e.target.value)}}/>
            </div>
            <div className={styles.option}>
              <div className={styles.optionTitle}>Text Color</div>
              <input type='checkbox' className={styles.optionCheckbox} onChange={(e)=>setTextColorEnabled(e.target.checked)}/>
              {textColorEnabled && <input type='color' className={styles.optionColor} onChange={((e)=>changeTextColor(e.target.value))}/>}
            </div>
            <div className={styles.option}>
              <div className={styles.optionTitle}>Text Weight</div>
              <input type='range' min='200' max='900' defaultValue='400' step={100} className={styles.optionRange} onChange={(e)=>{changeTextWeight(e.target.value)}}/>
            </div>
          </div>
          <div className={styles.setting} style={currentTab!='Stroke'?{maxWidth:'0%'}:null}>
          <div className={styles.option}>
              <div className={styles.optionTitle}>Style</div>
              <select className={styles.optionSelect} ref={strokeStyleRef}>
                <option value='grid'>Grid</option>
                <option value='smooth'>Smooth</option>
                <option value='straight'>Straight</option>
              </select>
            </div>
          </div>
          <div className={styles.setting} style={currentTab!='Background'?{maxWidth:'0%'}:null}>
            <div className={styles.option}>
              <div className={styles.optionTitle}>Source URL</div>
              <input
        type="file"
        className={styles.optionText}
        onChange={handleFileChange}
        accept="image/*"
      />
            </div>
            <div className={styles.option}>
              <div className={styles.optionTitle}>Color</div>
              <input type='checkbox' className={styles.optionCheckbox} onChange={(e)=>setBackgroundEnabled(e.target.checked)}/>
              {backgroundEnabled && <input type='color' className={styles.optionColor} onChange={((e)=>changeBackgroundColor(e.target.value))}/>}
            </div>
            <div className={styles.option}>
              <div className={styles.optionTitle}>BlendMode</div>
              <select className={styles.optionSelect} onChange={(e)=>changeBlendMode(e.target.value)}>
                <option value='darken'>Darken</option>
                <option value='multiply'>Multiply</option>
                <option value='color-burn'>Color Burn</option>
                <option value='color'>Color</option>
                <option value='overlay'>Overlay</option>
                <option value='hue'>Hue</option>
                <option value='screen'>Screen</option>
                <option value='color-dodge'>Color Dodge</option>
                <option value='difference'>Difference</option>
                <option value='exclusion'>Exclusion</option>
                <option value='hard-light'>Hard Light</option>
                <option value='soft-light'>Soft Light</option>
                <option value='lighten'>Lighten</option>

              </select>
            </div>
            <div className={styles.option}>
              <div className={styles.optionTitle}>Saturation</div>
              <input type='range' min='0' max='100' defaultValue='0' className={styles.optionRange} onChange={(e)=>{changeSaturation(e.target.value)}}/>
            </div>
            <div className={styles.option}>
              <div className={styles.optionTitle}>Brightness</div>
              <input type='range' min='0' max='1000' defaultValue='100' className={styles.optionRange} onChange={(e)=>{changeBrightness(e.target.value)}}/>
            </div>
            <div className={styles.option}>
              <div className={styles.optionTitle}>Contrast</div>
              <input type='range' min='0' max='1000' defaultValue='100' className={styles.optionRange} onChange={(e)=>{changeContrast(e.target.value)}}/>
            </div>
            <div className={styles.option}>
              <div className={styles.optionTitle}>Blur</div>
              <input type='range' min='0' max='100' defaultValue='0' className={styles.optionRange} onChange={(e)=>{changeBlur(e.target.value)}}/>
            </div>
            <div className={styles.option}>
              <div className={styles.optionTitle}>Invert</div>
              <input type='checkbox' className={styles.optionCheckbox} onChange={(e)=> invertBackground(e.target.checked)}/>
            </div>
          </div>
          <div className={styles.setting} style={currentTab!='Teams'?{maxWidth:'0%'}:null}>
          <div className={styles.sectionDivision}>
            <div className={styles.sectionTitle}>Team Names</div>
            <div className={styles.sectionLine}></div>
          </div>
            {getNamingInputs()}
            {getQualifierSelects()}
          </div>
          
        </div>
        {!noBackTabs.includes(currentTab)?<div className={styles.actionButtons}>
          <div className={styles.generateButton} onClick={()=>generateBrackets()}>✨ Update</div>
          <div className={styles.proceedButton}  onClick={()=>setCurrentTab('Teams')}>Finalise style, Add text →</div>
        </div>:<div className={styles.actionButtons}>
          <div className={styles.generateButton} onClick={()=>captureScreenshot()}>🎇 Download</div>
        </div>}
      </div>
      <div className={`${styles.cover} ${styles.invisible}`} ref={coverRef}>
          <div className={styles.innerCover}>
              <div className={styles.coverImage}>
                <Image src='/D4U Logo.png' width={981/5} height={743/5} alt='D4U Logo'/>
              </div>
              <div className={styles.innerDivisionLine}></div>
              <div className={styles.coverText}>
                <div className={styles.coverTitle}>TOURNEY4U</div>
              </div>
              
          </div>
      </div>
    </main>
  );
}
