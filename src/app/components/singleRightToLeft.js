'use client'
import Xarrow,{useXarrow} from 'react-xarrows';
import styles from './single.module.css'
import { teamIconGenerator } from './singleTournament';
export default function SingleRightToLeft({tourneyData, tourneyDispatch}){
    const updateXarrow = useXarrow();
    console.log('In RightToLeft with :',tourneyData.settings.blockIcons)

    function getRoundName(index,teamsCount){
        let roman = ['I','II','III','IV','V'];
        if(teamsCount-index==1) return 'Final';
        if(teamsCount-index==2) return 'Semi-Final';
        return 'Round '+roman[index];
    }
    
    return(
        <div className={styles.bracketsArea}>
                    {tourneyData.matches.map((round,index)=>{
                        return (
                            <div className={styles.round} key={index} style={{height:tourneyData.settings.centralized?'auto':'100%'}}>
                               
                                {round.map((match,index2)=>{
                                    return (
                                        <div className={styles.match} key={match.join('x')} id = {match.join('x')}>
                                            
                                            
                                            {match.map((team,index3)=>{
                                                return (
                                                    <div className={styles.team} key={team}>
                                                        {teamIconGenerator(team.endsWith('x')?team.substring(0,team.length-1):team,tourneyData.settings.teamIconType,tourneyData)}
                                                        <div className={styles.teamName}>{tourneyData.settings.blockNames[team.endsWith('x')?team.substring(0,team.length-1):team] || '⠀'}</div>
                                                    </div>
                                                )
                                            })}
                                            {index2==0 && <div className={styles.roundName} style={tourneyData.matches.length-index==1?{top:'-60%'}:{}}>{getRoundName(index,tourneyData.matches.length)}</div>}
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
                                    <Xarrow key={index+'x1'} start={join[0]} end={join[2]} label={join[2]} color={tourneyData.settings.mainColor} strokeWidth={tourneyData.settings.strokeWidth} path={tourneyData.settings.strokeStyle}/>
                                    <Xarrow key={index+'x2'} start={join[1]} end={join[2]} label={join[2]} color={tourneyData.settings.mainColor} strokeWidth={tourneyData.settings.strokeWidth} path={tourneyData.settings.strokeStyle}/>
                                </>
                            )
                        })
                    }
                </div>
    )
}   