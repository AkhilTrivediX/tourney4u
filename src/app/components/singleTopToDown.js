'use client'
import Xarrow,{useXarrow} from 'react-xarrows';
import styles from './single.module.css'
import { useEffect,useState } from 'react';
import { teamIconGenerator } from './singleTournament';
export default function SingleLeftToRight({tourneyData, tourneyDispatch}){
    const updateXarrow = useXarrow();
    return(
        <div className={styles.bracketsArea} style={{flexDirection:'column'}}>
                    {tourneyData.matches.map((round,index)=>{
                        return (
                            <div className={styles.round} key={index} style={{margin:'20px 10px', flexDirection:'row', height:'auto', width:tourneyData.settings.centralized?'auto':'100%'}}>
                                {round.map((match,index)=>{
                                    return (
                                        <div className={styles.match} key={match.join('x')} id = {match.join('x')}>
                                            {match.map((team,index)=>{
                                                return (
                                                    <div className={styles.team} key={team}>
                                                        {teamIconGenerator(team.endsWith('x')?team.substring(0,team.length-1):team,tourneyData.settings.teamIconType,tourneyData)}
                                                        <div className={styles.teamName}>{tourneyData.settings.blockNames[team.endsWith('x')?team.substring(0,team.length-1):team] || '⠀'}</div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    )
                                })}
                            </div>
                        )
                    })}
                    {
                        tourneyData.joins.map((join,index)=>{
                            return (
                                <>
                                    <Xarrow key={index+'x1'} start={join[0]} end={join[2]} label={join[2]} color={tourneyData.settings.mainColor} strokeWidth={tourneyData.settings.strokeWidth} path={tourneyData.settings.strokeStyle} startAnchor={'bottom'} endAnchor={'top'}/>
                                    <Xarrow key={index+'x2'} start={join[1]} end={join[2]} label={join[2]} color={tourneyData.settings.mainColor} strokeWidth={tourneyData.settings.strokeWidth} path={tourneyData.settings.strokeStyle} startAnchor={'bottom'} endAnchor={'top'}/>
                                </>
                            )
                        })
                    }
                </div>
    )
}   