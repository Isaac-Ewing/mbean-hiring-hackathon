import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/supaContext';
import '../whiteboard.css';

export default function Whiteboard() {
  const { supabase } = useAppContext();
  const canvasRef = useRef(null);
  const colorsRef = useRef(null);
  let whiteBoardMemory = null;

  useEffect(() => {
    const canvas = canvasRef.current;
    const test = colorsRef.current;
    const context = canvas.getContext('2d');

    const colors = document.getElementsByClassName('color');
    console.log(colors, 'the colors');
    console.log(test);
    const current = {
      color: colors.value,
    };

    const onColorUpdate = (e) => {
      current.color = e.target.value;
    };

    for (let i = 0; i < colors.length; i++) {
      colors[i].addEventListener('click', onColorUpdate, false);
    }
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

    const onMouseDown = (e) => {
      drawing = true;
      current.x = e.clientX || e.touches[0].clientX;
      current.y = e.clientY || e.touches[0].clientY;
    };

    const onMouseMove = (e) => {
      if (!drawing) {
        return;
      }
      drawLine(
        current.x,
        current.y,
        e.clientX || e.touches[0].clientX,
        e.clientY || e.touches[0].clientY,
        current.color,
        true
      );
      current.x = e.clientX || e.touches[0].clientX;
      current.y = e.clientY || e.touches[0].clientY;
    };

    const onMouseUp = (e) => {
      if (!drawing) {
        return;
      }
      drawing = false;
      drawLine(
        current.x,
        current.y,
        e.clientX || e.touches[0].clientX,
        e.clientY || e.touches[0].clientY,
        current.color,
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
        console.log(data);
        data.forEach((item) => {
          onDrawingEvent(item.whiteboard_data);
        });
        whiteBoardMemory = supabase
          .from('whiteboard')
          .on('*', (payload) => {
            console.log(payload.new.whiteboard_data, 'payload');
            onDrawingEvent(payload.new.whiteboard_data);
          })
          .subscribe();
      }
    };
    getWhiteBoardMemory();
  }, []);

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

      <div ref={colorsRef} className='colors'>
        <input className='color' ref={colorsRef} id='color' type='color' />
        {/* 
        <div className='color black' />
        <div className='color red' />
        <div className='color green' />
        <div className='color blue' />
        <div className='color yellow' /> */}
        <button onClick={clear}>clearAll</button>
        <button onClick={DownloadCanvasAsImage}>Save</button>
        <Link to='/about'>About</Link>
      </div>
    </div>
  );
}
