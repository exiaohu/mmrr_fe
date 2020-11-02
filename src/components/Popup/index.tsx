import React from "react"
import './index.css'
import {Card} from "antd";

export type PopupProps = {
  visible: boolean,
  child?: React.ReactNode,
  x?: number,
  y?: number,
  setVisible?: (v: boolean) => void
}

const Popup: React.FC<PopupProps> = ({child, visible, x, y, setVisible}) => {
  return visible ? <Card
    onAbort={() => setVisible && setVisible(false)}
    size='small'
    className="popup"
    style={{
      left: `${x}px`, top: `${y}px`
    }}>
    {child}
  </Card> : null;
}

export default Popup;
