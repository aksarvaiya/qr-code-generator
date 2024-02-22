import React, { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import "./App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";

export default function App() {
  const [qrVal, setQrVal] = useState("");
  const [generatedQrVal, setGenQrVal] = useState("");
  const [showQr, setShowQr] = useState(false);
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [theme, setTheme] = useState('light');
  let sun = window.document.getElementById('sun')
  let moon = window.document.getElementById('moon');

  function toggleTheme(){
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  }

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  //set state value for qr code
  function handleChange(e) {
    setQrVal(e.target.value);
  }

  //Keyboard Accessibility
  function handleKeyPress(e) {
    e.key === "Enter" && generateQr();
  }
  function handleKeyDl(e) {
    e.key === "Enter" && downloadQR();
  }

  //changes styling state for QR code
  function handleFgVal(e) {
    setFgColor(e.target.value);
  }
  function handleBgVal(e) {
    setBgColor(e.target.value);
  }

  //if input field has a value generate new QR
  function generateQr() {
    qrVal
      ? (setShowQr(true), setGenQrVal(qrVal))
      : alert("Please Enter your text or URL of choice!");
  }

// converts the QRCode SVG element to an image by rendering it onto a canvas,
//converting the canvas content to a PNG Data URL,
//and then triggering the download of the resulting image.
function downloadQR() {
  const svg = document.getElementById("QRCode");
  const svgData = new XMLSerializer().serializeToString(svg);
  const canvas = document.createElement("canvas");
  // Increase the scale factor to get a higher resolution image (e.g., 2x, 3x, etc.).
  const scale = 2;
  const canvasWidth = svg.width.baseVal.value * scale;
  const canvasHeight = svg.height.baseVal.value * scale;
  const ctx = canvas.getContext("2d");
  const img = new Image();
  img.onload = () => {
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    // Scale the image up to match the canvas size for higher resolution.
    ctx.scale(scale, scale);
    ctx.drawImage(img, 0, 0);
    const pngFile = canvas.toDataURL("image/png");
    const downloadLink = document.createElement("a");
    downloadLink.download = "QRCode";
    downloadLink.href = `${pngFile}`;
    downloadLink.click();
  };
  img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
}


  return (
    <main>
      <button className="themeToggle" onClick={toggleTheme}>
        <FontAwesomeIcon icon={faSun} className={theme === 'light' ? 'light-active' : ''}/>
        <FontAwesomeIcon icon={faMoon} className={theme === 'dark' ? 'dark-active' : ''}/>
      </button>
      <section>
        {showQr ? (
          <section className="colorPicker">
            <div className="fg-box">
              <p>Foreground Color</p>
              <input
                id="fg-color"
                type="color"
                value={fgColor}
                onChange={handleFgVal}
              />
            </div>
            <div className="bg-box">
              <p>Background Color</p>
              <input
                id="bg-color"
                type="color"
                value={bgColor}
                onChange={handleBgVal}
              />
            </div>
          </section>
        ) : (
          <h1>Enter a URL to Generate Your QR Code!</h1>
        )}
        <div className="qrCode">
          {showQr ? (
            <QRCode
              id="QRCode"
              size={200}
              fgColor={fgColor}
              bgColor={bgColor}
              value={generatedQrVal}
            />
          ) : (
            <h2>QR Box</h2>
          )}
        </div>
        {showQr && (
          <button
            className="dwnlBtn"
            onClick={downloadQR}
            onKeyDown={handleKeyDl}
          >
            Download QR
          </button>
        )}
        <div
          className="genQr"
          style={{ display: "flex", alignItems: "center" }}
        >
          <input
            type="text"
            placeholder="Your url or text.."
            onChange={handleChange}
            onKeyDown={handleKeyPress}
          />
          <button onClick={generateQr}>Generate!</button>
        </div>
      </section>
    </main>
  );
}