import { Spin } from "antd";

export default () => {
  return (
    <div className="page-loading">
      <Spin />
      <style jsx>{`
        .page-loading {
          display: flex;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.3)
          z-index: 1000;
          align-items: center;
          justify-content: center;
        }
      `}</style>
  </div>
  )


}
