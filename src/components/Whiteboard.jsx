/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/supaContext';
import '../whiteboard.css';

export default function Whiteboard() {
  const { supabase } = useAppContext();
  const canvasRef = useRef(null);
  let whiteBoardMemory = null;
  const [paintColor, setPaintColor] = useState('');

  const updatePaintColor = (event) => {
    setPaintColor(event.target.value);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const current = {
      color: paintColor,
    };
    let drawing = false;

    const drawLine = async (x0, y0, x1, y1, color, emit) => {
      context.beginPath();
      context.moveTo(x0, y0);
      context.lineTo(x1, y1);
      context.strokeStyle = color;
      context.lineWidth = 2;
      context.stroke();
      context.closePath();

      if (!emit) {
        return;
      }
      const w = canvas.width;
      const h = canvas.height;

      const { data, error } = await supabase.from('whiteboard').insert([
        {
          whiteboard_data: {
            x0: x0 / w,
            y0: y0 / h,
            x1: x1 / w,
            y1: y1 / h,
            color,
          },
        },
      ]);
      if (error) {
        console.log(error);
      }
    };

    const onMouseDown = (event) => {
      drawing = true;
      current.x = event.clientX || event.touches[0].clientX;
      current.y = event.clientY || event.touches[0].clientY;
    };

    const onMouseMove = (event) => {
      if (!drawing) {
        return;
      }
      drawLine(
        current.x,
        current.y,
        event.clientX || event.touches[0].clientX,
        event.clientY || event.touches[0].clientY,
        current.color,
        true
      );
      current.x = event.clientX || event.touches[0].clientX;
      current.y = event.clientY || event.touches[0].clientY;
    };

    const onMouseUp = (event) => {
      if (!drawing) {
        return;
      }
      drawing = false;
      drawLine(
        current.x,
        current.y,
        event.clientX || event.touches[0].clientX,
        event.clientY || event.touches[0].clientY,
        paintColor,
        true
      );
    };

    const throttle = (callback, delay) => {
      let previousCall = new Date().getTime();
      return function () {
        const time = new Date().getTime();

        if (time - previousCall >= delay) {
          previousCall = time;
          callback.apply(null, arguments);
        }
      };
    };

    canvas.addEventListener('mousedown', onMouseDown, false);
    canvas.addEventListener('mouseup', onMouseUp, false);
    canvas.addEventListener('mouseout', onMouseUp, false);
    canvas.addEventListener('mousemove', throttle(onMouseMove, 10), false);

    canvas.addEventListener('touchstart', onMouseDown, false);
    canvas.addEventListener('touchend', onMouseUp, false);
    canvas.addEventListener('touchcancel', onMouseUp, false);
    canvas.addEventListener('touchmove', throttle(onMouseMove, 10), false);

    const onResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', onResize, false);
    onResize();

    const onDrawingEvent = (data) => {
      const w = canvas.width;
      const h = canvas.height;
      drawLine(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color);
    };

    const getWhiteBoardMemory = async () => {
      if (!whiteBoardMemory) {
        const { data, error } = await supabase
          .from('whiteboard')
          .select()
          .range(0, 1000)
          .order('id', { ascending: false });
        data.forEach((item) => {
          onDrawingEvent(item.whiteboard_data);
        });
        whiteBoardMemory = supabase
          .from('whiteboard')
          .on('*', (payload) => {
            onDrawingEvent(payload.new.whiteboard_data);
          })
          .subscribe();
      }
    };
    getWhiteBoardMemory();
  }, [paintColor]);

  const clear = async (event) => {
    event.preventDefault();
    const { data, error } = await supabase
      .from('whiteboard')
      .delete()
      .gt('id', 0);
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
  };

  function DownloadCanvasAsImage() {
    let downloadLink = document.createElement('a');
    downloadLink.setAttribute('download', 'CanvasAsImage.png');
    let canvas = document.getElementById('canvas');
    let dataURL = canvas.toDataURL('image/png');
    let url = dataURL.replace(
      /^data:image\/png/,
      'data:application/octet-stream'
    );
    downloadLink.setAttribute('href', url);
    downloadLink.click();
  }

  return (
    <div>
      <canvas ref={canvasRef} id='canvas' className='whiteboard' />

      <div className='colors'>
        <Link className='nav-link' to='/'>
          Homepage
        </Link>
        <br />
        <input
          onChange={(event) => updatePaintColor(event)}
          className='color'
          id='color'
          type='color'
          value={paintColor}
        />

        <br />
        <button onClick={clear}>clear All</button>
        <button onClick={DownloadCanvasAsImage}>Save</button>
      </div>
    </div>
  );
}
