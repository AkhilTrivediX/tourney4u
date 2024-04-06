'use client'
import { useEffect, useReducer } from "react"
import styles from './single.module.css'
import Xarrow, {useXarrow, Xwrapper} from "react-xarrows";
import SingleLeftToRight from "./singleLeftToRight";
import SingleRightToLeft from "./singleRightToLeft";
import SingleTopToDown from "./singleTopToDown";
import SingleDownToTop from "./singleDownToTop";

export default function SingleTournament({teamsCount,centralized=false,layoutDirection='leftToRight',strokeStyle='grid',mainColor='#ff5482'}){

    //console.log('In Tourney Manager with color:',mainColor)
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
    const [tourneyData, tourneyDispatch] = useReducer(tourneyReducer,{rounds:0,byes:0,matches:[], joins:[],settings:{teamsCount,centralized,layoutDirection,strokeStyle,mainColor}});

    useEffect(()=>{
        tourneyDispatch({type:"UPDATE_SETTINGS",payload:{teamsCount,centralized,layoutDirection,mainColor}});
    },[teamsCount,centralized,layoutDirection,strokeStyle,mainColor])


    function getMatches(teamsCount,byes, teamIDs=[],joins, powerOf2Bool=true)
    {
        
        let matches = [];
        if(byes!=0)
        {
            let curr = 1;
            for(let i=0;i<Math.floor(byes/2)+byes%2;i++)
            {
                matches.push([""+curr++]);
            }
            for(let i=0;i<teamsCount/2;i++)
            {
                matches.push([""+curr++,""+curr++]);
            }
            for(let i=0;i<Math.floor(byes/2);i++)
            {
                matches.push([""+curr++]);
            }  
            return [matches,...getMatches(teamsCount/2+byes,0,matches,joins,false)];          
        }
        else
        {
            if(teamsCount < 2)
            {
                return [];
            }
            if(teamIDs.length == 0)
            {
                let curr=0;
                for(let i=0;i<teamsCount;i++)
                {
                    teamIDs.push([""+curr++]);
                }
            }
            for(let i=0;i<teamsCount;i+=2)
            {
                let firstTeam = teamIDs[i].length==1?teamIDs[i][0]:teamIDs[i][0]+'x'+teamIDs[i][1];
                let secondTeam = teamIDs[i+1].length==1?teamIDs[i+1][0]:teamIDs[i+1][0]+'x'+teamIDs[i+1][1];
                if(!powerOf2Bool) joins.push([firstTeam,secondTeam,firstTeam+'x'+secondTeam])
                matches.push([firstTeam,secondTeam]);
            }
            return [matches,...getMatches(teamsCount/2,0, matches,joins,false)];
        }
    }
    useEffect(()=>{
        //Rounds
        let rounds = Math.ceil(Math.log2(teamsCount));

        //Byes
        let byes = Math.pow(2,rounds) - teamsCount ;

        //Matches
        let joins=[];
        let matches = getMatches(teamsCount-byes,byes,[],joins);
        matches.push([['Winner']]);
        let endToWinner = matches[matches.length-2][0][0]+'x'+matches[matches.length-2][0][1];
        joins.push([endToWinner,endToWinner,'Winner']);
        tourneyDispatch({type:"SET_DATA",payload:{rounds,byes,matches,joins,settings:tourneyData.settings}});
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