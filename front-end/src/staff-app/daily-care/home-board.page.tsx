import React, { useState, useEffect } from "react"
import styled from "styled-components"
import Button from "@material-ui/core/ButtonBase"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Spacing, BorderRadius, FontWeight } from "shared/styles/styles"
import { Colors } from "shared/styles/colors"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"
import { Person } from "shared/models/person"
import { useApi } from "shared/hooks/use-api"
import { StudentListTile } from "staff-app/components/student-list-tile/student-list-tile.component"
import { ActiveRollOverlay, ActiveRollAction } from "staff-app/components/active-roll-overlay/active-roll-overlay.component"

import { useDispatch, useSelector } from 'react-redux'
import { initial } from './../../features/roll'

export const HomeBoardPage: React.FC = () => {
  const [isRollMode, setIsRollMode] = useState(false)
  const [getStudents, data, loadState] = useApi<{ students: Person[] }>({ url: "get-homeboard-students" })
  const [_data, set_Data] = useState([])
  const SORT_ORDER = ['asc', 'desc', 'ascLast', 'descLast', 'id']
  const [sortDisplayText, setSortDisplayText] = useState('id')
  const [sortClicks, setSortClicks] = useState(0)
  const rollStateList = useSelector((state:any) => state.roll.value)
  const dispatch = useDispatch()
  useEffect(() => {
    void getStudents()
  }, [getStudents])

  const onToolbarAction = (action: ToolbarAction) => {
    if (action === "roll") {
      setIsRollMode(true)
    }
  }

  const onActiveRollAction = (action: ActiveRollAction) => {
    if (action === "exit") {
      setIsRollMode(false)
    }
  }
  const handleSortClick = (): void => {
    setSortDisplayText(SORT_ORDER[(sortClicks)%5])
    setSortClicks(prevState => ++prevState)
    sortNames()
  }

  const handleSearchChange = (e) => {
    const _search = e.target.value
    let a = [1, 2, 3,4,5]
    const _found : Person[] | undefined = data?.students.filter(stu => stu.first_name === _search || stu.last_name === _search || stu.id == _search)
    console.log(_found)
    set_Data(_found?_found:[])
  }
  function sortNames(order:number=sortClicks){
    console.log(order)
    // const _data = data?.students
    const _sortIndex: number = order%5
    if(SORT_ORDER[_sortIndex] === SORT_ORDER[0]){
      data?.students.sort((a:Person, b:Person) : boolean => a.first_name.localeCompare(b.first_name) )
      console.log(data)
    }
    else if(SORT_ORDER[_sortIndex] === SORT_ORDER[1]){
      data?.students.sort((a:Person, b:Person) : boolean => b.first_name.localeCompare(a.first_name) )
    }
    else if(SORT_ORDER[_sortIndex] === SORT_ORDER[2]){
      data?.students.sort((a:Person, b:Person) : boolean => a.last_name.localeCompare(b.last_name) )
    }
    else if(SORT_ORDER[_sortIndex] === SORT_ORDER[3]){
      data?.students.sort((a:Person, b:Person) : boolean => b.last_name.localeCompare(a.last_name) )
    }
    else if(SORT_ORDER[_sortIndex] === SORT_ORDER[4]){
      data?.students.sort((a:Person, b:Person) : boolean => a.id - b.id)
    }
  }
  // setInterval(()=> console.log(rollStateList), 2000)
  //ADDED: roll handlers
  //initial state set
  useEffect(()=>{
    if(typeof(data) !== 'undefined')  dispatch(initial({len: data.students.length, rollState:'unmark'}))
    
  },[data])
  //roll filter handler
  const handleRollFilter = (e) => {
    console.log('Handling ', e.target)
  }
  return (
    <>
      <S.PageContainer>
        <Toolbar 
          onItemClick={onToolbarAction} 
          onSortClick={handleSortClick} 
          sortDisplay={sortDisplayText} 
          onSearchChange={handleSearchChange}
        />

        {loadState === "loading" && (
          <CenteredContainer>
            <FontAwesomeIcon icon="spinner" size="2x" spin />
          </CenteredContainer>
        )}

        {loadState === "loaded" && _data.length !== 0 && data?.students && (
          <>
            {_data.map((s) => (
              <StudentListTile key={s.id} isRollMode={isRollMode} student={s} />
            ))}
          </>
        )}

        {loadState === "loaded" && _data.length === 0 && data?.students && (
          <>
            {data.students.map((s) => (
              <StudentListTile key={s.id} isRollMode={isRollMode} student={s} />
            ))}
          </>
        )}

        {loadState === "error" && (
          <CenteredContainer>
            <div>Failed to load</div>
          </CenteredContainer>
        )}
      </S.PageContainer>
      <ActiveRollOverlay onRollFilter={(e) => handleRollFilter(e)} isActive={isRollMode} onItemClick={onActiveRollAction} />
    </>
  )
}

type ToolbarAction = "roll" | "sort"
interface ToolbarProps {
  onItemClick: (action: ToolbarAction, value?: string) => void,
  onSortClick: () => void,
  sortDisplay: string,
  onSearchChange: (e:any) => void
}
const Toolbar: React.FC<ToolbarProps> = (props) => {
  const { onItemClick, onSortClick, sortDisplay, onSearchChange } = props
  
  return (
    <S.ToolbarContainer>
      <div onClick={() => {onSortClick(); onItemClick("sort");}}>Name ({sortDisplay})</div>
      {/* <div></div> */}
      <input type='text' placeholder='search' style={styles.inputStyles} onChange={(e) => onSearchChange(e)}/>
      <S.Button onClick={() => onItemClick("roll")}>Start Roll</S.Button>
    </S.ToolbarContainer>
  )
}

const S = {
  PageContainer: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 140px;
  `,
  ToolbarContainer: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    background-color: ${Colors.blue.base};
    padding: 6px 14px;
    font-weight: ${FontWeight.strong};
    border-radius: ${BorderRadius.default};
  `,
  Button: styled(Button)`
    && {
      padding: ${Spacing.u2};
      font-weight: ${FontWeight.strong};
      border-radius: ${BorderRadius.default};
    }
  `,
}

const styles = {
  inputStyles: {
    'outline': 'none',
    'border': 'none',
    'background': 'transparent',
    'color': '#efefef',
    'borderBottom': '1px solid #efefef'
  }
}
