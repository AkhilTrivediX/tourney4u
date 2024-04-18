'use client'
import { useEffect, useReducer } from "react"
import styles from './single.module.css'
import Xarrow, {useXarrow, Xwrapper} from "react-xarrows";
import SingleLeftToRight from "./singleRightToLeft";
import SingleRightToLeft from "./singleLeftToRight";
import SingleTopToDown from "./singleTopToDown";
import SingleDownToTop from "./singleDownToTop";

export default function SingleTournament({teamsCount,centralized=false,layoutDirection='leftToRight',strokeStyle='grid',mainColor='#ff5482',strokeWidth=2,settingData,settingDispatch}){

    //console.log('In Tourney Manager with :',settingData.blockNames)
    function tourneyReducer(state,action)
    {
        let pastState = {...state};
        switch(action.type)
        {
            case 'SET_DATA':
                return {...action.payload};
            case 'UPDATE_SETTINGS':
                return {...pastState,settings:{...action.payload}};
            default:
                return pastState;
        }
    }
    const [tourneyData, tourneyDispatch] = useReducer(tourneyReducer,{rounds:0,byes:0,matches:[], joins:[],settings:{teamsCount,centralized,layoutDirection,strokeStyle,mainColor,strokeWidth,blockNames:settingData.blockNames},teamNames:{}});

    useEffect(()=>{
        tourneyDispatch({type:"UPDATE_SETTINGS",payload:{teamsCount,centralized,layoutDirection,strokeStyle,mainColor,strokeWidth,blockNames:settingData.blockNames}});
    },[teamsCount,centralized,layoutDirection,strokeStyle,mainColor,strokeWidth,settingData.blockNames])


    function getMatches(teamsCount,byes, teamIDs=[],joins,textRequirements, powerOf2Bool=true)
    {
        
        let matches = [];
        if(byes!=0)
        {
            let curr = 0;
            for(let i=0;i<Math.floor(byes/2)+byes%2;i++)
            {
                matches.push([""+curr++]);

            }
            let currentTextRequirements=[];
            for(let i=0;i<teamsCount/2;i++)
            {
                matches.push([""+curr++,""+curr++]);
                currentTextRequirements.push({qualifier:i+1,team1:curr-2,team2:curr-1,winner:curr-2+'x'+curr-1});
            }
            textRequirements.push(currentTextRequirements);
            for(let i=0;i<Math.floor(byes/2);i++)
            {
                matches.push([""+curr++]);
            }  
            return [matches,...getMatches(teamsCount/2+byes,0,matches,joins,textRequirements,false)];          
        }
        else
        {
            if(teamsCount < 2)
            {
                return [];
            }
            if(teamIDs.length == 0)
            {
                let currentTextRequirements=[];
                let curr=0;
                for(let i=0;i<teamsCount;i++)
                {
                    teamIDs.push([""+curr++]);
                    if(i%2==0) currentTextRequirements.push({qualifier:(i/2)+1,team1:curr-1,team2:curr,winner:curr-1+'x'+curr});
                }
                textRequirements.push(currentTextRequirements);
            }
            let qualifierID = 1;
            let currentTextRequirements = []
            for(let i=0;i<teamsCount;i+=2)
            {
                let firstTeam = teamIDs[i].length==1?teamIDs[i][0]:teamIDs[i][0]+'x'+teamIDs[i][1];
                let secondTeam = teamIDs[i+1].length==1?teamIDs[i+1][0]:teamIDs[i+1][0]+'x'+teamIDs[i+1][1];
                if(!powerOf2Bool){joins.push([firstTeam,secondTeam,firstTeam+'x'+secondTeam])
                currentTextRequirements.push({
                    qualifier: qualifierID++,
                    team1: firstTeam,
                    team2: secondTeam,
                    winner: firstTeam+'x'+secondTeam
                });
            }
                matches.push([firstTeam,secondTeam]);
            }

            if(currentTextRequirements.length>0) textRequirements.push(currentTextRequirements);
            return [matches,...getMatches(teamsCount/2,0, matches,joins,textRequirements,false)];
        }
    }
    useEffect(()=>{
        //Rounds
        let rounds = Math.ceil(Math.log2(teamsCount));

        //Byes
        let byes = Math.pow(2,rounds) - teamsCount ;

        //Matches
        let joins=[];
        let textRequirements=[];
        let matches = getMatches(teamsCount-byes,byes,[],joins,textRequirements);
        console.log('Text Requirements:',textRequirements)
        let Winner = matches[matches.length-1][0][0]+'x'+matches[matches.length-1][0][1];
        let endToWinner = matches[matches.length-2][0][0]+'x'+matches[matches.length-2][0][1];
        console.log(`Connecting ${endToWinner} to ${Winner+'x'}`);
        matches.push([[Winner+'x']]);
        joins.push([Winner,Winner,Winner+'x']);
        
        tourneyDispatch({type:"SET_DATA",payload:{rounds,byes,matches,joins,settings:tourneyData.settings}});
        settingDispatch({type:'CHANGE_SETTING',key:'textRequirements',value:textRequirements});
    },[tourneyData.settings]);

    function getLayout(layoutDirection){
        switch(layoutDirection)
        {
            case 'leftToRight':
                return <SingleLeftToRight tourneyData={tourneyData} tourneyDispatch={tourneyDispatch}/>
            case 'rightToLeft':
                return <SingleRightToLeft tourneyData={tourneyData} tourneyDispatch={tourneyDispatch}/>
            case 'topToDown':
                return <SingleTopToDown tourneyData={tourneyData} tourneyDispatch={tourneyDispatch}/>
            case 'downToTop':
                return <SingleDownToTop tourneyData={tourneyData} tourneyDispatch={tourneyDispatch}/>
            default:
                return <SingleLeftToRight tourneyData={tourneyData} tourneyDispatch={tourneyDispatch}/>
        }
    
    }
    return (
        <div>
            <div className={styles.main}>
                
                {getLayout(layoutDirection)}
            </div>
        </div>
    )
}