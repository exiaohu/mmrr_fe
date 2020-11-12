import React from "react"
import './index.css'
import {Card} from "antd";

export type PopupProps = {
  visible: boolean,
  x?: number,
  y?: number,
  setVisible?: (v: boolean) => void
}

const Popup: React.FC<PopupProps> = (props) => {
  return props.visible ? <Card
    onAbort={() => props.setVisible && props.setVisible(false)}
    size='small'
    className="popup"
    style={{
      left: `${props.x}px`, top: `${props.y}px`
    }}>
    {props.children}
  </Card> : null;
}

export default Popup;
