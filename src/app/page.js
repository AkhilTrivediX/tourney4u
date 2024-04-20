'use client'
import Image from "next/image";
import styles from "./page.module.css";
import SingleTournament from "./components/singleTournament";
import { useState,useRef, useEffect, useReducer} from "react";
import { DiscordSDK } from "@discord/embedded-app-sdk";
import domtoimage from 'dom-to-image-more';
import { FaFileImage } from "react-icons/fa";
import { AiOutlineRotateRight } from "react-icons/ai";


export default function Home() {
  const [coverVisible, setCoverVisible] = useState(false);
  const [currentTab, setCurrentTab] = useState('Brackets');
  const [interfaceHidden, setInterfaceHidden] = useState(false);
  const teamCountTextRef = useRef(null);
  const layoutDirectionRef = useRef(null);
  const teamIconTypeRef = useRef(null);
  const centralizedRef = useRef(null);
  const strokeStyleRef = useRef(null);
  const [setting, settingDispatch] = useReducer(settingReducer,{teamsCount:8,layoutDirection:'leftToRight',centralized:false,strokeStyle:'grid',strokeWidth:2,mainColor:'#ff336a',textRequirements:[], blockNames:{},blockIcons:{},teamIconType:'none'});
  const coverRef = useRef(null);
  const mainRef = useRef(null);
  const mainColorRef = useRef(null);
  const [backgroundEnabled, setBackgroundEnabled] = useState(false);
  const [textColorEnabled, setTextColorEnabled] = useState(false);
  const settingsAreaRef = useRef(null);
  const titleRef = useRef(null);
  const titleIconRef = useRef(null);
  const titleTextRef = useRef(null);
  const titleXRef = useRef(null);
  const titleYRef = useRef(null);
  const titleFontRef = useRef(null);
  const teamFontRef = useRef(null)
  const roundFontRef = useRef(null)
  const watermarkRef = useRef(null);

  useEffect(()=>{
    if(window.innerHeight>window.innerWidth)
    {
      document.getElementById('orientationBlock').style.display = 'flex';
    }
  },[])
  

  /*
  const discordSdk = new DiscordSDK(process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID);

  setupDiscordSdk().then(() => {
    console.log("Discord SDK is ready");
  });
  
  async function setupDiscordSdk() {
    await discordSdk.ready();
  }*/

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

  function changeTitleWeight(weight){
    titleTextRef.current.style.fontWeight = weight;
  }
  function changeBlendMode(mode)
  {
    if(mode=='none') mainRef.current.style.setProperty('--overlaydisplay','none');
    else
    {
      mainRef.current.style.setProperty('--overlaydisplay','block');
      mainRef.current.style.setProperty('--blendmode',mode);}
  }

  function toggleInterface(hidden)
  {
    setInterfaceHidden(!hidden);
  }

  function changeTitle(title){
    titleTextRef.current.innerHTML = title;
  }

  function changeTitlePosition(axis,value){
    if(axis=='x') {titleRef.current.style.left = value+'%';
    titleXRef.current.innerHTML = value;
    }
    else {titleRef.current.style.top = value+'%';
    titleYRef.current.innerHTML = value;}
  }

  

  function generateBrackets()
  {
    let pastSetting = {...setting};
    pastSetting.teamsCount = Number.parseInt(teamCountTextRef.current.innerHTML);
    pastSetting.layoutDirection = layoutDirectionRef.current.value;
    //pastSetting.centralized = centralizedRef.current.checked;
    pastSetting.strokeStyle = strokeStyleRef.current.value;
    pastSetting.mainColor = mainColorRef.current.value;
    pastSetting.strokeWidth = setting.strokeWidth;
    pastSetting.teamIconType = teamIconTypeRef.current.value;

    //console.log('Updated',newSetting)
    coverRef.current.classList.remove(styles.invisible);
    setTimeout(()=>{
      settingDispatch({type:'SET_SETTING',payload:pastSetting});
      mainRef.current.style.setProperty('--maincolor',pastSetting.mainColor);
      if(!backgroundEnabled) mainRef.current.style.setProperty('--backgroundcolor',pastSetting.mainColor);
      if(!textColorEnabled) mainRef.current.style.setProperty('--textcolor',pastSetting.mainColor);
      let titleFontName = titleFontRef.current.value || '';
      let teamFontName = teamFontRef.current.value || '';
      let roundFontName = roundFontRef.current.value || '';
      if(titleFontName){
        const titleFontUrl = `https://fonts.googleapis.com/css2?family=${titleFontName.replaceAll(' ','+')}&display=swap`;
        const titlelink = document.createElement('link');
        titlelink.href = titleFontUrl;
        titlelink.rel = 'stylesheet';
        document.head.appendChild(titlelink);
        titleRef.current.style.fontFamily = `"${titleFontName}"`;
      }
      if(teamFontName){
        const teamFontUrl = `https://fonts.googleapis.com/css2?family=${teamFontName.replaceAll(' ','+')}&display=swap`;
        const teamlink = document.createElement('link');
        teamlink.href = teamFontUrl;
        teamlink.rel = 'stylesheet';
        document.head.appendChild(teamlink);
        mainRef.current.style.setProperty('--teamfont',`"${teamFontName}"`);
      }
      if(roundFontName){
        const roundFontUrl = `https://fonts.googleapis.com/css2?family=${roundFontName.replaceAll(' ','+')}&display=swap`;
        const roundlink = document.createElement('link');
        roundlink.href = roundFontUrl;
        roundlink.rel = 'stylesheet';
        document.head.appendChild(roundlink);
        mainRef.current.style.setProperty('--roundfont',`"${roundFontName}"`);
      }
      

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
          {setting.teamIconType!='none' && <>
          <button
  className={styles.optionIcon}
  onClick={() => {document.getElementById(`teamIcon${i+1}`).click()}} // Call a function to handle file selection
>
  <FaFileImage />
</button>
<input type='file' id={`teamIcon${i+1}`} style={{display:'none'}} onChange={(e)=>{changeBlockIcon(i,e)}}/>
</>}
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
            <div className={styles.option} key={index}>
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
    if(index.toString().length==1) newSetting.blockNames[name] = index.toString();
    newSetting.blockNames[index] = name;
    newSetting.blockIcons[index] = newSetting.blockIcons[newSetting.blockNames[name]];
    settingDispatch({type:'SET_SETTING',payload:newSetting});
  
  }

  function changeBlockIcon(index,event){

    const file = event.target.files[0];

    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
          let newSetting = {...setting};
          newSetting.blockIcons[index] = e.target.result;
          settingDispatch({type:'SET_SETTING',payload:newSetting});
      };
      reader.readAsDataURL(file);
    }  
  }

  function changeTitleIcon(event){
    const file = event.target.files[0];

    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
          
          titleIconRef.current.style.maskImage = `url("${e.target.result}")`;
          titleIconRef.current.style.display = 'block';
      };
      reader.readAsDataURL(file);
    }  
  }

  let noBackTabs = ['Teams'];


  function captureScreenshot(){
    console.log('Capturing Screenshot');
    mainRef.current.style.setProperty('--globalWidth','1920px');
    mainRef.current.style.setProperty('--globalHeight','1080px');
    settingsAreaRef.current.style.setProperty('display','none');
    watermarkRef.current.style.setProperty('display','block');
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
      watermarkRef.current.style.setProperty('display','none');
    })
      }
  return (
    <main className={styles.main} ref={mainRef}>
      <div className={styles.orientationBlock} id='orientationBlock'>
        <div className={styles.orientationIcon}><AiOutlineRotateRight /></div>
        <div className={styles.orientationError}>Tourney4U can only be used in landscape mode. Please rotate the device and then reload the page.</div>
      </div>
      <div className={styles.backgroundOverlay}></div>
      <div className={styles.bracketsBackground}></div>
      <div className={styles.tourneyName} ref={titleRef}>
        <div className={styles.tourneyIcon} ref={titleIconRef}></div>
        <div className={styles.tourneyTitle} ref={titleTextRef}>TOURNAMENT TITLE</div>
        <div className={styles.tourney4UWatermark} ref={watermarkRef}>Made in <span>Tourney4U</span></div>
      </div>
      
      <SingleTournament teamsCount={setting.teamsCount} centralized={setting.centralized} layoutDirection={setting.layoutDirection} strokeStyle={setting.strokeStyle} mainColor={setting.mainColor} strokeWidth={setting.strokeWidth} teamIconType={setting.teamIconType} settingData={setting} settingDispatch={settingDispatch}/>
      <div className={`${styles.settingInterface} ${interfaceHidden?styles.hidden:null}`} ref={settingsAreaRef}>
        <div className={styles.hideButton} onClick={()=>toggleInterface(interfaceHidden)}>{interfaceHidden?'⚙':'→'}</div>
        <div className={styles.interfaceTitle}>Tourney4U</div>
        {!noBackTabs.includes(currentTab)?<div className={styles.tabs}>
          <div className={`${styles.tab} ${currentTab=='Brackets'?styles.active:null}`} onClick={()=>setCurrentTab('Brackets')}>Brackets</div>
          <div className={`${styles.tab} ${currentTab=='Background'?styles.active:null}`} onClick={()=>setCurrentTab('Background')}>Background</div>
          <div className={`${styles.tab} ${currentTab=='Text'?styles.active:null}`} onClick={()=>setCurrentTab('Text')}>Text</div>
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
              <div className={styles.optionTitle}>Main Color</div>
              <input type='color' className={styles.optionColor} ref={mainColorRef} defaultValue={'#ff336a'}/>
            </div>
            <div className={styles.option}>
              <div className={styles.optionTitle}>Style</div>
              <select className={styles.optionSelect} ref={strokeStyleRef}>
                <option value='grid'>Grid</option>
                <option value='smooth'>Smooth</option>
                <option value='straight'>Straight</option>
              </select>
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
              <div className={styles.optionTitle}>Team Icons</div>
              <select className={styles.optionSelect} ref={teamIconTypeRef}>
                <option value='none'>None</option>
                <option value='original'>Original</option>
                <option value='themeFill'>Theme Filled</option>
                <option value='invertFill'>Invert Filled</option>
              </select>
            </div>
            
          </div>
          <div className={styles.setting} style={currentTab!='Text'?{maxWidth:'0%'}:null}>
              <div className={styles.option}>
                  <div className={styles.optionTitle}>Title</div>
                  <input type='text' className={styles.optionText} onChange={(e)=>changeTitle(e.target.value)}/>
                  <>
                  <button
                    className={styles.optionIcon}
                    onClick={() => {document.getElementById(`titleIconManager`).click()}} // Call a function to handle file selection
                  >
                    <FaFileImage />
                  </button>
                  <input type='file' id={`titleIconManager`} style={{display:'none'}} onChange={(e)=>{changeTitleIcon(e)}}/>
                  </>
                </div>
                <div className={styles.option}>
                  <div className={styles.optionTitle}>Title Font</div>
                  <input type='text' className={styles.optionText} ref={titleFontRef}/>
                </div>
                <div className={styles.option}>
                  <div className={styles.optionTitle}>Title Weight</div>
                  <input type='range' min='200' max='900' defaultValue='700' step={100} className={styles.optionRange} onChange={(e)=>{changeTitleWeight(e.target.value)}}/>
                </div>
                <div className={styles.option}>
                  <div className={styles.optionTitle}>Title X</div>
                  <input type='range' min='0' max='100' defaultValue='50' className={styles.optionRange} onChange={(e)=>{changeTitlePosition('x',e.target.value)}}/>
                  <div className={styles.optionValue} ref={titleXRef}>50</div>
                </div>
                <div className={styles.option}>
                  <div className={styles.optionTitle}>Title Y</div>
                  <input type='range' min='0' max='100' defaultValue='5' className={styles.optionRange} onChange={(e)=>{changeTitlePosition('y',e.target.value)}}/>
                  <div className={styles.optionValue} ref={titleYRef}>5</div>
                </div>
                <div className={styles.option}>
                  <div className={styles.optionTitle}>Rounds Font</div>
                  <input type='text' className={styles.optionText} ref={roundFontRef}/>
                </div>
                <div className={styles.option}>
                  <div className={styles.optionTitle}>Team Font</div>
                  <input type='text' className={styles.optionText} ref={teamFontRef}/>
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
                <option value='none'>None</option>
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
          <div className={styles.proceedButton}  onClick={()=>setCurrentTab('Brackets')}>← Go Back</div>
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
