import React, { useEffect, useState } from "react"
import { RolllStateType } from "shared/models/roll"
import { RollStateIcon } from "staff-app/components/roll-state/roll-state-icon.component"
import { useDispatch } from 'react-redux'
import { update } from '../../../features/roll'

interface Props {
  initialState?: RolllStateType
  size?: number
  onStateChange?: (newState: RolllStateType) => void,
  _id: number | string
}
export const RollStateSwitcher: React.FC<Props> = ({ initialState = "unmark", size = 40, onStateChange, _id }) => {
  // console.log('_id: ', _id)
  const [rollState, setRollState] = useState(initialState)
  const dispatch = useDispatch()
  const nextState = () => {
    const states: RolllStateType[] = ["present", "late", "absent"]
    if (rollState === "unmark" || rollState === "absent") return states[0]
    const matchingIndex = states.findIndex((s) => s === rollState)
    return matchingIndex > -1 ? states[matchingIndex + 1] : states[0]
  }

  const onClick = (e: any) => {
    const next = nextState()
    setRollState(next)
    if (onStateChange) {
      onStateChange(next)
    }
    
  }

  
  useEffect(()=>{
    dispatch(update({_id,rollState}))
  },[rollState])
// OLD: remove roll = {_id} from here and child component as well
  return <RollStateIcon roll={_id} type={rollState} size={size} onClick={e => onClick(e)} />
}
