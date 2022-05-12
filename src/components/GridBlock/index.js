import "./style.scss";

const GridBlock = ({ children, classes, title }) => (
  <div className={`grid-block ${classes || ""}`}>
    {title && <div className="grid-block__title">{title}</div>}
    <div className="grid-block__body">{children}</div>
  </div>
);

export default GridBlock;
