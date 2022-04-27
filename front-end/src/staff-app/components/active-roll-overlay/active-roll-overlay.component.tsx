import React, { useEffect, useState } from "react"
import styled from "styled-components"
import Button from "@material-ui/core/Button"
import { BorderRadius, Spacing } from "shared/styles/styles"
import { RollStateList } from "staff-app/components/roll-state/roll-state-list.component"
import { useSelector } from 'react-redux'

export type ActiveRollAction = "filter" | "exit"
interface Props {
  isActive: boolean
  onItemClick: (action: ActiveRollAction, value?: string) => void,
  onRollFilter: (e) => void
}

export const ActiveRollOverlay: React.FC<Props> = (props) => {
  const { isActive, onItemClick, onRollFilter } = props
  const rollStateList = useSelector(state => state.roll.value)
  const [_stateList, set_StateList] = useState([
    { type: "all", count: 0 },
    { type: "present", count: 0 },
    { type: "late", count: 0 },
    { type: "absent", count: 0 }
  ]
  )
  useEffect(()=>{
    const _list: any = [
      { type: 'all', count: Object.keys(rollStateList).length},
      { type: 'present', count: 0 },
      { type: 'late', count: 0 },
      { type: 'absent', count: 0 },
    ]
    // console.log('ran becoz changed')
    rollStateList.forEach((r:any) => {
      if(r === 'present') ++_list[1].count
      else if(r === 'late') ++_list[2].count
      else if(r === 'absent') ++_list[3].count
    })
    // console.log(rollStateList)
    set_StateList(_list)
    
  },[rollStateList])
  //handle roll filter 
  // const handleRollFilter = () => {
  //   console.log('HEREEEEEEEEEEEEEEEEEEERERE')
  // }
  return (
    <S.Overlay isActive={isActive}>
      <S.Content>
        <div>Class Attendance</div>
        <div>
          <RollStateList
            stateList={_stateList}
            onItemClick = {(e) => onRollFilter(e)}
          />
          <div style={{ marginTop: Spacing.u6 }}>
            <Button color="inherit" onClick={() => onItemClick("exit")}>
              Exit
            </Button>
            <Button color="inherit" style={{ marginLeft: Spacing.u2 }} onClick={() => onItemClick("exit")}>
              Complete
            </Button>
          </div>
        </div>
      </S.Content>
    </S.Overlay>
  )
}

const S = {
  Overlay: styled.div<{ isActive: boolean }>`
    position: fixed;
    bottom: 0;
    left: 0;
    height: ${({ isActive }) => (isActive ? "120px" : 0)};
    width: 100%;
    background-color: rgba(34, 43, 74, 0.92);
    backdrop-filter: blur(2px);
    color: #fff;
  `,
  Content: styled.div`
    display: flex;
    justify-content: space-between;
    width: 52%;
    height: 100px;
    margin: ${Spacing.u3} auto 0;
    border: 1px solid #f5f5f536;
    border-radius: ${BorderRadius.default};
    padding: ${Spacing.u4};
  `,
}
