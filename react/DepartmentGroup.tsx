import React, { FC, useState } from 'react'
import { useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = [
  'departmentGroup',
  'departmentGroupTitle',
  'departmentGroupBody',
] as const

interface Props {
  title: string
}

const DepartmentGroup: FC<Props> = ({ children, title }) => {
  const handles = useCssHandles(CSS_HANDLES)
  const [isCollapsed, setCollapse] = useState(false)

  const toggleCollapse = () => {
    setCollapse(!isCollapsed)
  }

  return (
    <div
      className={`flex-column ${handles.departmentGroup} ${
        isCollapsed ? 'collapsed' : ''
      }`}
    >
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
      <div
        className={`flex ${handles.departmentGroupTitle}`}
        onClick={() => toggleCollapse()}
      >
        {title}
      </div>
      <div className={`flex ${handles.departmentGroupBody}`}>{children}</div>
    </div>
  )
}

export default DepartmentGroup
