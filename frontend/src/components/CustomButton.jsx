import React from 'react'
import styles from './CustomButton.module.css'
export default function CustomButton({btnText="",customStyle="", handler=()=>{}}) {
  return (
    <button className={`${styles.defaultStyle} ${customStyle}`} onClick={handler}>{btnText||"Submit"}</button>
  )
}
