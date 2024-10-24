
function sentnelhub() {
  window.location.href = 'https://sentnel-hub.netlify.app/';
}

function App() {
  return (
    <div>
      <button
        onClick={sentnelhub}
        style={{
          backgroundColor: 'green',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Open Sentinel Hub
      </button>
    </div>
  );
}

export default App;
