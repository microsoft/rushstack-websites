import React from 'react';

// Default implementation, that you can customize
function Root(props: { children: unknown }) {
  const style: React.CSSProperties = {
    height: '48px',
    background: '#555555',
    color: '#ffffff',
    fontWeight: '500',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  };
  const style2: React.CSSProperties = {
    paddingLeft: '32px'
  };
  const style3: React.CSSProperties = {
    width: '2px',
    height: '80%',
    background: '#808080'
  };

  return (
    <>
      <div style={style}>
        <img
          src={'/images/rs-hamburger.svg'}
          style={{ height: '20px', paddingLeft: '16px', paddingRight: '16px' }}
        />
        <div style={style3} />

        <div style={style2}>Roadmap</div>
        <div style={style2}> Shop</div>
        <div style={style2}>Events</div>
        <div style={style2}>Community</div>
      </div>

      {props.children}
    </>
  );
}

export default Root;
