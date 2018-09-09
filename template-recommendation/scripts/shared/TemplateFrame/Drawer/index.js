import React from 'react'

const Drawer = ( props ) => (
  <div className={`drawer ${ props.isOpen ? 'open' : 'close' }`}>
    <div className="drawer-nav">
      <button onClick={ props.gotoPrevous }
        className="btn-prev"
      />
      <p>{ props.activePage }</p>
      <button onClick={ props.gotoNext }
        className="btn-next"
      />
    </div>
    <div className='select-container'>
      {
        props.activePage === 'headline'      && (
          <ul className="select headline">
            <li onTouchEnd={props.setStyleOnIframe}
              onClick={props.setStyleOnIframe}
            >
              <div className="option"
                data-type="headline"
                data-option="headline-1"
                data-style="headline-1"
              >Handcrafted in Montréal</div>
            </li>
            <li onTouchEnd={props.setStyleOnIframe}>
              <div  onClick={ props.setStyleOnIframe }
                className="option"
                data-type="headline"
                data-option="headline-2"
                data-style="headline-2"
              >Handcrafted in Montréal</div>
            </li>
          </ul>
        )}
      {
        props.activePage === 'button'      && (
          <ul className="select button">
            <li>
              <div onTouchEnd={ props.setStyleOnIframe }
                onClick={ props.setStyleOnIframe }
                className="option"
                data-type="button"
                data-option="button-1"
                data-style="button-1"
              >SHOP NOW</div>
            </li>
            <li>
              <div onTouchEnd={ props.setStyleOnIframe }
                onClick={ props.setStyleOnIframe }
                className="option"
                data-type="button"
                data-option="button-2"
                data-style="button-2"
              >SHOP NOW</div>
            </li>
            <li>
              <div onTouchEnd={ props.setStyleOnIframe }
                onClick={ props.setStyleOnIframe }
                className="option"
                data-type="button"
                data-option="button-3"
                data-style="button-3"
              >SHOP NOW</div>
            </li>
          </ul>
        )}
      {
        props.activePage === 'header'      && (
          <ul className="select header">
            <li>
              <div onTouchEnd={ props.setStyleOnIframe }
                onClick={ props.setStyleOnIframe }
                className="option"
                data-type="header"
                data-option="header-1"
                data-style="header-1"
              >Header 1</div>
            </li>
            <li>
              <div onTouchEnd={ props.setStyleOnIframe }
                onClick={ props.setStyleOnIframe }
                className="option"
                data-type="header"
                data-option="header-2"
                data-style="header-2"
              >Header 2</div>
            </li>
          </ul>
        )}
      {
        props.activePage === 'image'      && (
          <ul className="select image">
            <li>
              <img onTouchEnd={props.setStyleOnIframe}
                onClick={props.setStyleOnIframe}
                className="option"
                data-type="image"
                data-option="https://static1.squarespace.com/static/5a822470cf81e06a648891d5/5a82257a71c10bb80be22457/5a9dc4a19140b7abaa46c034/1520288930617/default-main.jpg?format=500w"
                data-style="image-1"
                src="/assets/images/default/thumb.jpg"
              />
            </li>
            <li>
              <img onTouchEnd={props.setStyleOnIframe}
                onClick={props.setStyleOnIframe}
                className="option"
                data-type="image"
                data-option="https://static1.squarespace.com/static/5a822470cf81e06a648891d5/5a82257a71c10bb80be22457/5a9dc4b2652dea4758ae248e/1520288948939/1-main.jpg?format=500w"
                data-style="image-2"
                src="/assets/images/1/thumb.jpg"
              />
            </li>
            <li>
              <img onTouchEnd={props.setStyleOnIframe}
                onClick={props.setStyleOnIframe}
                className="option"
                data-type="image"
                data-option="https://static1.squarespace.com/static/5a822470cf81e06a648891d5/5a82257a71c10bb80be22457/5a9dc4bc71c10b9a0b02e30d/1520288957103/2-main.jpg?format=500w"
                data-style="image-2"
                src="/assets/images/2/thumb.jpg"
              />
            </li>
            <li>
              <img onTouchEnd={props.setStyleOnIframe}
                onClick={props.setStyleOnIframe}
                className="option"
                data-type="image"
                data-option="https://static1.squarespace.com/static/5a822470cf81e06a648891d5/5a82257a71c10bb80be22457/5a9dc4c541920208ee83585d/1520288965815/3-main.jpg?format=500w"
                data-style="image-2"
                src="/assets/images/3/thumb.jpg"
              />
            </li>
            <li>
              <img onTouchEnd={props.setStyleOnIframe}
                onClick={props.setStyleOnIframe}
                className="option"
                data-type="image"
                data-option="https://static1.squarespace.com/static/5a822470cf81e06a648891d5/5a82257a71c10bb80be22457/5a9dc4cc24a694262599a390/1520288972623/4-main.jpg?format=500w"
                data-style="image-2"
                src="/assets/images/4/thumb.jpg"
              />
            </li>
          </ul>
        )}
    </div>
  </div>
)

export default Drawer
