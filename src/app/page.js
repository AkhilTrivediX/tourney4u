'use client'
import Image from "next/image";
import styles from "./page.module.css";
import SingleTournament from "./components/singleTournament";
import { useState,useRef, useEffect, useReducer} from "react";
import { DiscordSDK } from "@discord/embedded-app-sdk";


export default function Home() {
  const [coverVisible, setCoverVisible] = useState(false);
  const [currentTab, setCurrentTab] = useState('Brackets');
  const [interfaceHidden, setInterfaceHidden] = useState(false);
  const teamCountTextRef = useRef(null);
  const layoutDirectionRef = useRef(null);
  const centralizedRef = useRef(null);
  const strokeStyleRef = useRef(null);
  const [setting, settingDispatch] = useReducer(settingReducer,{teamsCount:8,layoutDirection:'leftToRight',centralized:false,strokeStyle:'grid'});
  const coverRef = useRef(null);
  const mainRef = useRef(null);
  const mainColorRef = useRef(null);
  const [backgroundEnabled, setBackgroundEnabled] = useState(false);

  
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

  function changeSourceURL(url)
  {
    mainRef.current.style.setProperty('--backgroundurl',`url('${url}')`);
  }

  function changeBackgroundColor(color)
  {
    mainRef.current.style.setProperty('--backgroundcolor',color);
  }

  function changeBlur(value)
  {
    mainRef.current.style.setProperty('--blur',value+'px');
  }

  function toggleInterface(hidden)
  {
    setInterfaceHidden(!hidden);
  }

  function generateBrackets()
  {
    let teamsCount = Number.parseInt(teamCountTextRef.current.innerHTML);
    let layoutDirection = layoutDirectionRef.current.value;
    let centralized = centralizedRef.current.checked;
    let strokeStyle = strokeStyleRef.current.value;
    let mainColor = mainColorRef.current.value;
    let newSetting = {teamsCount,layoutDirection,centralized,strokeStyle,mainColor};

    //console.log('Updated',newSetting)
    coverRef.current.classList.remove(styles.invisible);
    setTimeout(()=>{
      settingDispatch({type:'SET_SETTING',payload:newSetting});
      mainRef.current.style.setProperty('--maincolor',mainColor);
      if(!backgroundEnabled) mainRef.current.style.setProperty('--backgroundcolor',mainColor);
    },500);
    setTimeout(()=>{coverRef.current.classList.add(styles.invisible)},1000);
    
  }


  useEffect(()=>{
    //console.log('Sensed Setting Changed',setting)
  },[setting]);
  return (
    <main className={styles.main} ref={mainRef}>
      <div className={styles.backgroundOverlay}></div>
      <div className={styles.bracketsBackground}></div>
      <SingleTournament teamsCount={setting.teamsCount} centralized={setting.centralized} layoutDirection={setting.layoutDirection} strokeStyle={setting.strokeStyle} mainColor={setting.mainColor}/>
      <div className={`${styles.settingInterface} ${interfaceHidden?styles.hidden:null}`}>
        <div className={styles.hideButton} onClick={()=>toggleInterface(interfaceHidden)}>{interfaceHidden?'⚙':'→'}</div>
        <div className={styles.interfaceTitle}>Tourney4U</div>
        <div className={styles.tabs}>
          <div className={`${styles.tab} ${currentTab=='Brackets'?styles.active:null}`} onClick={()=>setCurrentTab('Brackets')}>Brackets</div>
          <div className={`${styles.tab} ${currentTab=='Background'?styles.active:null}`} onClick={()=>setCurrentTab('Background')}>Background</div>
          <div className={`${styles.tab} ${currentTab=='Stroke'?styles.active:null}`} onClick={()=>setCurrentTab('Stroke')}>Stroke</div>
        </div>
        <div className={styles.settingsArea}>
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
              <input type='color' className={styles.optionColor} ref={mainColorRef} defaultValue={'#ff1f4f'}/>
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
              <input type='text' className={styles.optionText} placeholder="Image Link Here..." onChange={(e)=>changeSourceURL(e.target.value)}/>
            </div>
            <div className={styles.option}>
              <div className={styles.optionTitle}>Color</div>
              <input type='checkbox' className={styles.optionCheckbox} onChange={(e)=>setBackgroundEnabled(e.target.checked)}/>
              {backgroundEnabled && <input type='color' className={styles.optionColor} onChange={((e)=>changeBackgroundColor(e.target.value))}/>}
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
        </div>
        <div className={styles.actionButtons}>
          <div className={styles.generateButton} onClick={()=>generateBrackets()}>✨ Generate</div>
          <div className={styles.proceedButton}>Proceed to next Step →</div>
        </div>
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
